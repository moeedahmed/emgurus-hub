import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/core/auth/supabase';
import { useRoles } from "@/modules/exam/hooks/useRoles";
import * as examApi from '@/modules/exam/lib/examApi';

const TIME_OPTIONS = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

export default function ExamConfig() {
  useEffect(() => {
    document.title = "Exam Mode • EM Gurus";
    const desc = "Configure timed Exam Mode with realistic exam conditions.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
  }, []);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isGuru } = useRoles();
  const [examId, setExamId] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("all");
  const [count, setCount] = useState<number>(25);
  const [timeLimit, setTimeLimit] = useState<string>("60");
  const [loading, setLoading] = useState(false);

  const [exams, setExams] = useState<examApi.Exam[]>([]);
  const [topics, setTopics] = useState<examApi.Topic[]>([]);

  // Subscription check
  const [isPaid, setIsPaid] = useState(false);
  const maxQuestions = isPaid ? 100 : 25;

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsPaid(false); return; }
        const { data: prof } = await supabase.from('profiles').select('subscription_tier').eq('user_id', user.id).maybeSingle();
        const tier = String(prof?.subscription_tier || 'free').toLowerCase();
        setIsPaid(tier.includes('exams') || tier.includes('premium') || isAdmin || isGuru);
      } catch { setIsPaid(false); }
    })();
  }, [isAdmin, isGuru]);

  // Load available exams
  useEffect(() => {
    (async () => {
      try {
        const { exams: list } = await examApi.listExams();
        setExams(list);
      } catch (err) {
        console.error('Failed to load exams:', err);
      }
    })();
  }, []);

  // Load topics when exam changes
  useEffect(() => {
    if (!examId) {
      setTopics([]);
      return;
    }
    (async () => {
      try {
        const { topics: list } = await examApi.listTopics(examId);
        setTopics(list);
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    })();
  }, [examId]);

  // Reset topic when exam changes
  useEffect(() => {
    setTopicId("all");
  }, [examId]);

  const start = async () => {
    if (!examId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate(`/auth?returnTo=${encodeURIComponent('/exam/config')}`);
      return;
    }

    setLoading(true);
    try {
      const topicIds = topicId === 'all' ? undefined : [topicId];
      const result = await examApi.startAttempt({
        exam_id: examId,
        mode: 'exam',
        topic_ids: topicIds,
      });

      if (!result.questions.length) {
        toast({
          title: "No questions available",
          description: "No questions match your selected criteria.",
          variant: "destructive"
        });
        return;
      }

      const limitSec = Number(timeLimit) * 60;
      const selectedExam = exams.find(e => e.id === examId);

      navigate(`/exam/session/${result.attempt_id}`, {
        state: {
          attemptId: result.attempt_id,
          questions: result.questions,
          limitSec,
          examId,
          examName: selectedExam?.name || 'Exam',
          topicId: topicId === 'all' ? undefined : topicId,
          count: Math.min(count, result.questions.length),
        }
      });
    } catch (err: any) {
      console.error('Start failed', err);
      toast({
        title: "Start failed",
        description: err?.message || String(err),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6 mx-0 w-full px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Exam Mode
            </h1>
            <p className="text-sm text-muted-foreground">Timed practice with realistic exam conditions</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/exam')} className="shrink-0">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Exams</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Exam Configuration
            <Badge variant="destructive">Timed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Exam <span className="text-destructive">*</span></Label>
            <Select value={examId} onValueChange={setExamId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Topic</Label>
            <Select value={topicId} onValueChange={setTopicId} disabled={!examId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All areas</SelectItem>
                {topics.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Number of Questions</Label>
            <Input
              type="number"
              min="5"
              max={maxQuestions}
              value={count}
              onChange={(e) => setCount(Math.max(5, Math.min(maxQuestions, Number(e.target.value) || 25)))}
              className="mt-1"
            />
            {!isPaid && (
              <p className="text-xs text-muted-foreground mt-1">
                Free tier limited to 25 questions. <a href="/pricing" className="text-primary hover:underline">Upgrade</a> for more.
              </p>
            )}
          </div>

          <div>
            <Label>Time Limit</Label>
            <Select value={timeLimit} onValueChange={setTimeLimit}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Exam Mode Features:</strong>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Timed examination environment</li>
                  <li>• Questions are locked after submission</li>
                  <li>• Final score and analysis at completion</li>
                  <li>• Mark questions for review</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 justify-end pt-2">
            <Button onClick={start} disabled={!examId || loading} size="lg">
              {loading ? 'Loading questions...' : 'Start Exam'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
