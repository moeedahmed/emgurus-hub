-- EMGurus Hub — Shared Spine Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This adds hub-level tables alongside existing career tables

-- ============================================================
-- 1. Hub Profile (extends existing profiles table)
-- ============================================================
-- Add hub-specific columns to existing profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS track text DEFAULT 'uk' CHECK (track IN ('uk', 'img', 'global')),
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS hub_onboarding_completed boolean DEFAULT false;

-- ============================================================
-- 2. Module Entitlements
-- ============================================================
CREATE TABLE IF NOT EXISTS public.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module text NOT NULL CHECK (module IN ('career', 'exam', 'blog', 'qip', 'portfolio', 'job', 'interview', 'research')),
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'pro_plus')),
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module)
);

-- ============================================================
-- 3. Feature Flags
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  enabled boolean DEFAULT false,
  description text,
  module text, -- null = global flag
  created_at timestamptz DEFAULT now()
);

-- Seed initial feature flags
INSERT INTO public.feature_flags (key, enabled, description, module) VALUES
  ('career_module', true, 'Career Guru module', 'career'),
  ('exam_module', false, 'Exam Guru module', 'exam'),
  ('blog_module', false, 'Blog module', 'blog'),
  ('onboarding_wizard', true, 'Hub onboarding wizard', null)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 4. Artefacts Library (shared output store)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.artefacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module text NOT NULL,
  type text NOT NULL, -- e.g. 'career_plan', 'exam_report', 'blog_draft'
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  tags text[] DEFAULT '{}',
  version integer DEFAULT 1,
  parent_id uuid REFERENCES public.artefacts(id), -- for versioning
  goal_id uuid, -- optional link to a goal
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. User Usage Tracking (hub-level)
-- ============================================================
-- Existing user_usage table may already cover this for career.
-- Add module-aware usage if not present:
CREATE TABLE IF NOT EXISTS public.hub_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module text NOT NULL,
  action text NOT NULL, -- e.g. 'ai_query', 'exam_attempt', 'artefact_created'
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 6. RLS Policies
-- ============================================================

-- Entitlements: users can read their own
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own entitlements" ON public.entitlements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages entitlements" ON public.entitlements
  FOR ALL USING (auth.role() = 'service_role');

-- Feature flags: anyone can read (public config)
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read feature flags" ON public.feature_flags
  FOR SELECT USING (true);
CREATE POLICY "Service role manages feature flags" ON public.feature_flags
  FOR ALL USING (auth.role() = 'service_role');

-- Artefacts: users can CRUD their own
ALTER TABLE public.artefacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own artefacts" ON public.artefacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own artefacts" ON public.artefacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own artefacts" ON public.artefacts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own artefacts" ON public.artefacts
  FOR DELETE USING (auth.uid() = user_id);

-- Hub usage: users can read their own
ALTER TABLE public.hub_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own hub usage" ON public.hub_usage
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own hub usage" ON public.hub_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 7. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_entitlements_user ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_artefacts_user ON public.artefacts(user_id);
CREATE INDEX IF NOT EXISTS idx_artefacts_module ON public.artefacts(module);
CREATE INDEX IF NOT EXISTS idx_hub_usage_user ON public.hub_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_usage_module ON public.hub_usage(module);

-- ============================================================
-- 8. Auto-create profile + entitlements on signup
-- ============================================================
-- Note: The existing career project likely already has a trigger for profiles.
-- This adds free entitlements for all active modules on signup.
CREATE OR REPLACE FUNCTION public.handle_new_hub_user()
RETURNS trigger AS $$
BEGIN
  -- Give free entitlements for active modules
  INSERT INTO public.entitlements (user_id, module, tier)
  SELECT NEW.id, ff.module, 'free'
  FROM public.feature_flags ff
  WHERE ff.enabled = true AND ff.module IS NOT NULL
  ON CONFLICT (user_id, module) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_hub') THEN
    CREATE TRIGGER on_auth_user_created_hub
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_hub_user();
  END IF;
END;
$$;
