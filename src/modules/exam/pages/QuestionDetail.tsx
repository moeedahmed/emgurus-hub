import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/modules/exam/components/exams/QuestionCard";
import QuestionChat from "@/modules/exam/components/exams/QuestionChat";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { listQuestions, type Question } from "@/modules/exam/lib/examApi";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromAdmin = Boolean((location.state as any)?.fromAdmin);
  const [q, setQ] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>("");

  const handleSelect = async (k: string) => {
    if (selectedKey) return;
    setSelectedKey(k);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { questions } = await listQuestions({ status: 'published', page_size: 1000 });
        const found = questions.find((item) => item.id === id);
        if (!cancelled) setQ(found || null);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Failed to load question",
          description: (e as any)?.message || 'Unknown error',
        });
        if (!cancelled) setQ(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const options = q?.options || [];
  const explanation = q?.per_option_explanations
    ? Object.entries(q.per_option_explanations).map(([k, v]) => `${k}: ${v}`).join('\n')
    : 'No explanation provided.';

  return (
    <div className="container mx-auto px-4 py-6">
      {!fromAdmin && (
        <Button variant="ghost" onClick={() => navigate('/exams')} aria-label="Back to exams">Back to exams</Button>
      )}
      <Card className="mt-3">
        <CardHeader>
          {!fromAdmin && (<CardTitle>Practice Mode</CardTitle>)}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-24 rounded-xl border animate-pulse bg-muted/40" />
          ) : q ? (
            <>
              <QuestionCard
                stem={q.stem || 'Question'}
                options={options}
                selectedKey={selectedKey}
                onSelect={handleSelect}
                showExplanation={true}
                explanation={explanation}
                correctKey={q.correct_answer}
              />
              <div className="mt-6 flex flex-wrap gap-2">
                {q.difficulty_level && <Badge variant="outline">{q.difficulty_level}</Badge>}
                {q.published_at && <Badge variant="outline">Published {new Date(q.published_at).toLocaleDateString()}</Badge>}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-10">Question not found.</div>
          )}
        </CardContent>
      </Card>

      {q && (
        <div className="mt-6">
          <QuestionChat questionId={q.id} />
        </div>
      )}
    </div>
  );
}
