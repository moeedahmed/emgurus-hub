# Task: Phase A — Replace Edge Function calls with direct Supabase queries for all blog engagement features

## What to do

All blog engagement features (likes, comments, shares, reports/feedback) currently call a `blogs-api` Edge Function that either doesn't exist or returns errors. The DB tables and RLS policies already exist and work. Replace all Edge Function calls with direct Supabase client queries.

## Tables & RLS (already set up)

| Feature | Table | RLS |
|---------|-------|-----|
| Likes | `blog_likes` (post_id, user_id, created_at) — composite PK | INSERT/DELETE own, SELECT own |
| Comments | `blog_comments` (id, post_id, user_id, content, parent_id, created_at, updated_at) | INSERT/DELETE/UPDATE own, SELECT all |
| Comment reactions | `blog_comment_reactions` (id, comment_id, user_id, reaction, feedback, created_at) | INSERT/DELETE own, SELECT all |
| Shares | `blog_shares` (id, post_id, user_id, platform, created_at) | INSERT (own or null user), SELECT all |
| Feedback | `blog_post_feedback` (id, post_id, user_id, message, created_at) | INSERT own, SELECT own |
| Post reactions | `blog_reactions` (id, post_id, user_id, reaction, created_at) | INSERT/DELETE own, SELECT all |

Note: `blog_likes` uses composite PK (post_id, user_id) not a UUID id. Check if this causes issues — may need `blog_reactions` with reaction='like' instead. Or use blog_likes directly with upsert-like logic.

## Files to modify

### 1. `src/modules/blog/lib/blogsApi.ts`
The fallback direct-query path in `getBlog()` already works but doesn't fetch:
- Like count (needs: count from `blog_likes` where post_id matches)
- User's like status (needs: check `blog_likes` for current user)
- Comments with author profiles (needs: join `blog_comments` with `profiles`)
- Shares count

**Make the direct Supabase path the PRIMARY path, not the fallback.** Keep the Edge Function attempt as a fallback (swap them).

Add these new direct-query functions:
- `toggleLike(postId)` — check if `blog_likes` row exists for user, insert or delete
- `addComment(postId, content, parentId?)` — insert into `blog_comments`
- `deleteComment(commentId)` — delete from `blog_comments` where user owns it
- `reactToComment(commentId, reaction)` — toggle in `blog_comment_reactions`
- `trackShare(postId, platform)` — insert into `blog_shares`
- `submitFeedback(postId, message)` — insert into `blog_post_feedback`
- `getComments(postId)` — fetch comments with author profiles, build tree

### 2. `src/modules/blog/pages/BlogDetail.tsx`
- Replace the `handleLike` TODO with actual `toggleLike()` call
- Load real like count and user's like status on mount
- Load comments via direct query instead of Edge Function
- Wire share tracking to `trackShare()`

### 3. `src/modules/blog/components/blogs/CommentThread.tsx`
- Replace ALL `fetch(getFunctionsBaseUrl() + ...)` calls with direct Supabase queries
- `loadComments()` → use `supabase.from('blog_comments').select('*, author:profiles(id, display_name, avatar_url)').eq('post_id', postId).order('created_at')`
- `submit()` → use `supabase.from('blog_comments').insert({...})`
- `deleteComment()` → use `supabase.from('blog_comments').delete().eq('id', commentId)`
- `reactToComment()` → use `supabase.from('blog_comment_reactions')` toggle
- Remove import of `getFunctionsBaseUrl`

### 4. `src/modules/blog/components/blogs/ReportIssueModal.tsx`
- Replace `callFunction(...)` with `supabase.from('blog_post_feedback').insert({...})`
- Remove import of `callFunction` / `getFunctionsBaseUrl`

### 5. `src/modules/blog/components/blogs/ShareButtons.tsx`
- The `trackShare` callback comes from parent — ensure parent passes a function that calls `supabase.from('blog_shares').insert({...})`

## Also fix: blog_likes RLS

Currently `blog_likes` SELECT policy is `auth.uid() = user_id` (own only). We need to COUNT all likes. Either:
- Add a public SELECT policy on `blog_likes`, OR
- Use `blog_reactions` table instead (which already has public SELECT)

**Recommended:** Add a policy `"Anyone can count likes"` on `blog_likes` for SELECT with `USING (true)` — this is standard for social features. 

Run this SQL via the Supabase Management API:
```
TOKEN=$(cat /home/moeed/.supabase/access-token)
curl -s -X POST "https://api.supabase.com/v1/projects/eqljsghnuiysgruwztxs/database/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "DROP POLICY IF EXISTS \"Users can view own likes\" ON blog_likes; CREATE POLICY \"Public can read likes\" ON blog_likes FOR SELECT USING (true);"}'
```

## Completion criteria
- [ ] Like button toggles (filled/unfilled), persists on reload, shows real count
- [ ] Comments load from DB, can post new comment, can delete own, threaded replies work
- [ ] Comment reactions (thumbs up) work with real DB
- [ ] Share tracking records to `blog_shares`
- [ ] Report Issue submits to `blog_post_feedback`
- [ ] All engagement counts on blog list page are real
- [ ] No more Edge Function (`blogs-api`) calls in engagement features
- [ ] Build succeeds (`npm run build`)
- [ ] Commit changes

## Constraints
- Do NOT modify blog list page layout or card design
- Do NOT touch the blog editor (`BlogsEditor.tsx`)
- Keep the existing Edge Function fallback in `listBlogs()` and `getBlog()` as secondary path
- Use `supabase` client from `@/core/auth/supabase`
- Use `useAuth` from `@/modules/career/contexts/AuthContext` for current user
- Mobile-first — test at 375px if making UI changes

## Context
- Stack: React 19, Vite 7, Supabase JS v2, Shadcn, Tailwind v4
- Supabase project: `eqljsghnuiysgruwztxs`
- Supabase Management API access token: `cat /home/moeed/.supabase/access-token`
- Project: `/home/moeed/projects/emgurus-hub`
