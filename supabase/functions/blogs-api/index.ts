import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getPathParts(url: string) {
  const raw = new URL(url).pathname;
  const path = raw
    .replace(/^\/functions\/v1\/blogs-api\/?/, "")
    .replace(/^\/blogs-api\/?/, "");
  return path.split("/").filter(Boolean);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const parts = getPathParts(req.url);
  // Expected: /api/blogs/...
  if (parts[0] !== "api" || parts[1] !== "blogs") {
    return json({ error: "Not found" }, 404);
  }

  try {
    // POST /api/blogs
    if (req.method === "POST" && parts.length === 2) {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const body = await req.json();
      const title = (body.title || "Untitled").trim();
      const baseSlug = slugify(title) || `post-${Date.now()}`;
      const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title,
          slug,
          description: body.excerpt ?? null,
          content: body.content_md ?? "",
          category_id: body.category_id ?? null,
          cover_image_url: body.cover_image_url ?? null,
          author_id: user.id,
          status: "draft",
          tags: Array.isArray(body.tag_slugs) ? body.tag_slugs : [],
        })
        .select("id,slug,status")
        .single();

      if (error) return json({ error: error.message }, 400);
      return json(data, 201);
    }

    // GET /api/blogs/:postId/comments
    if (req.method === "GET" && parts.length === 4 && parts[3] === "comments") {
      const postId = parts[2];
      const { data, error } = await supabase
        .from("blog_comments")
        .select("id, user_id, parent_id, content, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) return json({ error: error.message }, 400);

      const comments = data ?? [];
      const userIds = [...new Set(comments.map((c) => c.user_id))];

      const { data: profiles } = userIds.length
        ? await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds)
        : { data: [] as any[] };

      const { data: reacts } = comments.length
        ? await supabase
            .from("blog_comment_reactions")
            .select("comment_id, user_id, reaction")
            .in("comment_id", comments.map((c) => c.id))
        : { data: [] as any[] };

      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      const reactionMap = new Map<string, { up: number; down: number }>();
      const userReactionMap = new Map<string, string | null>();

      for (const r of reacts ?? []) {
        const prev = reactionMap.get(r.comment_id) ?? { up: 0, down: 0 };
        if (r.reaction === "up") prev.up += 1;
        if (r.reaction === "down") prev.down += 1;
        reactionMap.set(r.comment_id, prev);
        if (user && r.user_id === user.id) userReactionMap.set(r.comment_id, r.reaction);
      }

      const mapped = comments.map((c: any) => ({
        id: c.id,
        author_id: c.user_id,
        parent_id: c.parent_id,
        content: c.content,
        created_at: c.created_at,
        author: profileMap.get(c.user_id)
          ? {
              user_id: c.user_id,
              full_name: profileMap.get(c.user_id).display_name ?? "User",
              avatar_url: profileMap.get(c.user_id).avatar_url ?? null,
            }
          : null,
        reactions: reactionMap.get(c.id) ?? { up: 0, down: 0 },
        user_reaction: userReactionMap.get(c.id) ?? null,
      }));

      return json({ comments: mapped });
    }

    // POST /api/blogs/:postId/comment
    if (req.method === "POST" && parts.length === 4 && parts[3] === "comment") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const postId = parts[2];
      const body = await req.json();
      const content = (body.content ?? "").trim();
      if (!content) return json({ error: "Content required" }, 400);

      const { data, error } = await supabase
        .from("blog_comments")
        .insert({ post_id: postId, user_id: user.id, parent_id: body.parent_id ?? null, content })
        .select("id")
        .single();

      if (error) return json({ error: error.message }, 400);
      return json(data, 201);
    }

    // DELETE /api/blogs/comments/:commentId
    if (req.method === "DELETE" && parts.length === 4 && parts[2] === "comments") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const commentId = parts[3];
      const { error } = await supabase.from("blog_comments").delete().eq("id", commentId).eq("user_id", user.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    // POST /api/blogs/comments/:commentId/react
    if (req.method === "POST" && parts.length === 5 && parts[2] === "comments" && parts[4] === "react") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const commentId = parts[3];
      const body = await req.json();
      const reaction = body.type === "down" ? "down" : "up";

      const { error } = await supabase
        .from("blog_comment_reactions")
        .upsert({ comment_id: commentId, user_id: user.id, reaction, feedback: body.feedback ?? null }, { onConflict: "comment_id,user_id" });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    // POST /api/blogs/:id/submit
    if (req.method === "POST" && parts.length === 4 && parts[3] === "submit") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const id = parts[2];
      const { error } = await supabase
        .from("blog_posts")
        .update({ status: "in_review", submitted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("author_id", user.id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    // POST /api/blogs/:id/publish
    if (req.method === "POST" && parts.length === 4 && parts[3] === "publish") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const id = parts[2];
      const { error } = await supabase
        .from("blog_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    // POST /api/blogs/:id/assign
    if (req.method === "POST" && parts.length === 4 && parts[3] === "assign") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const id = parts[2];
      const body = await req.json();
      if (!body.reviewer_id) return json({ error: "reviewer_id required" }, 400);
      const { error } = await supabase
        .from("blog_review_assignments")
        .insert({ post_id: id, reviewer_id: body.reviewer_id });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Route not implemented" }, 404);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
