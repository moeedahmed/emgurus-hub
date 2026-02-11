import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ArrowLeft, Flag } from "lucide-react";
import QuestionCard from "@/modules/exam/components/exams/QuestionCard";
import FloatingSettings from "@/modules/exam/components/exams/FloatingSettings";
import Progress from "@/modules/exam/components/exams/Progress";
import RightSidebar from "@/modules/exam/components/exams/RightSidebar";
import { useToast } from "@/hooks/use-toast";
import { useRoles } from "@/modules/exam/hooks/useRoles";
import { useAuth } from "@/modules/career/contexts/AuthContext";
import { MODE_LABEL, SHOW_GURU } from "@/modules/exam/lib/modeLabels";
import * as examApi from '@/modules/exam/lib/examApi';

interface PracticeSessionState {
  attemptId: string;
  questions: examApi.Question[];
  examId: string;
  topicId?: string;
}

const FEEDBACK_TAGS = ["Wrong answer", "Ambiguous", "Outdated", "Typo", "Too easy", "Too hard"] as const;

export default function PracticeSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, isGuru } = useRoles();
  const sessionState = location.state as PracticeSessionState | null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [answerResults, setAnswerResults] = useState<{ [key: string]: examApi.SubmitAnswerResult }>({});
  const [showExplanations, setShowExplanations] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [feedbackType, setFeedbackType] = useState<{ [key: string]: 'good' | 'improvement' | null }>({});
  const [issueTypes, setIssueTypes] = useState<{ [key: string]: string[] }>({});
  const [feedbackNotes, setFeedbackNotes] = useState<{ [key: string]: string }>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<{ [key: string]: boolean }>({});

  // Autosave feedback state
  const savingRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});
  const [feedbackDirty, setFeedbackDirty] = useState<Record<string, boolean>>({});
  const [feedbackSaving, setFeedbackSaving] = useState<Record<string, boolean>>({});
  const [feedbackSaved, setFeedbackSaved] = useState<Record<string, boolean>>({});
  const [feedbackError, setFeedbackError] = useState<Record<string, string | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [showQuestionMap, setShowQuestionMap] = useState(false);

  const questions = sessionState?.questions || [];
  const attemptId = sessionState?.attemptId || '';
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    console.log('PracticeSession mounted', { sessionState, questions });
    document.title = "Study Session • EM Gurus";
    document.body.classList.add('exam-shell');
    return () => document.body.classList.remove('exam-shell');
  }, []);

  // Redirect if no session state
  useEffect(() => {
    if (!sessionState?.questions?.length) {
      navigate('/exam/practice/config');
    }
  }, [sessionState, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key, 10) - 1;
        const letters = ['A','B','C','D','E'];
        const key = letters[idx];
        if (key && currentQuestion && !showExplanations[currentQuestion.id]) {
          handleAnswer(currentQuestion.id, key);
        }
      } else if (e.key === 'ArrowLeft') {
        prevQuestion();
      } else if (e.key === 'ArrowRight') {
        nextQuestion();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentQuestion && answers[currentQuestion.id] && !showExplanations[currentQuestion.id]) {
          setShowExplanations(prev => ({ ...prev, [currentQuestion.id]: true }));
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentQuestion, answers, showExplanations]);

  const handleAnswer = async (questionId: string, selectedKey: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedKey }));

    // Submit via examApi and show explanation
    if (attemptId) {
      try {
        const result = await examApi.submitAnswer(attemptId, {
          question_id: questionId,
          user_answer: selectedKey,
        });
        setAnswerResults(prev => ({ ...prev, [questionId]: result }));
      } catch (err) {
        console.error('Submit answer failed:', err);
      }
    }

    setTimeout(() => {
      setShowExplanations(prev => ({ ...prev, [questionId]: true }));
    }, 500);
  };

  const nextQuestion = async () => {
    if (currentQuestion && feedbackDirty[currentQuestion.id]) {
      if (savingRef.current[currentQuestion.id]) clearTimeout(savingRef.current[currentQuestion.id]!);
      await doSubmitFeedback(currentQuestion.id);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      endPractice();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const endPractice = async () => {
    if (attemptId) {
      try {
        const { summary } = await examApi.completeAttempt(attemptId);
        toast({
          title: 'Practice Complete!',
          description: `Final Score: ${summary.correct}/${summary.total} (${summary.percentage}%)`,
          duration: 5000
        });
      } catch (err) {
        console.error('Complete attempt failed:', err);
        toast({ title: 'Practice Complete!', description: 'Great job!', duration: 3000 });
      }
    }
    setTimeout(() => navigate('/exam/practice/config'), 2000);
  };

  // Feedback helpers
  const doSubmitFeedback = async (questionId: string) => {
    setFeedbackError(v => ({...v, [questionId]: null}));
    setFeedbackSaving(v => ({...v, [questionId]: true}));
    try {
      const type = feedbackType[questionId];
      if (!type) return;

      let comment = '';
      if (type === 'good') {
        comment = 'Looks good';
      } else {
        const issues = issueTypes[questionId] || [];
        const notes = feedbackNotes[questionId] || '';
        comment = `[${issues.join(', ')}] ${notes}`.trim();
      }

      await examApi.flagQuestion({ question_id: questionId, reason: comment });
      setFeedbackSaved(v => ({...v, [questionId]: true}));
      setFeedbackDirty(v => ({...v, [questionId]: false}));
      setFeedbackSubmitted(prev => ({ ...prev, [questionId]: true }));
    } catch (e: any) {
      setFeedbackError(v => ({...v, [questionId]: e?.message ?? 'Could not save'}));
    } finally {
      setFeedbackSaving(v => ({...v, [questionId]: false}));
    }
  };

  const queueSubmitFeedback = (questionId: string, delay = 400) => {
    setFeedbackDirty(v => ({...v, [questionId]: true}));
    if (savingRef.current[questionId]) clearTimeout(savingRef.current[questionId]!);
    savingRef.current[questionId] = setTimeout(() => { void doSubmitFeedback(questionId); }, delay);
  };

  const handleFeedbackTypeChange = (questionId: string, type: 'good' | 'improvement') => {
    setFeedbackType(prev => ({ ...prev, [questionId]: type }));
    if (type === 'good') {
      setIssueTypes(prev => ({ ...prev, [questionId]: [] }));
      setFeedbackNotes(prev => ({ ...prev, [questionId]: '' }));
    }
    queueSubmitFeedback(questionId, 300);
  };

  const handleToggleFeedbackTag = (questionId: string, tag: string) => {
    setIssueTypes(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.includes(tag)
        ? prev[questionId].filter(t => t !== tag)
        : [...(prev[questionId] || []), tag]
    }));
    queueSubmitFeedback(questionId, 350);
  };

  const navigateToQuestion = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentIndex(questionIndex);
    }
  };

  const answeredCount = Object.keys(answers).length;

  if (!sessionState?.questions?.length) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mb-3 font-medium">Session not found</div>
            <Button variant="outline" onClick={() => navigate('/exam/practice/config')}>
              Back to Practice Config
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Build explanation text from per_option_explanations or answerResult
  const getExplanation = (q: examApi.Question) => {
    const result = answerResults[q.id];
    if (result?.explanation) {
      return Object.entries(result.explanation).map(([key, text]) => `${key}: ${text}`).join('\n\n');
    }
    if (q.per_option_explanations) {
      const explanations = typeof q.per_option_explanations === 'string' 
        ? JSON.parse(q.per_option_explanations) 
        : q.per_option_explanations;
      return Object.entries(explanations).map(([key, text]) => `${key}: ${text}`).join('\n\n');
    }
    return undefined;
  };

  // Safe options (handle potential JSON string vs object issues)
  const safeOptions = currentQuestion?.options 
    ? (Array.isArray(currentQuestion.options) ? currentQuestion.options : [])
    : [];

  return (
    <div className="container mx-auto px-4 py-6 overflow-x-clip">
      <Progress current={currentIndex + 1} total={questions.length} />
      <h1 className="mt-4 text-2xl font-semibold">{MODE_LABEL["practice"]}</h1>

      {/* Mobile question map drawer */}
      <div className="md:hidden mt-4">
        <Drawer open={showQuestionMap} onOpenChange={setShowQuestionMap}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">Open map & AI chat</Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">Jump to Question</div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {questions.map((q, i) => {
                  const isCurrent = i === currentIndex;
                  const isAnswered = !!answers[q.id];
                  const result = answerResults[q.id];
                  const isCorrect = result?.is_correct;

                  let buttonClass = "h-8 w-8 rounded text-sm flex items-center justify-center border ";
                  if (isCurrent) {
                    buttonClass += "bg-primary text-primary-foreground ring-2 ring-primary";
                  } else if (isAnswered) {
                    buttonClass += isCorrect ? "bg-success/10 border-success/20 text-success" : "bg-destructive/10 border-destructive/20 text-destructive";
                  } else {
                    buttonClass += "bg-muted border-muted-foreground/20";
                  }

                  return (
                    <Button
                      key={q.id}
                      onClick={() => { navigateToQuestion(i); setShowQuestionMap(false); }}
                      className={buttonClass}
                      variant="ghost"
                      size="sm"
                    >
                      {markedForReview.has(q.id) && <Flag className="h-3 w-3 text-warning absolute -top-1 -right-1" />}
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 mt-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="space-y-4 w-full max-w-full break-words">
              {currentQuestion && (
                <>
                  <QuestionCard
                    stem={currentQuestion.stem}
                    options={safeOptions}
                    selectedKey={answers[currentQuestion.id] || ""}
                    onSelect={(key) => handleAnswer(currentQuestion.id, key)}
                    showExplanation={showExplanations[currentQuestion.id] || false}
                    explanation={getExplanation(currentQuestion)}
                    correctKey={answerResults[currentQuestion.id]?.correct_answer || currentQuestion.correct_answer}
                    questionId={currentQuestion.id}
                    locked={showExplanations[currentQuestion.id] || false}
                    index={currentIndex}
                    total={questions.length}
                  />

                  {/* Feedback Card */}
                  {showExplanations[currentQuestion.id] && (
                    <Card className="min-w-0 w-full max-w-full mt-4">
                      <CardContent className="min-w-0 w-full max-w-full break-words p-4 sm:p-5">
                        <h3 className="font-semibold mb-2">Question Feedback</h3>

                        <div className="flex flex-wrap gap-2 w-full min-w-0 mb-3">
                          <Button
                            variant={feedbackType[currentQuestion.id]==='good' ? 'default' : 'secondary'}
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            aria-pressed={feedbackType[currentQuestion.id]==='good'}
                            aria-label="Looks good"
                            onClick={() => handleFeedbackTypeChange(currentQuestion.id, 'good')}
                          >
                            <span aria-hidden>👍</span>
                            <span className="sr-only">Looks good</span>
                          </Button>

                          <Button
                            variant={feedbackType[currentQuestion.id]==='improvement' ? 'default' : 'secondary'}
                            size="icon"
                            className="h-10 w-10 rounded-full"
                            aria-pressed={feedbackType[currentQuestion.id]==='improvement'}
                            aria-label="Needs improvement"
                            onClick={() => handleFeedbackTypeChange(currentQuestion.id, 'improvement')}
                          >
                            <span aria-hidden>👎</span>
                            <span className="sr-only">Needs improvement</span>
                          </Button>
                        </div>

                        {feedbackType[currentQuestion.id] === 'improvement' && (
                          <div className="rounded-md border p-3 sm:p-4">
                            <p className="font-medium mb-2">What's the issue? (select all)</p>
                            <div className="flex flex-wrap gap-2 w-full min-w-0 mb-3">
                              {FEEDBACK_TAGS.map(tag => (
                                <Button key={tag} variant={issueTypes[currentQuestion.id]?.includes(tag) ? 'default' : 'secondary'}
                                  className="min-w-0 text-sm px-3 py-2"
                                  onClick={() => handleToggleFeedbackTag(currentQuestion.id, tag)}
                                >{tag}</Button>
                              ))}
                            </div>
                            <Textarea
                              value={feedbackNotes[currentQuestion.id] ?? ''}
                              onChange={(e) => setFeedbackNotes(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                              onBlur={() => queueSubmitFeedback(currentQuestion.id, 600)}
                              placeholder="Add details (optional)…"
                              className="min-w-0 w-full"
                            />
                          </div>
                        )}

                        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                          {feedbackSaving[currentQuestion.id] ? 'Saving…' : feedbackError[currentQuestion.id] ? `Error: ${feedbackError[currentQuestion.id]}` : feedbackSaved[currentQuestion.id] ? 'Saved' : ''}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="justify-self-start">
                      <Button variant="outline" onClick={prevQuestion} disabled={currentIndex === 0} className="min-w-0 text-sm sm:text-base">
                        Previous
                      </Button>
                    </div>
                    <div className="justify-self-end">
                      <Button onClick={nextQuestion} className="min-w-0 text-sm sm:text-base">
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between order-last md:order-none pt-4">
                    <div className="flex flex-wrap items-center gap-2 gap-y-2 md:flex-nowrap">
                      <Button variant="outline" onClick={() => navigate('/exam/practice/config')} className="flex items-center gap-2 min-w-0 text-sm sm:text-base">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Config
                      </Button>
                      <Button variant="outline" onClick={endPractice} className="text-warning min-w-0 text-sm sm:text-base">
                        End Practice
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <RightSidebar
            total={questions.length}
            currentIndex={currentIndex}
            answered={Object.fromEntries(questions.map((_, i) => [i, !!answers[questions[i]?.id]]))}
            onJump={navigateToQuestion}
            mode="practice"
            showGuru={SHOW_GURU["practice"]}
            examId={sessionState?.examId}
            questionId={currentQuestion?.id}
            kbId={currentQuestion?.topic_id || undefined}
          />
        </aside>
      </div>

      <FloatingSettings
        currentExam={'Study Session' as any}
        currentCount={questions.length}
        currentTopic={sessionState?.topicId || 'All areas'}
        currentDifficulty="medium"
        onUpdate={(settings) => {
          navigate('/exam/practice/config', { state: settings, replace: false });
        }}
      />
    </div>
  );
}
