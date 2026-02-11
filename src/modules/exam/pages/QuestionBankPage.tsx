import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import * as examApi from '@/modules/exam/lib/examApi';

export default function QuestionBankPage() {
  const [examId, setExamId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<examApi.Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const [exams, setExams] = useState<examApi.Exam[]>([]);
  const [topics, setTopics] = useState<examApi.Topic[]>([]);
  const [topicId, setTopicId] = useState<string>("all");

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    document.title = "Question Bank • EM Gurus";
  }, []);

  // Load exams on mount
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

  // Fetch questions from examApi
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await examApi.listQuestions({
          exam_id: examId || undefined,
          status: 'published',
          page,
          page_size: pageSize,
        });
        if (!cancelled) {
          setItems(result.questions);
          setTotalCount(result.total);
        }
      } catch (e) {
        console.warn('Bank fetch failed', e);
        const message = e instanceof Error ? e.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to load questions",
          description: message,
        });
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [examId, page]);

  // Filter by search client-side (backend doesn't have search param in current API)
  const filtered = search
    ? items.filter(q => q.stem.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardContent className="py-4 grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2"><Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <Select value={examId || "ALL"} onValueChange={(v) => { setExamId(v === "ALL" ? "" : v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Exam" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Exams</SelectItem>
              {exams.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={topicId} onValueChange={(v) => { setTopicId(v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Topic" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(t => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => { setExamId(""); setTopicId("all"); setSearch(""); setPage(1); }}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 mt-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border animate-pulse bg-muted/40" />
          ))
        ) : filtered.length ? (
          filtered.map((q) => (
            <Card key={q.id} className="cursor-pointer hover:bg-accent/30" onClick={() => navigate(`/exam/question/${q.id}`)}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="truncate">{q.stem?.slice(0, 160) || 'Question'}</span>
                  <div className="text-xs text-muted-foreground capitalize">{q.status}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                {q.difficulty_level && <span className="border rounded px-2 py-0.5">{q.difficulty_level}</span>}
                {q.source_type && <span className="border rounded px-2 py-0.5">{q.source_type}</span>}
                {q.published_at && (
                  <span className="border rounded px-2 py-0.5">Published {new Date(q.published_at).toLocaleDateString()}</span>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">No questions found.</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" disabled={page===1} onClick={() => setPage(p=>Math.max(1,p-1))}>Previous</Button>
        <div className="text-sm text-muted-foreground">Page {page} / {totalPages}</div>
        <Button variant="outline" disabled={page>=totalPages} onClick={() => setPage(p=>Math.min(totalPages, p+1))}>Next</Button>
      </div>
    </div>
  );
}
