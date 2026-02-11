-- EMGurus Hub — Exam Module RLS Policies
-- Uses user_roles table for admin/guru checks

-- Helper function: check if current user has a given role
CREATE OR REPLACE FUNCTION public.user_has_role(check_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = check_role::app_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- exam_exams — public read, admin write
-- ============================================================
ALTER TABLE public.exam_exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exams"
  ON public.exam_exams FOR SELECT
  USING (true);

CREATE POLICY "Admins full access to exams"
  ON public.exam_exams FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_topics — public read, admin write
-- ============================================================
ALTER TABLE public.exam_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read topics"
  ON public.exam_topics FOR SELECT
  USING (true);

CREATE POLICY "Admins full access to topics"
  ON public.exam_topics FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_resources — public read, admin write
-- ============================================================
ALTER TABLE public.exam_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read resources"
  ON public.exam_resources FOR SELECT
  USING (true);

CREATE POLICY "Admins full access to resources"
  ON public.exam_resources FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_questions — layered access
-- ============================================================
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

-- Users: read published questions only
CREATE POLICY "Users can read published questions"
  ON public.exam_questions FOR SELECT
  USING (status = 'published');

-- Gurus: read assigned/reviewed questions assigned to them
CREATE POLICY "Gurus can read assigned questions"
  ON public.exam_questions FOR SELECT
  USING (
    status IN ('assigned', 'reviewed')
    AND reviewed_by = auth.uid()
    AND public.user_has_role('guru')
  );

-- Gurus: update assigned questions (add explanations, etc.)
CREATE POLICY "Gurus can update assigned questions"
  ON public.exam_questions FOR UPDATE
  USING (
    status = 'assigned'
    AND reviewed_by = auth.uid()
    AND public.user_has_role('guru')
  );

-- Admins: full access
CREATE POLICY "Admins full access to questions"
  ON public.exam_questions FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_attempts — users own attempts only
-- ============================================================
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own attempts"
  ON public.exam_attempts FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins full access to attempts"
  ON public.exam_attempts FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_attempt_items — users own attempt items only
-- ============================================================
ALTER TABLE public.exam_attempt_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own attempt items"
  ON public.exam_attempt_items FOR ALL
  USING (
    attempt_id IN (
      SELECT id FROM public.exam_attempts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins full access to attempt items"
  ON public.exam_attempt_items FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_review_log — gurus + admins
-- ============================================================
ALTER TABLE public.exam_review_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gurus can read own review logs"
  ON public.exam_review_log FOR SELECT
  USING (reviewer_id = auth.uid());

CREATE POLICY "Admins full access to review logs"
  ON public.exam_review_log FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_discussions — question participants
-- ============================================================
ALTER TABLE public.exam_discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read discussions on their assigned questions"
  ON public.exam_discussions FOR SELECT
  USING (
    public.user_has_role('guru') OR public.user_has_role('admin')
  );

CREATE POLICY "Users can insert own discussion messages"
  ON public.exam_discussions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (public.user_has_role('guru') OR public.user_has_role('admin'))
  );

CREATE POLICY "Admins full access to discussions"
  ON public.exam_discussions FOR ALL
  USING (public.user_has_role('admin'));

-- ============================================================
-- exam_flags — users can flag, admins manage
-- ============================================================
ALTER TABLE public.exam_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can flag questions"
  ON public.exam_flags FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own flags"
  ON public.exam_flags FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins full access to flags"
  ON public.exam_flags FOR ALL
  USING (public.user_has_role('admin'));
