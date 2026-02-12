import { useEffect, useMemo, useState } from "react";
import { listBlogs } from "@/modules/blog/lib/blogsApi";
import TopAuthorsPanel from "@/modules/blog/components/blogs/TopAuthorsPanel";

interface AuthorStat {
  id: string;
  name: string;
  avatar?: string | null;
  posts: number;
  views: number;
  likes: number;
  online?: boolean;
}

export default function BlogSidebarTopAuthors() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    const CACHE_KEY = "blog-sidebar-top-authors-cache";
    const CACHE_TTL_MS = 10 * 60 * 1000;

    const load = async () => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { ts: number; items: any[] };
          if (Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.items)) {
            if (!cancelled) setItems(parsed.items);
            return;
          }
        }
      } catch {
        // ignore cache errors
      }

      try {
        const res = await listBlogs({ status: "published", page: 1, page_size: 24, sort: "newest" });
        const nextItems = res.items || [];
        if (!cancelled) setItems(nextItems);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items: nextItems }));
        } catch {
          // ignore cache write errors
        }
      } catch {
        if (!cancelled) setItems([]);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const topAuthors = useMemo<AuthorStat[]>(() => {
    const stats = new Map<string, { id: string; name: string; avatar: string | null; posts: number; views: number; likes: number; lastDate: number }>();

    for (const it of items) {
      const id = it.author?.id;
      if (!id) continue;

      const s = stats.get(id) || {
        id,
        name: it.author.name,
        avatar: it.author.avatar || null,
        posts: 0,
        views: 0,
        likes: 0,
        lastDate: 0,
      };

      s.posts += 1;
      s.views += it.counts?.views || 0;
      s.likes += it.counts?.likes || 0;

      const d = new Date(it.published_at || it.created_at || 0).getTime();
      if (d > s.lastDate) s.lastDate = d;

      stats.set(id, s);
    }

    const now = Date.now();

    return Array.from(stats.values())
      .map((s) => ({
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        posts: s.posts,
        views: s.views,
        likes: s.likes,
        online: now - s.lastDate < 7 * 24 * 60 * 60 * 1000,
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
  }, [items]);

  return <TopAuthorsPanel authors={topAuthors} variant="sidebar" />;
}
