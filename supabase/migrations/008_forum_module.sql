-- EMGurus Hub — Forum Module Schema

-- ============================================================
-- 1. Forum Categories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. Forum Threads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) >= 5),
  content text NOT NULL CHECK (char_length(content) >= 10),
  pinned boolean DEFAULT false,
  locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. Forum Replies
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(content) >= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 4. Forum Votes (upvote/downvote on threads)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.forum_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

-- ============================================================
-- 5. RLS Policies
-- ============================================================

-- Categories: public read, admin manage
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read forum categories"
  ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage forum categories"
  ON public.forum_categories FOR ALL USING (public.user_has_role('admin'));

-- Threads: public read, users create own, authors update own, admins full
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read forum threads"
  ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Users can create forum threads"
  ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own threads"
  ON public.forum_threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins full access to forum threads"
  ON public.forum_threads FOR ALL USING (public.user_has_role('admin'));

-- Replies: public read, users create own, authors update own, admins full
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read forum replies"
  ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create forum replies"
  ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own replies"
  ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins full access to forum replies"
  ON public.forum_replies FOR ALL USING (public.user_has_role('admin'));

-- Votes: users manage own
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read forum votes"
  ON public.forum_votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes"
  ON public.forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes"
  ON public.forum_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes"
  ON public.forum_votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON public.forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_author ON public.forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_thread ON public.forum_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_thread ON public.forum_votes(thread_id);

-- ============================================================
-- 7. Auto-update timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION public.forum_update_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'forum_threads_updated') THEN
    CREATE TRIGGER forum_threads_updated BEFORE UPDATE ON public.forum_threads
      FOR EACH ROW EXECUTE FUNCTION public.forum_update_timestamp();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'forum_replies_updated') THEN
    CREATE TRIGGER forum_replies_updated BEFORE UPDATE ON public.forum_replies
      FOR EACH ROW EXECUTE FUNCTION public.forum_update_timestamp();
  END IF;
END;
$$;

-- Auto-update thread updated_at when a reply is added
CREATE OR REPLACE FUNCTION public.forum_reply_touch_thread()
RETURNS trigger AS $$
BEGIN
  UPDATE public.forum_threads SET updated_at = now() WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'forum_reply_touch_thread') THEN
    CREATE TRIGGER forum_reply_touch_thread AFTER INSERT ON public.forum_replies
      FOR EACH ROW EXECUTE FUNCTION public.forum_reply_touch_thread();
  END IF;
END;
$$;

-- ============================================================
-- 8. Seed default categories
-- ============================================================
INSERT INTO public.forum_categories (title, description) VALUES
  ('General Discussion', 'Open discussion about emergency medicine'),
  ('Exam Prep', 'Share tips and resources for MRCEM and other exams'),
  ('Career Advice', 'Career pathways, interviews, and job hunting'),
  ('Clinical Cases', 'Discuss interesting clinical cases and management'),
  ('Research & QIP', 'Quality improvement projects and research discussions')
ON CONFLICT DO NOTHING;
