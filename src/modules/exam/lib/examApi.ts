// Frontend API layer for the Exam module Edge Function (exam-api)
// Follows the same pattern as blogsApi.ts

import { supabase } from '@/core/auth/supabase';

const BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exam-api`;

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { method = 'GET', body } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
  };
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed ${res.status}`);
  }
  return res.json();
}

// ─── Types ───

export interface Exam {
  id: string;
  name: string;
  board?: string;
  curriculum?: string;
  format_prompt?: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  parent_id?: string | null;
  exam_id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  exam_id: string;
  topic_id?: string | null;
  stem: string;
  options: QuestionOption[];
  correct_answer: string;
  difficulty_level?: 'C1' | 'C2' | 'C3';
  per_option_explanations?: Record<string, string>;
  status: 'draft' | 'assigned' | 'reviewed' | 'rejected' | 'published' | 'archived' | 'marked';
  source_type?: 'ai' | 'human';
  source_provenance?: Record<string, unknown>;
  created_by?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  archived_at?: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  exam_id: string;
  mode: 'study' | 'exam';
  started_at: string;
  completed_at?: string;
  total_questions: number;
  correct_count: number;
  time_spent_seconds: number;
}

export interface AttemptStartResult {
  attempt_id: string;
  started_at: string;
  questions: Question[];
}

export interface SubmitAnswerResult {
  is_correct: boolean;
  correct_answer?: string;
  explanation?: Record<string, string>;
}

export interface AttemptSummary {
  total: number;
  correct: number;
  percentage: number;
  time_spent_seconds: number;
}

export interface AnalyticsResult {
  coverage_by_topic: {
    topic_id: string;
    topic_name: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  accuracy_by_difficulty: {
    difficulty_level: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  weak_areas: {
    topic_id: string;
    topic_name: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  overall: {
    total_attempts: number;
    total_questions: number;
    correct: number;
    accuracy: number;
  };
}

// ─── API Functions ───

/** List all exams */
export function listExams(): Promise<{ exams: Exam[] }> {
  return request('/api/exam/exams');
}

/** List topics for an exam */
export function listTopics(examId?: string): Promise<{ topics: Topic[] }> {
  const qs = examId ? `?exam_id=${examId}` : '';
  return request(`/api/exam/topics${qs}`);
}

/** List questions (admin/guru view) */
export function listQuestions(params?: {
  exam_id?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<{ questions: Question[]; page: number; page_size: number; total: number }> {
  const qs = new URLSearchParams();
  if (params?.exam_id) qs.set('exam_id', params.exam_id);
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.page_size) qs.set('page_size', String(params.page_size));
  const queryStr = qs.toString();
  return request(`/api/exam/questions${queryStr ? `?${queryStr}` : ''}`);
}

/** Generate AI questions */
export function generateQuestions(body: {
  exam_id: string;
  topic_id?: string;
  difficulty_level?: 'C1' | 'C2' | 'C3';
  count?: number;
}): Promise<{ questions: Question[] }> {
  return request('/api/exam/generate-question', { method: 'POST', body });
}

/** Start a new attempt */
export function startAttempt(body: {
  exam_id: string;
  mode: 'study' | 'exam';
  topic_ids?: string[];
}): Promise<AttemptStartResult> {
  return request('/api/exam/attempt/start', { method: 'POST', body });
}

/** Submit an answer within an attempt */
export function submitAnswer(
  attemptId: string,
  body: {
    question_id: string;
    user_answer: string;
    time_spent_seconds?: number;
  }
): Promise<SubmitAnswerResult> {
  return request(`/api/exam/attempt/${attemptId}/submit`, {
    method: 'POST',
    body,
  });
}

/** Complete an attempt */
export function completeAttempt(
  attemptId: string
): Promise<{ summary: AttemptSummary }> {
  return request(`/api/exam/attempt/${attemptId}/complete`, {
    method: 'POST',
    body: {},
  });
}

/** Get user analytics */
export function getAnalytics(examId?: string): Promise<AnalyticsResult> {
  const qs = examId ? `?exam_id=${examId}` : '';
  return request(`/api/exam/analytics${qs}`);
}

/** Flag a question */
export function flagQuestion(body: {
  question_id: string;
  reason?: string;
}): Promise<{ flag_id: string }> {
  return request('/api/exam/flag', { method: 'POST', body });
}

/** Assign a question to a guru (admin only) */
export function assignQuestion(
  questionId: string,
  guruId: string
): Promise<{ ok: true }> {
  return request(`/api/exam/review/${questionId}/assign`, {
    method: 'POST',
    body: { guru_id: guruId },
  });
}

/** Approve a question (guru/admin) */
export function approveQuestion(
  questionId: string,
  perOptionExplanations?: Record<string, string>
): Promise<{ ok: true }> {
  return request(`/api/exam/review/${questionId}/approve`, {
    method: 'POST',
    body: { per_option_explanations: perOptionExplanations },
  });
}

/** Reject a question (guru/admin) */
export function rejectQuestion(
  questionId: string,
  notes?: string
): Promise<{ ok: true }> {
  return request(`/api/exam/review/${questionId}/reject`, {
    method: 'POST',
    body: { notes },
  });
}

/** List user's own attempts */
export function listAttempts(): Promise<{ attempts: Attempt[] }> {
  return request('/api/exam/attempts');
}
