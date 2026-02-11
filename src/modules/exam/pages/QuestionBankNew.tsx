import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { listQuestions, listExams, type Question, type Exam } from "@/modules/exam/lib/examApi";

export default function QuestionBankNew() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    document.title = "Question Bank | EMGurus";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Browse and manage exam questions in the question bank with advanced filtering and search capabilities.');

    loadExams();
    loadQuestions();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [searchQuery, selectedExam, selectedLevel]);

  const loadExams = async () => {
    try {
      const { exams: examList } = await listExams();
      setExams(examList);
    } catch (e) {
      console.warn('Failed to load exams', e);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { questions: allQuestions } = await listQuestions({
        exam_id: selectedExam !== "all" ? selectedExam : undefined,
        status: 'published',
        page_size: 1000,
      });

      // Client-side filtering for search and difficulty
      let filtered = allQuestions;
      if (selectedLevel && selectedLevel !== "all") {
        filtered = filtered.filter(q => q.difficulty_level === selectedLevel);
      }
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        filtered = filtered.filter(q => q.stem.toLowerCase().includes(lower));
      }

      setQuestions(filtered);
    } catch (error: any) {
      toast({ title: "Error loading questions", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedExam("all");
    setSelectedLevel("all");
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/tools/submit-question/${questionId}`);
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <main className="container mx-auto px-4 md:px-6 py-6 md:py-10">
      <article className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Question Bank</h1>

        <Card className="p-6 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="grid gap-2">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="All exams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All exams</SelectItem>
                  {exams.map((ex) => (
                    <SelectItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                  <SelectItem value="C3">C3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          {/* Questions Table */}
          {loading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions found matching your criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stem</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow
                      key={question.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleQuestionClick(question.id)}
                    >
                      <TableCell className="font-medium">
                        {truncateText(question.stem)}
                      </TableCell>
                      <TableCell>
                        {question.difficulty_level && (
                          <Badge variant="outline">
                            {question.difficulty_level}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {question.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </article>
    </main>
  );
}
