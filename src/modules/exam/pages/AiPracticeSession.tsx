import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import QuestionCard from "@/modules/exam/components/exams/QuestionCard";
import FloatingSettings from "@/modules/exam/components/exams/FloatingSettings";
import Progress from "@/modules/exam/components/exams/Progress";
import RightSidebar from "@/modules/exam/components/exams/RightSidebar";
import { supabase } from '@/core/auth/supabase';
import { useToast } from "@/hooks/use-toast";
import { MODE_LABEL, SHOW_GURU } from "@/modules/exam/lib/modeLabels";
import * as examApi from '@/modules/exam/lib/examApi';

const FEEDBACK_TAGS = ["Wrong answer", "Ambiguous", "Outdated", "Typo", "Too easy", "Too hard"] as const;

export default function AiPracticeSession() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { toast } = useToast();

  const examId = search.get("exam_id") || "";
  const topicId = search.get("topic_id") || undefined;
  const difficulty = (search.get("difficulty") || "C2") as 'C1' | 'C2' | 'C3';
  const total = useMemo(() => {
    const n = Number(search.get("count") || 10);
    return Math.max(1, Math.min(100, isNaN(n) ? 10 : n));
  }, [search]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [questions, setQuestions] = useState<(examApi.Question | null)[]>([]);
  const [answerResult, setAnswerResult] = useState<examApi.SubmitAnswerResult | null>(null);
  const [attemptId, setAttemptId] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<{ [key: number]: 'good' | 'improvement' }>({});
  const [issueTypes, setIssueTypes] = useState<{ [key: number]: string[] }>({});
  const [feedbackNotes, setFeedbackNotes] = useState<{ [key: number]: string }>({});

  // Autosave feedback state
  const savingRef = useRef<Record<number, ReturnType<typeof setTimeout> | null>>({});
  const [feedbackDirty, setFeedbackDirty] = useState<Record<number, boolean>>({});
  const [feedbackSaving, setFeedbackSaving] = useState<Record<number, boolean>>({});
  const [feedbackSaved, setFeedbackSaved] = useState<Record<number, boolean>>({});
  const [feedbackError, setFeedbackError] = useState<Record<number, string | null>>({});
  const [showQuestionMap, setShowQuestionMap] = useState(false);

  useEffect(() => {
    document.title = "AI Practice Session • EM Gurus";
    document.body.classList.add('exam-shell');
    return () => document.body.classList.remove('exam-shell');
  }, []);

  // Check auth and generate first question
  useEffect(() => {
    const init = async () => {
      if (!examId) {
        navigate('/exam/ai/config');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate(`/auth?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      if (!questions[0]) void generate(0);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const q = questions[idx] || null;

  async function generate(index: number) {
    if (!examId) return;

    try {
      setLoading(true);
      setError("");
      const { questions: generated } = await examApi.generateQuestions({
        exam_id: examId,
        topic_id: topicId,
        difficulty_level: difficulty,
        count: 1,
      });

      if (!generated[0]) throw new Error('No question generated');

      setQuestions((prev) => {
        const next = prev.slice();
        next[index] = generated[0];
        return next;
      });
      setSelected("");
      setShow(false);
      setAnswerResult(null);
    } catch (err: any) {
      console.error('Generate question failed', err);
      const errorMsg = err?.message || String(err);
      setError(errorMsg);
      toast({
        title: 'AI Generation failed',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!q || !selected) return;

    try {
      setLoading(true);

      // Start attempt if needed
      if (!attemptId) {
        const result = await examApi.startAttempt({
          exam_id: examId,
          mode: 'study',
        });
        setAttemptId(result.attempt_id);

        const ansResult = await examApi.submitAnswer(result.attempt_id, {
          question_id: q.id,
          user_answer: selected,
        });
        setAnswerResult(ansResult);
      } else {
        const ansResult = await examApi.submitAnswer(attemptId, {
          question_id: q.id,
          user_answer: selected,
        });
        setAnswerResult(ansResult);
      }

      setShow(true);
    } catch (err: any) {
      console.error('Submit failed', err);
      toast({ title: 'Submit failed', description: String(err?.message || err), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  // Feedback helpers
  const doSubmitFeedback = async (qIndex: number) => {
    setFeedbackError(v => ({...v, [qIndex]: null}));
    setFeedbackSaving(v => ({...v, [qIndex]: true}));
    try {
      const question = questions[qIndex];
      if (!question) return;
      const type = feedbackType[qIndex];
      if (!type) return;

      let comment = type === 'good' ? 'Looks good' : `[${(issueTypes[qIndex] || []).join(', ')}] ${feedbackNotes[qIndex] ?? ''}`.trim();
      await examApi.flagQuestion({ question_id: question.id, reason: comment });
      setFeedbackSaved(v => ({...v, [qIndex]: true}));
      setFeedbackDirty(v => ({...v, [qIndex]: false}));
    } catch (e: any) {
      setFeedbackError(v => ({...v, [qIndex]: e?.message ?? 'Could not save'}));
    } finally {
      setFeedbackSaving(v => ({...v, [qIndex]: false}));
    }
  };

  const queueSubmitFeedback = (qIndex: number, delay = 400) => {
    setFeedbackDirty(v => ({...v, [qIndex]: true}));
    if (savingRef.current[qIndex]) clearTimeout(savingRef.current[qIndex]!);
    savingRef.current[qIndex] = setTimeout(() => { void doSubmitFeedback(qIndex); }, delay);
  };

  const handleFeedbackTypeChange = (questionIdx: number, type: 'good' | 'improvement') => {
    setFeedbackType(prev => ({ ...prev, [questionIdx]: type }));
    if (type === 'good') {
      setIssueTypes(prev => ({ ...prev, [questionIdx]: [] }));
      setFeedbackNotes(prev => ({ ...prev, [questionIdx]: '' }));
    }
    queueSubmitFeedback(questionIdx, 300);
  };

  const handleToggleFeedbackTag = (questionIdx: number, tag: string) => {
    setIssueTypes(prev => ({
      ...prev,
      [questionIdx]: prev[questionIdx]?.includes(tag)
        ? prev[questionIdx].filter(t => t !== tag)
        : [...(prev[questionIdx] || []), tag]
    }));
    queueSubmitFeedback(questionIdx, 350);
  };

  async function next() {
    if (feedbackDirty[idx]) {
      if (savingRef.current[idx]) clearTimeout(savingRef.current[idx]!);
      await doSubmitFeedback(idx);
    }

    if (idx < total - 1) {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      setSelected("");
      setShow(false);
      setAnswerResult(null);
      if (!questions[nextIdx]) void generate(nextIdx);
    } else {
      showFinalScore();
    }
  }

  function showFinalScore() {
    if (attemptId) {
      examApi.completeAttempt(attemptId).then(({ summary }) => {
        toast({
          title: 'AI Practice Complete!',
          description: `Score: ${summary.correct}/${summary.total} (${summary.percentage}%)`,
          duration: 5000
        });
        setTimeout(() => navigate('/exam'), 2000);
      }).catch(() => {
        navigate('/exam');
      });
    } else {
      navigate('/exam');
    }
  }

  function prev() {
    if (idx > 0) {
      setIdx(idx - 1);
      setSelected("");
      setShow(false);
      setAnswerResult(null);
    }
  }

  if (!examId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mb-3 font-medium">Missing configuration</div>
            <Button variant="outline" onClick={() => navigate('/exam/ai/config')}>Back to setup</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getExplanation = () => {
    if (answerResult?.explanation) {
      return Object.entries(answerResult.explanation).map(([key, text]) => `${key}: ${text}`).join('\n\n');
    }
    if (q?.per_option_explanations) {
      return Object.entries(q.per_option_explanations).map(([key, text]) => `${key}: ${text}`).join('\n\n');
    }
    return undefined;
  };

  return (
    <div className="container mx-auto px-4 py-6 overflow-x-clip">
      <Progress current={idx + 1} total={total} />
      <h1 className="mt-4 text-2xl font-semibold">{MODE_LABEL["ai"]}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">⚡</span>
            AI Question {idx + 1} of {total}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 w-full max-w-full break-words">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <div className="font-medium">Error: {error}</div>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => generate(idx)}>
                Retry
              </Button>
            </div>
          )}

          {q && (
            <>
              <QuestionCard
                stem={q.stem}
                options={q.options}
                selectedKey={selected}
                onSelect={setSelected}
                showExplanation={show}
                explanation={getExplanation()}
                correctKey={answerResult?.correct_answer || q.correct_answer}
                locked={show}
                index={idx}
                total={total}
              />

              {/* AI Banner */}
              <div className="mt-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <div className="font-medium">⚠️ AI Generated Content – Experimental</div>
                  <p className="mt-1 text-sm">
                    This question was generated by AI and may not always be accurate. Use your judgment and send feedback if something looks off.
                  </p>
                </div>
              </div>

              {/* Question Feedback */}
              {selected && (
                <Card className="min-w-0 w-full max-w-full mt-4">
                  <CardContent className="min-w-0 w-full max-w-full break-words p-4 sm:p-5">
                    <h3 className="font-semibold mb-2">Question Feedback</h3>

                    <div className="flex flex-wrap gap-2 w-full min-w-0 mb-3">
                      <Button
                        variant={feedbackType[idx] === 'good' ? 'default' : 'secondary'}
                        size="icon" className="h-10 w-10 rounded-full"
                        onClick={() => handleFeedbackTypeChange(idx, 'good')}
                      >
                        <span aria-hidden>👍</span>
                      </Button>
                      <Button
                        variant={feedbackType[idx] === 'improvement' ? 'default' : 'secondary'}
                        size="icon" className="h-10 w-10 rounded-full"
                        onClick={() => handleFeedbackTypeChange(idx, 'improvement')}
                      >
                        <span aria-hidden>👎</span>
                      </Button>
                    </div>

                    {feedbackType[idx] === 'improvement' && (
                      <div className="rounded-md border p-3 sm:p-4">
                        <p className="font-medium mb-2">What's the issue? (select all)</p>
                        <div className="flex flex-wrap gap-2 w-full min-w-0 mb-3">
                          {FEEDBACK_TAGS.map(tag => (
                            <Button key={tag}
                              variant={issueTypes[idx]?.includes(tag) ? 'default' : 'secondary'}
                              className="min-w-0 text-sm px-3 py-2"
                              onClick={() => handleToggleFeedbackTag(idx, tag)}
                            >{tag}</Button>
                          ))}
                        </div>
                        <Textarea
                          value={feedbackNotes[idx] ?? ''}
                          onChange={(e) => {
                            setFeedbackNotes(prev => ({ ...prev, [idx]: e.target.value }));
                            queueSubmitFeedback(idx, 600);
                          }}
                          placeholder="Add details (optional)…"
                          className="min-w-0 w-full"
                        />
                      </div>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                      {feedbackSaving[idx] ? 'Saving…' : feedbackError[idx] ? `Error: ${feedbackError[idx]}` : feedbackSaved[idx] ? 'Saved' : ''}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Primary actions */}
              <div className="grid grid-cols-2 gap-3 mt-4 order-40">
                <div className="justify-self-start">
                  <Button variant="outline" onClick={prev} disabled={idx === 0} className="min-w-0 text-sm sm:text-base">Previous</Button>
                </div>
                <div className="justify-self-end">
                  {!show ? (
                    <Button onClick={submit} disabled={!q || !selected || loading} className="min-w-0 text-sm sm:text-base">Submit</Button>
                  ) : (
                    <Button onClick={next} disabled={!selected && !show} className="min-w-0 text-sm sm:text-base">
                      {idx < total - 1 ? 'Next' : 'Finish'}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {!q && !error && (
            <div className="text-sm text-muted-foreground">{loading ? 'Generating question…' : 'No question yet.'}</div>
          )}

          {/* Secondary actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between order-50">
            <div className="flex flex-wrap items-center gap-2 gap-y-2">
              <Button variant="outline" onClick={() => navigate('/exam/ai/config')} className="min-w-0 text-sm sm:text-base">Edit selection</Button>
              <Button variant="outline" onClick={showFinalScore} className="text-warning min-w-0 text-sm sm:text-base">
                End Early
              </Button>
              {error && (
                <Button variant="ghost" onClick={() => generate(idx)} disabled={loading} className="min-w-0 text-sm sm:text-base">Retry</Button>
              )}
            </div>
            {!selected && !show && (
              <div className="text-sm text-muted-foreground">
                Please select an answer to continue
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Desktop sidebar */}
      <div className="mt-8 hidden md:block">
        <RightSidebar
          total={total}
          currentIndex={idx}
          answered={(() => {
            const result: Record<number, boolean> = {};
            for (let i = 0; i < total; i++) {
              result[i] = i < idx || (i === idx && !!selected);
            }
            return result;
          })()}
          onJump={setIdx}
          mode="ai"
          showGuru={SHOW_GURU["ai"]}
          examId={examId}
          questionId={q?.id}
          kbId={topicId}
        />
      </div>

      {/* Mobile toggle */}
      <div className="mt-6 md:hidden">
        <Drawer open={showQuestionMap} onOpenChange={setShowQuestionMap}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">Open question map</Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">Jump to Question</div>
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: total }, (_, i) => {
                  const isCurrent = i === idx;
                  const isAnswered = i < idx || (i === idx && !!selected);

                  let buttonClass = "h-8 w-8 rounded text-sm flex items-center justify-center border ";
                  if (isCurrent) {
                    buttonClass += "bg-primary text-primary-foreground ring-2 ring-primary";
                  } else if (isAnswered) {
                    buttonClass += "bg-success/10 border-success/20 text-success";
                  } else {
                    buttonClass += "bg-muted border-muted-foreground/20";
                  }

                  return (
                    <Button key={i} onClick={() => { setIdx(i); setShowQuestionMap(false); }} className={buttonClass} variant="ghost" size="sm">
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <FloatingSettings
        currentExam={examId as any}
        currentCount={total}
        currentTopic={topicId || "All areas"}
        currentDifficulty={difficulty}
        onUpdate={(newSettings) => {
          const params = new URLSearchParams(window.location.search);
          params.set('exam_id', newSettings.exam);
          params.set('count', String(newSettings.count));
          if (newSettings.topic !== 'All areas') params.set('topic_id', newSettings.topic); else params.delete('topic_id');
          params.set('difficulty', newSettings.difficulty);
          window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        }}
      />
    </div>
  );
}
