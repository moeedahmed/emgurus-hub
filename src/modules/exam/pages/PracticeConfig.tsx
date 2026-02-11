import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/core/auth/supabase';
import * as examApi from '@/modules/exam/lib/examApi';

export default function PracticeConfig() {
  useEffect(() => {
    document.title = "Study Mode • EM Gurus";
    const desc = "Configure Study Mode with curated questions from expert reviewers.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
  }, []);

  const { toast } = useToast();
  const navigate = useNavigate();
  const [examId, setExamId] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const [exams, setExams] = useState<examApi.Exam[]>([]);
  const [topics, setTopics] = useState<examApi.Topic[]>([]);

  // Load available exams from backend
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
      navigate(`/auth?returnTo=${encodeURIComponent('/exam/practice/config')}`);
      return;
    }

    setLoading(true);
    try {
      const topicIds = topicId === 'all' ? undefined : [topicId];
      const result = await examApi.startAttempt({
        exam_id: examId,
        mode: 'study',
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

      navigate(`/exam/practice/session/${result.attempt_id}`, {
        state: {
          attemptId: result.attempt_id,
          questions: result.questions,
          examId,
          topicId: topicId === 'all' ? undefined : topicId,
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
            <h1 className="text-xl font-semibold">Study Mode</h1>

          </div>
          <Button variant="outline" onClick={() => navigate('/exam')}>
            Back to Exams
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Study Configuration
            <Badge variant="secondary">Untimed</Badge>
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

          <div className="md:col-span-2">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Study Mode Features:</strong>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Immediate feedback after each question</li>
                  <li>• Expert-reviewed questions only</li>
                  <li>• Detailed explanations included</li>
                  <li>• Navigate freely between questions</li>
                  <li>• AI Guru assistance available</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-2 justify-end pt-2">
            <Button onClick={start} disabled={!examId || loading} size="lg">
              {loading ? 'Loading questions...' : 'Start Study Session'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
