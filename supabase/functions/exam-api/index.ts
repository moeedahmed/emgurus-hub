import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getPathParts(url: string) {
  const raw = new URL(url).pathname;
  const path = raw
    .replace(/^\/functions\/v1\/exam-api\/?/, "")
    .replace(/^\/exam-api\/?/, "");
  return path.split("/").filter(Boolean);
}

/** Check if the authenticated user has a specific role */
async function hasRole(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  role: string
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", role)
    .maybeSingle();
  return !!data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization") ?? "";

  // User-scoped client (respects RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  // Service-role client (bypasses RLS for admin/role checks)
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const parts = getPathParts(req.url);
  const searchParams = new URL(req.url).searchParams;

  // Expected: /api/exam/...
  if (parts[0] !== "api" || parts[1] !== "exam") {
    return json({ error: "Not found" }, 404);
  }

  try {
    // ─── Route 1: POST /api/exam/generate-question ───
    if (
      req.method === "POST" &&
      parts.length === 3 &&
      parts[2] === "generate-question"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);
      if (!GEMINI_API_KEY)
        return json({ error: "AI generation not configured" }, 503);

      const body = await req.json();
      const { exam_id, topic_id, difficulty_level, count = 1 } = body;

      if (!exam_id)
        return json({ error: "exam_id is required" }, 400);

      // Fetch exam metadata for prompt context
      const { data: exam } = await supabaseAdmin
        .from("exam_exams")
        .select("name, board, curriculum, format_prompt")
        .eq("id", exam_id)
        .single();

      if (!exam) return json({ error: "Exam not found" }, 404);

      // Fetch topic name if provided
      let topicName = "";
      if (topic_id) {
        const { data: topic } = await supabaseAdmin
          .from("exam_topics")
          .select("name")
          .eq("id", topic_id)
          .single();
        topicName = topic?.name ?? "";
      }

      const isAdmin = await hasRole(supabaseAdmin, user.id, "admin");

      // Build prompt
      const prompt = [
        exam.format_prompt || `Generate MCQ questions for ${exam.name}.`,
        topicName ? `Topic: ${topicName}` : "",
        difficulty_level ? `Difficulty: ${difficulty_level}` : "",
        `Generate exactly ${Math.min(count, 10)} questions.`,
        `Return a JSON array of objects, each with: stem, options (array of {key, text}), correct_answer, difficulty_level, per_option_explanations (object with keys A-E).`,
        `Return ONLY the JSON array, no markdown or extra text.`,
      ]
        .filter(Boolean)
        .join("\n");

      // Call Gemini API
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return json(
          { error: "AI generation failed", detail: errText.slice(0, 200) },
          502
        );
      }

      const geminiData = await geminiRes.json();
      const rawText =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

      // Extract JSON from response (strip markdown fences if present)
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      let questions: any[] = [];
      try {
        questions = JSON.parse(jsonMatch?.[0] ?? "[]");
      } catch {
        return json(
          { error: "Failed to parse AI response", raw: rawText.slice(0, 500) },
          502
        );
      }

      // For admins: persist questions as drafts
      if (isAdmin && questions.length > 0) {
        const rows = questions.map((q: any) => ({
          exam_id,
          topic_id: topic_id || null,
          stem: q.stem,
          options: q.options,
          correct_answer: q.correct_answer,
          difficulty_level: q.difficulty_level || difficulty_level || "C1",
          per_option_explanations: q.per_option_explanations || null,
          status: "draft",
          source_type: "ai",
          created_by: user.id,
        }));

        const { data: inserted, error } = await supabaseAdmin
          .from("exam_questions")
          .insert(rows)
          .select("id, stem, options, correct_answer, difficulty_level");

        if (error)
          return json({ error: error.message }, 400);

        return json({ questions: inserted });
      }

      // For regular users: return without persisting
      return json({ questions });
    }

    // ─── Route 2: POST /api/exam/attempt/start ───
    if (
      req.method === "POST" &&
      parts.length === 4 &&
      parts[2] === "attempt" &&
      parts[3] === "start"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const body = await req.json();
      const { exam_id, mode, topic_ids } = body;

      if (!exam_id || !mode)
        return json({ error: "exam_id and mode are required" }, 400);

      if (!["study", "exam"].includes(mode))
        return json({ error: "mode must be 'study' or 'exam'" }, 400);

      // Fetch published questions
      let query = supabaseAdmin
        .from("exam_questions")
        .select(
          "id, stem, options, correct_answer, difficulty_level, topic_id, per_option_explanations"
        )
        .eq("exam_id", exam_id)
        .eq("status", "published");

      if (topic_ids && topic_ids.length > 0) {
        query = query.in("topic_id", topic_ids);
      }

      // In exam mode, limit and randomize; in study mode, return all
      if (mode === "exam") {
        query = query.limit(50);
      }

      const { data: questions, error: qErr } = await query;
      if (qErr)
        return json({ error: qErr.message }, 400);

      // Shuffle questions
      const shuffled = (questions ?? []).sort(() => Math.random() - 0.5);

      // Create attempt
      const { data: attempt, error: aErr } = await supabaseAdmin
        .from("exam_attempts")
        .insert({
          user_id: user.id,
          exam_id,
          mode,
          total_questions: shuffled.length,
        })
        .select("id, started_at")
        .single();

      if (aErr)
        return json({ error: aErr.message }, 400);

      // In study mode, include correct_answer + explanations
      // In exam mode, strip answers
      const sanitized = shuffled.map((q: any) => {
        if (mode === "exam") {
          return {
            id: q.id,
            stem: q.stem,
            options: q.options,
            difficulty_level: q.difficulty_level,
            topic_id: q.topic_id,
          };
        }
        return q;
      });

      return json({
        attempt_id: attempt.id,
        started_at: attempt.started_at,
        questions: sanitized,
      });
    }

    // ─── Route 3: POST /api/exam/attempt/:id/submit ───
    if (
      req.method === "POST" &&
      parts.length === 5 &&
      parts[2] === "attempt" &&
      parts[4] === "submit"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const attemptId = parts[3];
      const body = await req.json();
      const { question_id, user_answer, time_spent_seconds } = body;

      if (!question_id || !user_answer)
        return json(
          { error: "question_id and user_answer are required" },
          400
        );

      // Verify attempt belongs to user
      const { data: attempt } = await supabaseAdmin
        .from("exam_attempts")
        .select("id, user_id, mode")
        .eq("id", attemptId)
        .single();

      if (!attempt || attempt.user_id !== user.id)
        return json({ error: "Attempt not found" }, 404);

      // Get question to check answer
      const { data: question } = await supabaseAdmin
        .from("exam_questions")
        .select("correct_answer, per_option_explanations")
        .eq("id", question_id)
        .single();

      if (!question)
        return json({ error: "Question not found" }, 404);

      const isCorrect = user_answer === question.correct_answer;

      // Insert attempt item
      const { error: itemErr } = await supabaseAdmin
        .from("exam_attempt_items")
        .insert({
          attempt_id: attemptId,
          question_id,
          user_answer,
          is_correct: isCorrect,
          time_spent_seconds: time_spent_seconds ?? 0,
        });

      if (itemErr)
        return json({ error: itemErr.message }, 400);

      // Update attempt aggregates
      await supabaseAdmin.rpc("", {}).catch(() => {});
      // Manual aggregate update since we may not have an RPC
      const { data: items } = await supabaseAdmin
        .from("exam_attempt_items")
        .select("is_correct, time_spent_seconds")
        .eq("attempt_id", attemptId);

      const correctCount = (items ?? []).filter((i: any) => i.is_correct).length;
      const totalTime = (items ?? []).reduce(
        (sum: number, i: any) => sum + (i.time_spent_seconds || 0),
        0
      );

      await supabaseAdmin
        .from("exam_attempts")
        .update({
          correct_count: correctCount,
          time_spent_seconds: totalTime,
        })
        .eq("id", attemptId);

      // Return result
      const result: any = { is_correct: isCorrect };

      // In study mode or after submission, include explanation
      if (attempt.mode === "study") {
        result.correct_answer = question.correct_answer;
        result.explanation = question.per_option_explanations;
      }

      return json(result);
    }

    // ─── Route 4: POST /api/exam/attempt/:id/complete ───
    if (
      req.method === "POST" &&
      parts.length === 5 &&
      parts[2] === "attempt" &&
      parts[4] === "complete"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const attemptId = parts[3];

      // Verify attempt belongs to user
      const { data: attempt } = await supabaseAdmin
        .from("exam_attempts")
        .select("id, user_id, total_questions")
        .eq("id", attemptId)
        .single();

      if (!attempt || attempt.user_id !== user.id)
        return json({ error: "Attempt not found" }, 404);

      // Aggregate final results
      const { data: items } = await supabaseAdmin
        .from("exam_attempt_items")
        .select("is_correct, time_spent_seconds")
        .eq("attempt_id", attemptId);

      const total = (items ?? []).length;
      const correct = (items ?? []).filter((i: any) => i.is_correct).length;
      const timeSpent = (items ?? []).reduce(
        (sum: number, i: any) => sum + (i.time_spent_seconds || 0),
        0
      );

      // Mark attempt complete
      await supabaseAdmin
        .from("exam_attempts")
        .update({
          completed_at: new Date().toISOString(),
          total_questions: total,
          correct_count: correct,
          time_spent_seconds: timeSpent,
        })
        .eq("id", attemptId);

      return json({
        summary: {
          total,
          correct,
          percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
          time_spent_seconds: timeSpent,
        },
      });
    }

    // ─── Route 5: GET /api/exam/analytics ───
    if (
      req.method === "GET" &&
      parts.length === 3 &&
      parts[2] === "analytics"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const examId = searchParams.get("exam_id");

      // Get all completed attempts for this user
      let attemptsQuery = supabaseAdmin
        .from("exam_attempts")
        .select("id, exam_id, mode, completed_at, total_questions, correct_count, time_spent_seconds")
        .eq("user_id", user.id)
        .not("completed_at", "is", null);

      if (examId) attemptsQuery = attemptsQuery.eq("exam_id", examId);

      const { data: attempts } = await attemptsQuery;

      if (!attempts || attempts.length === 0) {
        return json({
          coverage_by_topic: [],
          accuracy_by_difficulty: [],
          weak_areas: [],
          overall: { total_attempts: 0, total_questions: 0, correct: 0, accuracy: 0 },
        });
      }

      const attemptIds = attempts.map((a: any) => a.id);

      // Get all attempt items with question details
      const { data: items } = await supabaseAdmin
        .from("exam_attempt_items")
        .select("question_id, is_correct, time_spent_seconds")
        .in("attempt_id", attemptIds);

      // Get question metadata for coverage/difficulty analysis
      const questionIds = [
        ...new Set((items ?? []).map((i: any) => i.question_id)),
      ];
      const { data: questions } = questionIds.length
        ? await supabaseAdmin
            .from("exam_questions")
            .select("id, topic_id, difficulty_level")
            .in("id", questionIds)
        : { data: [] };

      const questionMap = new Map(
        (questions ?? []).map((q: any) => [q.id, q])
      );

      // Get topic names
      const topicIds = [
        ...new Set(
          (questions ?? []).map((q: any) => q.topic_id).filter(Boolean)
        ),
      ];
      const { data: topics } = topicIds.length
        ? await supabaseAdmin
            .from("exam_topics")
            .select("id, name")
            .in("id", topicIds)
        : { data: [] };

      const topicMap = new Map(
        (topics ?? []).map((t: any) => [t.id, t.name])
      );

      // Coverage by topic
      const topicStats = new Map<
        string,
        { name: string; total: number; correct: number }
      >();
      for (const item of items ?? []) {
        const q = questionMap.get(item.question_id);
        if (!q || !q.topic_id) continue;
        const stat = topicStats.get(q.topic_id) ?? {
          name: topicMap.get(q.topic_id) ?? "Unknown",
          total: 0,
          correct: 0,
        };
        stat.total++;
        if (item.is_correct) stat.correct++;
        topicStats.set(q.topic_id, stat);
      }

      const coverageByTopic = [...topicStats.entries()].map(
        ([id, stat]) => ({
          topic_id: id,
          topic_name: stat.name,
          total: stat.total,
          correct: stat.correct,
          accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
        })
      );

      // Accuracy by difficulty
      const diffStats = new Map<
        string,
        { total: number; correct: number }
      >();
      for (const item of items ?? []) {
        const q = questionMap.get(item.question_id);
        const diff = q?.difficulty_level ?? "Unknown";
        const stat = diffStats.get(diff) ?? { total: 0, correct: 0 };
        stat.total++;
        if (item.is_correct) stat.correct++;
        diffStats.set(diff, stat);
      }

      const accuracyByDifficulty = [...diffStats.entries()].map(
        ([level, stat]) => ({
          difficulty_level: level,
          total: stat.total,
          correct: stat.correct,
          accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
        })
      );

      // Weak areas (topics with <50% accuracy and at least 3 questions attempted)
      const weakAreas = coverageByTopic
        .filter((t) => t.accuracy < 50 && t.total >= 3)
        .sort((a, b) => a.accuracy - b.accuracy);

      // Overall stats
      const totalQuestions = (items ?? []).length;
      const totalCorrect = (items ?? []).filter(
        (i: any) => i.is_correct
      ).length;

      return json({
        coverage_by_topic: coverageByTopic,
        accuracy_by_difficulty: accuracyByDifficulty,
        weak_areas: weakAreas,
        overall: {
          total_attempts: attempts.length,
          total_questions: totalQuestions,
          correct: totalCorrect,
          accuracy:
            totalQuestions > 0
              ? Math.round((totalCorrect / totalQuestions) * 100)
              : 0,
        },
      });
    }

    // ─── Route 6: POST /api/exam/flag ───
    if (
      req.method === "POST" &&
      parts.length === 3 &&
      parts[2] === "flag"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const body = await req.json();
      const { question_id, reason } = body;

      if (!question_id)
        return json({ error: "question_id is required" }, 400);

      const { data, error } = await supabaseAdmin
        .from("exam_flags")
        .insert({
          question_id,
          user_id: user.id,
          reason: reason ?? null,
        })
        .select("id")
        .single();

      if (error)
        return json({ error: error.message }, 400);

      return json({ flag_id: data.id }, 201);
    }

    // ─── Route 7: POST /api/exam/review/:question_id/assign ───
    if (
      req.method === "POST" &&
      parts.length === 5 &&
      parts[2] === "review" &&
      parts[4] === "assign"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const isAdmin = await hasRole(supabaseAdmin, user.id, "admin");
      if (!isAdmin) return json({ error: "Admin access required" }, 403);

      const questionId = parts[3];
      const body = await req.json();
      const { guru_id } = body;

      if (!guru_id)
        return json({ error: "guru_id is required" }, 400);

      // Update question: set reviewed_by and status to 'assigned'
      const { error: updateErr } = await supabaseAdmin
        .from("exam_questions")
        .update({
          reviewed_by: guru_id,
          status: "assigned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", questionId);

      if (updateErr)
        return json({ error: updateErr.message }, 400);

      // Add review log entry
      await supabaseAdmin.from("exam_review_log").insert({
        question_id: questionId,
        reviewer_id: user.id,
        action: "assigned",
        notes: `Assigned to guru ${guru_id}`,
      });

      return json({ ok: true });
    }

    // ─── Route 8: POST /api/exam/review/:question_id/approve ───
    if (
      req.method === "POST" &&
      parts.length === 5 &&
      parts[2] === "review" &&
      parts[4] === "approve"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const questionId = parts[3];
      const body = await req.json();

      // Verify guru is assigned to this question
      const { data: question } = await supabaseAdmin
        .from("exam_questions")
        .select("id, reviewed_by, status")
        .eq("id", questionId)
        .single();

      if (!question) return json({ error: "Question not found" }, 404);

      const isAdmin = await hasRole(supabaseAdmin, user.id, "admin");
      if (question.reviewed_by !== user.id && !isAdmin)
        return json({ error: "Not assigned to you" }, 403);

      // Update question
      const updateData: any = {
        status: "reviewed",
        updated_at: new Date().toISOString(),
      };
      if (body.per_option_explanations) {
        updateData.per_option_explanations = body.per_option_explanations;
      }

      const { error: updateErr } = await supabaseAdmin
        .from("exam_questions")
        .update(updateData)
        .eq("id", questionId);

      if (updateErr)
        return json({ error: updateErr.message }, 400);

      // Add review log entry
      await supabaseAdmin.from("exam_review_log").insert({
        question_id: questionId,
        reviewer_id: user.id,
        action: "approved",
      });

      return json({ ok: true });
    }

    // ─── Route 9: POST /api/exam/review/:question_id/reject ───
    if (
      req.method === "POST" &&
      parts.length === 5 &&
      parts[2] === "review" &&
      parts[4] === "reject"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const questionId = parts[3];
      const body = await req.json();

      // Verify guru is assigned to this question
      const { data: question } = await supabaseAdmin
        .from("exam_questions")
        .select("id, reviewed_by, status")
        .eq("id", questionId)
        .single();

      if (!question) return json({ error: "Question not found" }, 404);

      const isAdmin = await hasRole(supabaseAdmin, user.id, "admin");
      if (question.reviewed_by !== user.id && !isAdmin)
        return json({ error: "Not assigned to you" }, 403);

      // Update question status to rejected
      const { error: updateErr } = await supabaseAdmin
        .from("exam_questions")
        .update({
          status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", questionId);

      if (updateErr)
        return json({ error: updateErr.message }, 400);

      // Add review log entry
      await supabaseAdmin.from("exam_review_log").insert({
        question_id: questionId,
        reviewer_id: user.id,
        action: "rejected",
        notes: body.notes ?? null,
      });

      return json({ ok: true });
    }

    // ─── Fallback: list exams / topics / questions for admin ───
    // GET /api/exam/exams
    if (req.method === "GET" && parts.length === 3 && parts[2] === "exams") {
      const { data, error } = await supabase
        .from("exam_exams")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message }, 400);
      return json({ exams: data });
    }

    // GET /api/exam/topics?exam_id=...
    if (req.method === "GET" && parts.length === 3 && parts[2] === "topics") {
      const examId = searchParams.get("exam_id");
      let query = supabase
        .from("exam_topics")
        .select("*")
        .order("name", { ascending: true });
      if (examId) query = query.eq("exam_id", examId);
      const { data, error } = await query;
      if (error) return json({ error: error.message }, 400);
      return json({ topics: data });
    }

    // GET /api/exam/questions?exam_id=...&status=...
    if (
      req.method === "GET" &&
      parts.length === 3 &&
      parts[2] === "questions"
    ) {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const examId = searchParams.get("exam_id");
      const status = searchParams.get("status");
      const page = parseInt(searchParams.get("page") ?? "1", 10);
      const pageSize = Math.min(
        50,
        parseInt(searchParams.get("page_size") ?? "20", 10)
      );

      let query = supabase
        .from("exam_questions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (examId) query = query.eq("exam_id", examId);
      if (status) query = query.eq("status", status);

      const { data, error, count } = await query;
      if (error) return json({ error: error.message }, 400);
      return json({ questions: data, page, page_size: pageSize, total: count ?? 0 });
    }

    // GET /api/exam/attempts — user's own attempts
    if (req.method === "GET" && parts.length === 3 && parts[2] === "attempts") {
      if (!user) return json({ error: "Unauthorized" }, 401);

      const { data, error } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (error) return json({ error: error.message }, 400);
      return json({ attempts: data });
    }

    return json({ error: "Route not found" }, 404);
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500
    );
  }
});
