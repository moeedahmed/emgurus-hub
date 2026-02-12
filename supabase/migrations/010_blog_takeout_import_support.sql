-- 010_blog_takeout_import_support.sql
-- Support repeatable Google Takeout -> blog import

alter table public.blog_posts
  add column if not exists source_platform text,
  add column if not exists source_path text;

create index if not exists idx_blog_posts_source_path on public.blog_posts(source_path);

insert into public.blog_categories (title, slug)
values ('Imported', 'imported')
on conflict (slug) do update set title = excluded.title;

insert into storage.buckets (id, name, public)
values ('blog-assets', 'blog-assets', true)
on conflict (id) do nothing;

create policy "Public can read blog assets"
on storage.objects for select
to public
using (bucket_id = 'blog-assets');

create policy "Service role can upload blog assets"
on storage.objects for insert
to service_role
with check (bucket_id = 'blog-assets');

create policy "Service role can update blog assets"
on storage.objects for update
to service_role
using (bucket_id = 'blog-assets')
with check (bucket_id = 'blog-assets');
