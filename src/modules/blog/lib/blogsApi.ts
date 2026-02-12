// This module contains the React Query hooks and functions for interacting with blogs
import { getErrorMessage } from "@/modules/blog/lib/errors";

export type ReactionKey = "thumbs_up" | "thumbs_down";

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  category?: { id: string; title?: string; slug?: string } | null;
  tags?: { slug?: string; title?: string }[];
  author?: { id: string; name: string; avatar?: string | null };
  reading_minutes?: number | null;
  published_at?: string | null;
  is_featured?: boolean;
  counts?: {
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
  };
}

export interface BlogDetailPayload {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  category?: { id: string; title?: string; slug?: string } | null;
  tags?: { slug?: string; title?: string }[];
  author?: { id: string; name: string; avatar?: string | null };
  reading_minutes?: number | null;
  published_at?: string | null;
  counts?: {
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
    feedback?: number;
  };
  engagement?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    feedback: number;
  };
  reactions?: { [key in ReactionKey]?: number };
  user_reaction?: ReactionKey | null;
  user_liked?: boolean;
  ai_summary?: string | null;
  comments?: any[];
}

// Primary API functions pointing to the blogs-api Edge Function
const BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blogs-api`;

import { supabase } from '@/core/auth/supabase';

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listBlogs(params: {
  status?: "draft" | "in_review" | "published" | "archived";
  category?: string;
  tag?: string;
  author?: string;
  sort?: string;
  q?: string;
  page?: number;
  page_size?: number;
  featured?: boolean;
}): Promise<{ items: BlogListItem[]; page: number; page_size: number; total: number }> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.category) qs.set("category", params.category);
  if (params.tag) qs.set("tag", params.tag);
  if (params.q) qs.set("q", params.q);
  if (params.author) qs.set("author", params.author);
  if (params.sort) qs.set("sort", params.sort);
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  if (params.featured) qs.set("featured", "true");
  try {
    const res = await fetch(`${BASE}/api/blogs?${qs.toString()}`, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (err) {
    // Fallback to direct Supabase query if Edge Function is temporarily unavailable or outdated
    const page = params.page ?? 1;
    const pageSize = Math.min(50, Math.max(1, params.page_size ?? 12));
    const status = params.status ?? "published";

    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, description, cover_image_url, category_id, author_id, status, view_count, created_at, is_featured")
      .eq("status", status);
    
    if (params.featured) query = query.eq("is_featured", true);

    const { data: rawPosts, error } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw new Error(error.message);

    // Count total
    let countQuery = supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", status);
    
    if (params.featured) countQuery = countQuery.eq("is_featured", true);
    
    const { count } = await countQuery;

    // Fetch related data
    const authorIds = [...new Set(rawPosts?.map(p => p.author_id).filter(Boolean))];
    const categoryIds = [...new Set(rawPosts?.map(p => p.category_id).filter(Boolean))];

    const [authorsRes, categoriesRes] = await Promise.all([
      authorIds.length ? supabase.from("profiles").select("id, display_name, avatar_url").in("id", authorIds) : Promise.resolve({ data: [] }),
      categoryIds.length ? supabase.from("blog_categories").select("id, title, slug").in("id", categoryIds) : Promise.resolve({ data: [] })
    ]);

    const authorMap = new Map((authorsRes.data || []).map((a: any) => [a.id, a]));
    const categoryMap = new Map((categoriesRes.data || []).map((c: any) => [c.id, c]));

    // Get tags for posts
    const postIds = rawPosts?.map(p => p.id) ?? [];
    const { data: tagData } = postIds.length 
      ? await supabase
          .from("blog_post_tags")
          .select("post_id, tag:blog_tags(slug, title)")
          .in("post_id", postIds)
      : { data: [] };

    const tagMap = new Map<string, any[]>();
    (tagData || []).forEach((t: any) => {
      if (!tagMap.has(t.post_id)) tagMap.set(t.post_id, []);
      tagMap.get(t.post_id)!.push(t.tag);
    });

    // Get likes count from blog_likes
    const { data: likesData } = postIds.length
      ? await supabase
          .from("blog_likes")
          .select("post_id")
          .in("post_id", postIds)
      : { data: [] };

    const likesCount = new Map<string, number>();
    (likesData || []).forEach((r: any) => {
      likesCount.set(r.post_id, (likesCount.get(r.post_id) || 0) + 1);
    });

    // Get comments count
    const { data: commentData } = postIds.length
      ? await supabase
          .from("blog_comments")
          .select("post_id")
          .in("post_id", postIds)
      : { data: [] };

    const commentsCount = new Map<string, number>();
    (commentData || []).forEach((c: any) => {
      commentsCount.set(c.post_id, (commentsCount.get(c.post_id) || 0) + 1);
    });

    const items: BlogListItem[] = (rawPosts || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.description ?? null,
      cover_image_url: p.cover_image_url ?? null,
      category: p.category_id ? categoryMap.get(p.category_id) ?? null : null,
      tags: tagMap.get(p.id) ?? [],
      author: (() => {
        const a = authorMap.get(p.author_id) as any;
        return a ? { id: p.author_id, name: a.display_name || "Unknown", avatar: a.avatar_url ?? null } : { id: p.author_id, name: "Unknown", avatar: null };
      })(),
      reading_minutes: null,
      published_at: p.created_at ?? null,
      is_featured: p.is_featured ?? false,
      counts: {
        likes: likesCount.get(p.id) ?? 0,
        comments: commentsCount.get(p.id) ?? 0,
        views: p.view_count ?? 0,
      },
    }));

    return {
      items,
      page,
      page_size: pageSize,
      total: count ?? 0,
    };
  }
}

export async function getBlog(slug: string): Promise<BlogDetailPayload> {
  // Primary path: direct Supabase query
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !post) throw new Error("Post not found");

  // Get current user for like status
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const [authorRes, categoryRes, tagsRes, aiSummaryRes, commentCountRes, likesCountRes, sharesCountRes, userLikeRes] = await Promise.all([
    supabase.from("profiles").select("id, display_name, avatar_url").eq("id", post.author_id).maybeSingle(),
    post.category_id ? supabase.from("blog_categories").select("id, title, slug").eq("id", post.category_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("blog_post_tags").select("tag:blog_tags(slug, title)").eq("post_id", post.id),
    supabase.from("blog_ai_summaries").select("summary_md").eq("post_id", post.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("blog_comments").select("id", { count: "exact", head: true }).eq("post_id", post.id),
    supabase.from("blog_likes").select("post_id", { count: "exact", head: true }).eq("post_id", post.id),
    supabase.from("blog_shares").select("id", { count: "exact", head: true }).eq("post_id", post.id),
    userId ? supabase.from("blog_likes").select("post_id").eq("post_id", post.id).eq("user_id", userId).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.description,
    content: post.content || "",
    cover_image_url: post.cover_image_url,
    category: categoryRes.data,
    tags: tagsRes.data?.map((t: any) => t.tag) || [],
    author: authorRes.data ? {
      id: post.author_id,
      name: authorRes.data.display_name || "Unknown",
      avatar: authorRes.data.avatar_url
    } : { id: post.author_id, name: "Unknown", avatar: null },
    reading_minutes: null,
    published_at: post.published_at || post.created_at,
    counts: {
      likes: likesCountRes.count || 0,
      comments: commentCountRes.count || 0,
      views: post.view_count || 0,
      shares: sharesCountRes.count || 0,
    },
    reactions: {},
    user_reaction: null,
    user_liked: !!userLikeRes.data,
    ai_summary: aiSummaryRes.data?.summary_md || null,
    comments: []
  };
}

export async function createDraft(body: {
  title: string;
  content_md?: string;
  category_id?: string;
  tag_slugs?: string[];
  cover_image_url?: string;
  excerpt?: string;
}) {
  try {
    const res = await fetch(`${BASE}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (error: any) {
    const message = getErrorMessage(error, "Failed to create draft");
    throw new Error(message);
  }
}

export async function updateDraft(id: string, body: {
  title?: string;
  content_md?: string;
  category_id?: string;
  tag_slugs?: string[];
  cover_image_url?: string;
}) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function submitPost(id: string) {
  try {
    const res = await fetch(`${BASE}/api/blogs/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (error: any) {
    const message = getErrorMessage(error, "Failed to submit post");
    throw new Error(message);
  }
}

export async function reviewPost(id: string, body: { note?: string; is_featured?: boolean }) {
  const res = await fetch(`${BASE}/api/blogs/${id}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function publishPost(id: string) {
  const res = await fetch(`${BASE}/api/blogs/${id}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Engagement: direct Supabase queries ───

export async function toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  // Check if already liked
  const { data: existing } = await supabase
    .from("blog_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("blog_likes").delete().eq("post_id", postId).eq("user_id", userId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("blog_likes").insert({ post_id: postId, user_id: userId });
    if (error) throw new Error(error.message);
  }

  // Return new count
  const { count } = await supabase.from("blog_likes").select("post_id", { count: "exact", head: true }).eq("post_id", postId);
  return { liked: !existing, count: count || 0 };
}

export async function addComment(postId: string, content: string, parentId?: string | null) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const row: any = { post_id: postId, user_id: userId, content };
  if (parentId) row.parent_id = parentId;

  const { data, error } = await supabase.from("blog_comments").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.from("blog_comments").delete().eq("id", commentId);
  if (error) throw new Error(error.message);
}

export async function reactToComment(commentId: string, reaction: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  // Check if already reacted
  const { data: existing } = await supabase
    .from("blog_comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .eq("reaction", reaction)
    .maybeSingle();

  if (existing) {
    await supabase.from("blog_comment_reactions").delete().eq("id", existing.id);
    return { toggled: false };
  } else {
    await supabase.from("blog_comment_reactions").insert({ comment_id: commentId, user_id: userId, reaction });
    return { toggled: true };
  }
}

export async function reactToCommentWithFeedback(commentId: string, reaction: string, feedback?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("blog_comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .eq("reaction", reaction)
    .maybeSingle();

  if (existing) {
    await supabase.from("blog_comment_reactions").delete().eq("id", existing.id);
    return { toggled: false };
  } else {
    const row: any = { comment_id: commentId, user_id: userId, reaction };
    if (feedback) row.feedback = feedback;
    await supabase.from("blog_comment_reactions").insert(row);
    return { toggled: true };
  }
}

export async function trackShare(postId: string, platform: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const { error } = await supabase.from("blog_shares").insert({
    post_id: postId,
    user_id: userId || null,
    platform,
  });
  if (error) throw new Error(error.message);
}

export async function submitFeedback(postId: string, message: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase.from("blog_post_feedback").insert({
    post_id: postId,
    user_id: userId,
    message,
  });
  if (error) throw new Error(error.message);
}

export interface CommentWithAuthor {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  author: { id: string; display_name: string; avatar_url: string | null } | null;
  reactions: { up: number; down: number };
  user_reaction: string | null;
}

export async function getComments(postId: string): Promise<CommentWithAuthor[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const { data: comments, error } = await supabase
    .from("blog_comments")
    .select("id, post_id, user_id, content, parent_id, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  if (!comments?.length) return [];

  // Fetch author profiles
  const authorIds = [...new Set(comments.map(c => c.user_id).filter(Boolean))];
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, display_name, avatar_url").in("id", authorIds)
    : { data: [] };
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

  // Fetch reaction counts per comment
  const commentIds = comments.map(c => c.id);
  const { data: reactions } = await supabase
    .from("blog_comment_reactions")
    .select("comment_id, reaction")
    .in("comment_id", commentIds);

  const reactionCounts = new Map<string, { up: number; down: number }>();
  (reactions || []).forEach((r: any) => {
    if (!reactionCounts.has(r.comment_id)) reactionCounts.set(r.comment_id, { up: 0, down: 0 });
    const counts = reactionCounts.get(r.comment_id)!;
    if (r.reaction === "up" || r.reaction === "thumbs_up") counts.up++;
    else if (r.reaction === "down" || r.reaction === "thumbs_down") counts.down++;
  });

  // Fetch user's own reactions
  let userReactions = new Map<string, string>();
  if (userId) {
    const { data: userReactionData } = await supabase
      .from("blog_comment_reactions")
      .select("comment_id, reaction")
      .in("comment_id", commentIds)
      .eq("user_id", userId);
    (userReactionData || []).forEach((r: any) => userReactions.set(r.comment_id, r.reaction));
  }

  return comments.map(c => {
    const profile = profileMap.get(c.user_id) as any;
    return {
      ...c,
      author: profile ? { id: profile.id, display_name: profile.display_name, avatar_url: profile.avatar_url } : null,
      reactions: reactionCounts.get(c.id) || { up: 0, down: 0 },
      user_reaction: userReactions.get(c.id) || null,
    };
  });
}

export async function refreshAISummary(id: string) {
  const res = await fetch(`${BASE}/api/blogs/${id}/ai-summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}