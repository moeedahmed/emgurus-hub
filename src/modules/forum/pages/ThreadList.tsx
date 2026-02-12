import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/core/auth/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Pin, Lock, ArrowUp, ArrowDown } from 'lucide-react';
import PageHero from '@/core/components/PageHero';
import { EmptyState } from '@/core/components/EmptyState';

interface Category { id: string; title: string; description: string | null }
interface Thread {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  content: string;
  pinned: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
  reply_count: number;
  vote_score: number;
  author_name: string | null;
  author_avatar: string | null;
}

export default function ThreadList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [catRes, threadRes] = await Promise.all([
        supabase.from('forum_categories').select('*').order('title'),
        supabase.from('forum_threads').select('*').order('pinned', { ascending: false }).order('updated_at', { ascending: false }),
      ]);

      setCategories(catRes.data || []);
      const rawThreads = threadRes.data || [];

      // Batch fetch reply counts, vote scores, and author profiles
      const threadIds = rawThreads.map(t => t.id);
      const authorIds = [...new Set(rawThreads.map(t => t.author_id))];

      const [repliesRes, votesRes, profilesRes] = await Promise.all([
        threadIds.length > 0
          ? supabase.from('forum_replies').select('thread_id').in('thread_id', threadIds)
          : { data: [] },
        threadIds.length > 0
          ? supabase.from('forum_votes').select('thread_id, vote_type').in('thread_id', threadIds)
          : { data: [] },
        authorIds.length > 0
          ? supabase.from('profiles').select('id, display_name, avatar_url').in('id', authorIds)
          : { data: [] },
      ]);

      const replyCounts: Record<string, number> = {};
      (repliesRes.data || []).forEach(r => {
        replyCounts[r.thread_id] = (replyCounts[r.thread_id] || 0) + 1;
      });

      const voteScores: Record<string, number> = {};
      (votesRes.data || []).forEach(v => {
        voteScores[v.thread_id] = (voteScores[v.thread_id] || 0) + (v.vote_type === 'up' ? 1 : -1);
      });

      const profileMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
      (profilesRes.data || []).forEach(p => {
        profileMap[p.id] = p;
      });

      const enriched: Thread[] = rawThreads.map(t => ({
        ...t,
        reply_count: replyCounts[t.id] || 0,
        vote_score: voteScores[t.id] || 0,
        author_name: profileMap[t.author_id]?.display_name || null,
        author_avatar: profileMap[t.author_id]?.avatar_url || null,
      }));

      setThreads(enriched);
    } catch (err) {
      console.error('Failed to load forum data:', err);
    } finally {
      setLoading(false);
    }
  }

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(c => [c.id, c.title])),
    [categories]
  );

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();
    return threads.filter(t =>
      (!categoryFilter || t.category_id === categoryFilter) &&
      (!search || t.title.toLowerCase().includes(search) || t.content.toLowerCase().includes(search))
    );
  }, [threads, q, categoryFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 sm:px-6 pt-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="heading-xl">Forum</h1>
          <Link to="/forum/new" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">New Thread</Link>
        </div>
        <p className="text-muted-foreground">Discuss cases, share tips, and connect with peers.</p>
      </div>
    <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search threads..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1"
        />
        <Select
          value={categoryFilter || '__all__'}
          onValueChange={(v) => setCategoryFilter(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Thread list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No threads yet"
          description="Be the first to start a discussion!"
          actionLabel="New Thread"
          actionHref="/forum/new"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <Link key={t.id} to={`/forum/thread/${t.id}`} className="block group">
              <Card className="p-4 transition hover:border-primary/30 hover:shadow-sm">
                <div className="flex gap-3">
                  {/* Vote score */}
                  <div className="flex flex-col items-center justify-start pt-0.5 shrink-0 w-10">
                    <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className={`text-sm font-semibold ${t.vote_score > 0 ? 'text-primary' : t.vote_score < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {t.vote_score}
                    </span>
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.pinned && <Pin className="h-3.5 w-3.5 text-accent shrink-0" />}
                      {t.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {t.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5 break-words">{t.content}</p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {categoryMap[t.category_id] || 'General'}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={t.author_avatar || undefined} />
                          <AvatarFallback className="text-[8px]">
                            {(t.author_name || 'U').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{t.author_name || 'User'}</span>
                      </div>
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{t.reply_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
