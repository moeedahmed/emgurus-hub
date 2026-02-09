-- 002_blog_module.sql
-- Blog module backend for EMGurus Hub (MVP)

create extension if not exists pgcrypto;

-- ---------- Core tables ----------
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  content text,
  cover_image_url text,
  category_id uuid references public.blog_categories(id) on delete set null,
  author_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft','in_review','published','archived')),
  is_featured boolean not null default false,
  view_count integer not null default 0,
  likes_count integer not null default 0,
  tags text[] not null default '{}',
  review_notes text,
  reviewer_id uuid references auth.users(id) on delete set null,
  reading_minutes integer,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, tag_id)
);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  parent_id uuid references public.blog_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('thumbs_up','thumbs_down')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.blog_likes (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.blog_ai_summaries (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  summary_md text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_review_assignments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_review_logs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_post_discussions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_post_feedback (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_shares (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  platform text,
  created_at timestamptz not null default now()
);

-- ---------- Helpers ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_comments_updated_at on public.blog_comments;
create trigger trg_blog_comments_updated_at
before update on public.blog_comments
for each row execute function public.set_updated_at();

-- ---------- Indexes ----------
create index if not exists idx_blog_posts_status_published_at on public.blog_posts(status, published_at desc);
create index if not exists idx_blog_posts_author_id on public.blog_posts(author_id);
create index if not exists idx_blog_posts_category_id on public.blog_posts(category_id);
create index if not exists idx_blog_comments_post_id on public.blog_comments(post_id);
create index if not exists idx_blog_reactions_post_id on public.blog_reactions(post_id);

-- ---------- Seed categories ----------
insert into public.blog_categories (title, slug)
values
  ('General', 'general'),
  ('Exam Prep', 'exam-prep'),
  ('Clinical Insights', 'clinical-insights'),
  ('Research & Evidence', 'research-evidence'),
  ('Careers', 'careers'),
  ('Announcements', 'announcements')
on conflict (slug) do update set title = excluded.title;

-- ---------- Storage bucket ----------
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

-- ---------- RLS ----------
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.blog_comments enable row level security;
alter table public.blog_reactions enable row level security;
alter table public.blog_likes enable row level security;
alter table public.blog_ai_summaries enable row level security;
alter table public.blog_review_assignments enable row level security;
alter table public.blog_review_logs enable row level security;
alter table public.blog_post_discussions enable row level security;
alter table public.blog_post_feedback enable row level security;
alter table public.blog_shares enable row level security;

-- Read access: public blog content
create policy "Public can view categories" on public.blog_categories for select using (true);
create policy "Public can view tags" on public.blog_tags for select using (true);
create policy "Public can view published posts" on public.blog_posts for select using (status = 'published');
create policy "Authors can view own posts" on public.blog_posts for select to authenticated using (auth.uid() = author_id);
create policy "Public can view post tags" on public.blog_post_tags for select using (true);
create policy "Public can read comments" on public.blog_comments for select using (true);
create policy "Public can read reactions" on public.blog_reactions for select using (true);
create policy "Public can read summaries" on public.blog_ai_summaries for select using (true);

-- Any authenticated user can draft/edit own posts
create policy "Users can create own posts" on public.blog_posts for insert to authenticated with check (auth.uid() = author_id);
create policy "Authors can update own drafts" on public.blog_posts for update to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Comments/reactions by authenticated users
create policy "Users can write comments" on public.blog_comments for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own comments" on public.blog_comments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.blog_comments for delete to authenticated using (auth.uid() = user_id);

create policy "Users can react" on public.blog_reactions for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can remove own reaction" on public.blog_reactions for delete to authenticated using (auth.uid() = user_id);

create policy "Users can like" on public.blog_likes for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can unlike" on public.blog_likes for delete to authenticated using (auth.uid() = user_id);
create policy "Users can view own likes" on public.blog_likes for select to authenticated using (auth.uid() = user_id);

create policy "Users can submit feedback" on public.blog_post_feedback for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can view own feedback" on public.blog_post_feedback for select to authenticated using (auth.uid() = user_id);
create policy "Users can track shares" on public.blog_shares for insert to authenticated with check (auth.uid() = user_id or user_id is null);
create policy "Public can read shares" on public.blog_shares for select using (true);

-- Storage policies
create policy "Public can read blog cover images"
on storage.objects for select
to public
using (bucket_id = 'blog-covers');

create policy "Users can upload own blog covers"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-covers' and owner = auth.uid());

create policy "Users can update own blog covers"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-covers' and owner = auth.uid())
with check (bucket_id = 'blog-covers' and owner = auth.uid());

create policy "Users can delete own blog covers"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-covers' and owner = auth.uid());
