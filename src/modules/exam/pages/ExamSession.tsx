import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Clock, Flag, ArrowLeft } from "lucide-react";
import QuestionCard from "@/modules/exam/components/exams/QuestionCard";
import Progress from "@/modules/exam/components/exams/Progress";
import RightSidebar from "@/modules/exam/components/exams/RightSidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/modules/career/contexts/AuthContext";
import { MODE_LABEL, SHOW_GURU } from "@/modules/exam/lib/modeLabels";
import * as examApi from '@/modules/exam/lib/examApi';

interface ExamSessionState {
  attemptId: string;
  questions: examApi.Question[];
  limitSec: number;
  examId: string;
  examName: string;
  topicId?: string;
  count: number;
}

const FEEDBACK_TAGS = ["Wrong answer", "Ambiguous", "Outdated", "Typo", "Too easy", "Too hard"] as const;

export default function ExamSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const sessionState = location.state as ExamSessionState | null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState<Date>(new Date());
  const [showQuestionMap, setShowQuestionMap] = useState(false);

  // Feedback state
  const [feedbackType, setFeedbackType] = useState<{ [key: number]: 'good' | 'improvement' }>({});
  const [feedbackTags, setFeedbackTags] = useState<{ [key: number]: Set<string> }>({});
  const [feedbackText, setFeedbackText] = useState<{ [key: number]: string }>({});

  const savingRef = useRef<Record<number, ReturnType<typeof setTimeout> | null>>({});
  const [feedbackDirty, setFeedbackDirty] = useState<Record<number, boolean>>({});
  const [feedbackSaving, setFeedbackSaving] = useState<Record<number, boolean>>({});
  const [feedbackSaved, setFeedbackSaved] = useState<Record<number, boolean>>({});
  const [feedbackError, setFeedbackError] = useState<Record<number, string | null>>({});

  const questions = sessionState?.questions || [];
  const attemptId = sessionState?.attemptId || '';
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    document.title = "Exam Session • EM Gurus";
    document.body.classList.add('exam-shell');
    return () => document.body.classList.remove('exam-shell');
  }, []);

  // Initialize timer
  useEffect(() => {
    if (!sessionState?.limitSec) return;
    setTimeLeft(sessionState.limitSec);
  }, [sessionState]);

  // Redirect if no session state
  useEffect(() => {
    if (!sessionState?.questions?.length) {
      navigate('/exam/config');
    }
  }, [sessionState, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleTimeUp(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleTimeUp = () => {
    toast({
      title: 'Time Up!',
      description: 'Your exam has been automatically submitted.',
      variant: 'destructive'
    });
    finishExam();
  };

  const handleAnswer = async (questionId: string, selectedKey: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedKey }));

    // Submit answer to backend
    if (attemptId) {
      try {
        await examApi.submitAnswer(attemptId, {
          question_id: questionId,
          user_answer: selectedKey,
        });
      } catch (err) {
        console.error('Submit answer failed:', err);
      }
    }
  };

  const finishExam = async () => {
    // Flush pending feedback
    if (feedbackDirty[currentIndex]) {
      if (savingRef.current[currentIndex]) clearTimeout(savingRef.current[currentIndex]!);
      await doSubmitFeedback(currentIndex);
    }

    if (!attemptId) {
      navigate('/exam');
      return;
    }

    try {
      const { summary } = await examApi.completeAttempt(attemptId);
      const durationSec = Math.floor((Date.now() - startTime.getTime()) / 1000);

      navigate(`/exam/report/${attemptId}`, {
        replace: true,
        state: {
          attemptId,
          score: { correct: summary.correct, total: summary.total, percentage: summary.percentage },
          duration: { seconds: durationSec, formatted: formatTime(durationSec) },
          exam: { name: sessionState!.examName, topic: sessionState!.topicId }
        }
      });
    } catch (err) {
      console.error('Finish exam failed:', err);
      toast({
        title: 'Failed to save exam',
        description: 'Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Feedback helpers
  const doSubmitFeedback = async (qIndex: number) => {
    setFeedbackError(v => ({...v, [qIndex]: null}));
    setFeedbackSaving(v => ({...v, [qIndex]: true}));
    try {
      const question = questions[qIndex];
      if (!question) return;
      const type = feedbackType[qIndex];
      if (!type) return;

      let comment = type === 'good' ? 'Looks good' : `[${Array.from(feedbackTags[qIndex] ?? []).join(', ')}] ${feedbackText[qIndex] ?? ''}`.trim();
      await examApi.flagQuestion({ question_id: question.id, reason: comment });
      setFeedbackSaved(v => ({...v, [qIndex]: true}));
      setFeedbackDirty(v => ({...v, [qIndex]: false}));
    } catch (e: any) {
      setFeedbackError(v => ({...v, [qIndex]: e?.message ?? 'Could not save'}));
    } finally {
      setFeedbackSaving(v => ({...v, [qIndex]: false}));
    }
  };

  const queueSubmitFeedback = (qIndex: number, delay = 450) => {
    setFeedbackDirty(v => ({...v, [qIndex]: true}));
    if (savingRef.current[qIndex]) clearTimeout(savingRef.current[qIndex]!);
    savingRef.current[qIndex] = setTimeout(() => { void doSubmitFeedback(qIndex); }, delay);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;

  if (!sessionState?.questions?.length) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mb-3 font-medium">Session not found</div>
            <Button variant="outline" onClick={() => navigate('/exam/config')}>
              Back to Exam Config
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 overflow-x-clip">
      <Progress current={currentIndex + 1} total={questions.length} />
      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-2xl font-semibold">{MODE_LABEL["exam"]}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={timeLeft < 300 ? 'text-destructive' : ''}>
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(timeLeft)}
          </Badge>
          {markedCount > 0 && (
            <Badge variant="outline" className="text-warning">
              <Flag className="h-3 w-3 mr-1" />
              {markedCount} marked
            </Badge>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="md:hidden mt-4">
        <Drawer open={showQuestionMap} onOpenChange={setShowQuestionMap}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">Open question map</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <RightSidebar
                total={questions.length}
                currentIndex={currentIndex}
                answered={questions.map((q) => !!answers[q.id])}
                onJump={(index) => { setCurrentIndex(index); setShowQuestionMap(false); }}
                mode="exam"
                showGuru={SHOW_GURU["exam"]}
                examId={attemptId}
                questionId={currentQuestion?.id}
                kbId={undefined}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 mt-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="space-y-4">
              {currentQuestion && (
                <>
                  <QuestionCard
                    stem={currentQuestion.stem}
                    options={currentQuestion.options}
                    selectedKey={answers[currentQuestion.id] || ""}
                    onSelect={(key) => handleAnswer(currentQuestion.id, key)}
                    showExplanation={false}
                    questionId={currentQuestion.id}
                    index={currentIndex}
                    total={questions.length}
                  />

                  {/* Feedback after selection */}
                  {answers[currentQuestion.id] && (
                    <Card className="min-w-0 w-full max-w-full mt-4">
                      <CardContent className="min-w-0 w-full max-w-full break-words p-4 sm:p-5">
                        <h3 className="font-semibold mb-2">Question Feedback</h3>

                        <div className="flex flex-wrap gap-2 w-full min-w-0 mb-3">
                          <Button
                            variant={feedbackType[currentIndex] === 'good' ? 'default' : 'secondary'}
                            size="icon" className="h-10 w-10 rounded-full"
                            onClick={() => { setFeedbackType(v => ({...v, [currentIndex]: 'good'})); queueSubmitFeedback(currentIndex, 300); }}
                          >
                            <span aria-hidden>👍</span>
                          </Button>
                          <Button
                            variant={feedbackType[currentIndex] === 'improvement' ? 'default' : 'secondary'}
                            size="icon" className="h-10 w-10 rounded-full"
                            onClick={() => { setFeedbackType(v => ({...v, [currentIndex]: 'improvement'})); queueSubmitFeedback(currentIndex, 300); }}
                          >
                            <span aria-hidden>👎</span>
                          </Button>
                        </div>

                        {feedbackType[currentIndex] === 'improvement' && (
                          <div className="rounded-md border p-3 sm:p-4">
                            <p className="font-medium mb-2">What's the issue? (select all)</p>
                            <div className="flex flex-wrap gap-2 w-full min-w-0 mb-3">
                              {FEEDBACK_TAGS.map(tag => (
                                <Button key={tag}
                                  variant={feedbackTags[currentIndex]?.has(tag) ? 'default' : 'secondary'}
                                  className="min-w-0 text-sm px-3 py-2"
                                  onClick={() => {
                                    setFeedbackTags(v => { const next = new Set(v[currentIndex] ?? []); next.has(tag) ? next.delete(tag) : next.add(tag); return {...v, [currentIndex]: next}; });
                                    queueSubmitFeedback(currentIndex, 350);
                                  }}
                                >{tag}</Button>
                              ))}
                            </div>
                            <Textarea
                              value={feedbackText[currentIndex] ?? ''}
                              onChange={(e) => { setFeedbackText(v => ({...v, [currentIndex]: e.target.value})); queueSubmitFeedback(currentIndex, 600); }}
                              placeholder="Add details (optional)…"
                              className="min-w-0 w-full"
                            />
                          </div>
                        )}

                        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
                          {feedbackSaving[currentIndex] ? 'Saving…' : feedbackError[currentIndex] ? `Error: ${feedbackError[currentIndex]}` : feedbackSaved[currentIndex] ? 'Saved' : ''}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="justify-self-start">
                      <Button variant="outline"
                        onClick={async () => {
                          if (feedbackDirty[currentIndex]) { if (savingRef.current[currentIndex]) clearTimeout(savingRef.current[currentIndex]!); await doSubmitFeedback(currentIndex); }
                          setCurrentIndex(prev => Math.max(0, prev - 1));
                        }}
                        disabled={currentIndex === 0}
                        className="min-w-0 text-sm sm:text-base"
                      >Previous</Button>
                    </div>
                    <div className="justify-self-end">
                      <Button
                        onClick={async () => {
                          if (feedbackDirty[currentIndex]) { if (savingRef.current[currentIndex]) clearTimeout(savingRef.current[currentIndex]!); await doSubmitFeedback(currentIndex); }
                          if (currentIndex < questions.length - 1) { setCurrentIndex(prev => prev + 1); } else { finishExam(); }
                        }}
                        disabled={!answers[currentQuestion.id]}
                        className="min-w-0 text-sm sm:text-base"
                      >{currentIndex < questions.length - 1 ? 'Next' : 'Finish Exam'}</Button>
                    </div>
                  </div>

                  {!answers[currentQuestion.id] && (
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      Please select an answer to continue
                    </div>
                  )}

                  <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between order-last md:order-none">
                    <div className="flex flex-wrap items-center gap-2 gap-y-2">
                      <Button variant="outline" onClick={() => navigate('/exam/config')} className="flex items-center gap-2 min-w-0 text-sm sm:text-base">
                        <ArrowLeft className="h-4 w-4" /> Back to Config
                      </Button>
                      <Button variant="outline" onClick={finishExam} className="text-warning min-w-0 text-sm sm:text-base">
                        Finish Early
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="hidden lg:block">
          <RightSidebar
            total={questions.length}
            currentIndex={currentIndex}
            answered={questions.map((q) => !!answers[q.id])}
            onJump={(i) => setCurrentIndex(i)}
            mode="exam"
            showGuru={SHOW_GURU["exam"]}
            examId={sessionState?.examId}
            questionId={currentQuestion?.id}
            kbId={currentQuestion?.topic_id || undefined}
          />
        </aside>
      </div>
    </div>
  );
}
