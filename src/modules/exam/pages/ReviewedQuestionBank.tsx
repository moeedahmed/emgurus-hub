import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listQuestions, listExams, type Question, type Exam } from "@/modules/exam/lib/examApi";
import { useRoles } from "@/modules/exam/hooks/useRoles";

export default function ReviewedQuestionBank({ embedded = false }: { embedded?: boolean } = {}) {
  const [examId, setExamId] = useState<string | "">("");
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const [items, setItems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();
  const { isAdmin } = useRoles();

  useEffect(() => {
    document.title = "Question Bank • EM Gurus";
    const desc = "Browse human‑reviewed EM questions with powerful filters. Start Practice or Exam mode from the landing page.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
  }, []);

  // Load exams list once
  useEffect(() => {
    (async () => {
      try {
        const { exams: examList } = await listExams();
        setExams(examList);
      } catch (e) {
        console.warn('Failed to load exams', e);
      }
    })();
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [totalPages]);

  // Load questions via examApi
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { questions, total } = await listQuestions({
          exam_id: examId || undefined,
          status: 'published',
          page,
          page_size: pageSize,
        });
        // Client-side stem search filter (API may not support text search)
        const qtext = qDebounced.trim().toLowerCase();
        const filtered = qtext
          ? questions.filter((item) => item.stem.toLowerCase().includes(qtext))
          : questions;
        if (!cancelled) {
          setItems(filtered);
          setTotalCount(qtext ? filtered.length : total);
        }
      } catch (e) {
        console.warn('Failed to load questions', e);
        if (!cancelled) {
          setItems([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [examId, qDebounced, page, pageSize]);

  const visible = items;

  const FiltersPanel = () => {
    return (
      <Card className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Search</div>
          <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search questions..." />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Exam</div>
          <Select value={examId || "ALL"} onValueChange={(v) => { setExamId(v === "ALL" ? "" : v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Exam" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All exams</SelectItem>
              {exams.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => { setQ(""); setExamId(""); setPage(1); }}>Reset</Button>
      </Card>
    );
  };

  return (
    <main>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!embedded && (
          <div className="sticky top-20 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-4">
            <h1 className="text-2xl font-semibold py-2">Question Bank</h1>
          </div>
        )}

        {embedded ? (
          <div className="grid gap-4">
            {/* Top horizontal filters */}
            <Card>
              <CardContent className="py-4 grid gap-3 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Input value={q} onChange={(e)=>{ setQ(e.target.value); setPage(1); }} placeholder="Search" />
                </div>
                <Select value={examId || "ALL"} onValueChange={(v)=>{ setExamId(v === "ALL" ? "" : v); setPage(1); }}>
                  <SelectTrigger><SelectValue placeholder="Exam" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All exams</SelectItem>
                    {exams.map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => { setQ(""); setExamId(""); setPage(1); }}>Reset</Button>
              </CardContent>
            </Card>

            {/* Table results */}
            <Card className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stem</TableHead>
                    <TableHead className="w-[12%]">Difficulty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={2}>Loading…</TableCell></TableRow>
                  ) : (visible.length ? (
                    visible.map((it) => (
                      <TableRow key={it.id} className="cursor-pointer hover:bg-accent/30" onClick={() => navigate(`/tools/submit-question/${it.id}`, { state: { fromAdmin: isAdmin } })}>
                        <TableCell className="text-xs">{(it.stem || '').slice(0, 140)}</TableCell>
                        <TableCell className="text-xs">{it.difficulty_level || '—'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">No results</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" disabled={page===1 || loading} onClick={() => setPage(p=>Math.max(1,p-1))}>Previous</Button>
              <div className="text-sm text-muted-foreground">Page {page}{totalCount ? ` / ${Math.max(1, Math.ceil(totalCount / pageSize))}` : ''}</div>
              <Button variant="outline" disabled={loading || (items.length < pageSize && !loading)} onClick={() => setPage(p=>p+1)}>Next</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8">
              {/* Mobile Filter Sheet - only render below lg breakpoint */}
              <div className="mb-4 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Filters</Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 sm:w-96">
                    <FiltersPanel />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="space-y-3">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-24 animate-pulse" />
                  ))
                ) : (totalCount === 0 && page === 1) ? (
                  <Card className="p-6 text-center"><div className="text-muted-foreground">No published questions yet.</div></Card>
                ) : visible.length ? (
                  visible.map((it) => (
                    <Card
                      key={it.id}
                      className="hover:bg-accent/30 cursor-pointer"
                      role="button"
                      onClick={() => navigate(`/tools/submit-question/${it.id}`, { state: { fromAdmin: embedded } })}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">
                          <span className="line-clamp-2">{it.stem.slice(0, 200)}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground flex flex-col gap-2">
                        {isAdmin && it.published_at && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              Published {formatDistanceToNow(new Date(it.published_at), { addSuffix: true })}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {it.difficulty_level && (
                            <Badge variant="secondary">{it.difficulty_level}</Badge>
                          )}
                          {it.source_type && (
                            <Badge variant="outline">{it.source_type}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center"><div className="text-muted-foreground">No results match your filters.</div></Card>
                )}
              </div>

              <div className="flex items-center justify-center mt-4 gap-4">
                <Button variant="outline" disabled={page===1 || loading} onClick={() => setPage(p=>Math.max(1,p-1))}>Previous</Button>
                <div className="text-sm text-muted-foreground">Page {page}{totalCount ? ` / ${Math.max(1, Math.ceil(totalCount / pageSize))}` : ''}</div>
                <Button variant="outline" disabled={loading || (items.length < pageSize && !loading)} onClick={() => setPage(p=>p+1)}>Next</Button>
              </div>
            </section>

            <aside className="lg:col-span-4 hidden lg:block">
              <div className="lg:sticky lg:top-20">
                <div className="max-h-[calc(100vh-6rem)] overflow-auto pr-2">
                  <FiltersPanel />
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
