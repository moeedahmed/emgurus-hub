-- EMGurus Hub — Exam Module Schema
-- 9 tables for the Exam Guru module

-- ============================================================
-- 1. exam_exams — Exam metadata (boards, curricula, formats)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  board TEXT,
  curriculum TEXT,
  format_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. exam_topics — Hierarchical topic taxonomy
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.exam_topics(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exam_exams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_topics_parent ON public.exam_topics(parent_id);
CREATE INDEX IF NOT EXISTS idx_exam_topics_exam ON public.exam_topics(exam_id);

-- ============================================================
-- 3. exam_resources — Topic-level resources
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.exam_topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('book', 'link', 'file', 'video')),
  url TEXT,
  edition TEXT,
  publication_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_resources_topic ON public.exam_resources(topic_id);

-- ============================================================
-- 4. exam_questions — Canonical question table with status pipeline
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exam_exams(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.exam_topics(id) ON DELETE SET NULL,
  stem TEXT NOT NULL,
  options JSONB NOT NULL,
  per_option_explanations JSONB,
  correct_answer TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('C1', 'C2', 'C3')),
  status TEXT CHECK (status IN ('draft', 'assigned', 'reviewed', 'rejected', 'published', 'archived', 'marked')) DEFAULT 'draft',
  source_type TEXT CHECK (source_type IN ('ai', 'human')),
  source_provenance JSONB,
  created_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON public.exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_topic ON public.exam_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_status ON public.exam_questions(status);

-- ============================================================
-- 5. exam_attempts — Unified attempt logging
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exam_exams(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('study', 'exam')) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_questions INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  time_spent_seconds INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON public.exam_attempts(exam_id);

-- ============================================================
-- 6. exam_attempt_items — Per-question responses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_attempt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INT,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_attempt_items_attempt ON public.exam_attempt_items(attempt_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempt_items_question ON public.exam_attempt_items(question_id);

-- ============================================================
-- 7. exam_review_log — Reviewer history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_review_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  action TEXT CHECK (action IN ('assigned', 'reviewed', 'approved', 'rejected', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_review_log_question ON public.exam_review_log(question_id);

-- ============================================================
-- 8. exam_discussions — In-question admin/guru chat
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_discussions_question ON public.exam_discussions(question_id);

-- ============================================================
-- 9. exam_flags — User feedback/issue reporting
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exam_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  reason TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_flags_question ON public.exam_flags(question_id);
CREATE INDEX IF NOT EXISTS idx_exam_flags_resolved ON public.exam_flags(resolved);
