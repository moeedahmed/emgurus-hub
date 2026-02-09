-- 003_blog_comment_reactions.sql

create extension if not exists pgcrypto;

create table if not exists public.blog_comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.blog_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('up','down')),
  feedback text,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists idx_blog_comment_reactions_comment_id on public.blog_comment_reactions(comment_id);

alter table public.blog_comment_reactions enable row level security;

drop policy if exists "Public can read blog comment reactions" on public.blog_comment_reactions;
create policy "Public can read blog comment reactions"
  on public.blog_comment_reactions for select using (true);

drop policy if exists "Users add own comment reactions" on public.blog_comment_reactions;
create policy "Users add own comment reactions"
  on public.blog_comment_reactions for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users remove own comment reactions" on public.blog_comment_reactions;
create policy "Users remove own comment reactions"
  on public.blog_comment_reactions for delete to authenticated using (auth.uid() = user_id);

