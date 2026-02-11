import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/core/auth/supabase';
import { useAuth } from '@/core/auth/AuthProvider';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Pin, Lock, MessageSquare, Loader2 } from 'lucide-react';

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
}

interface Reply {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author_name: string | null;
  author_avatar: string | null;
}

export default function ThreadDetail() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);
  const [voteScore, setVoteScore] = useState(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (threadId) load();
  }, [threadId]);

  async function load() {
    if (!threadId) return;
    setLoading(true);
    try {
      // Load thread
      const { data: threadData, error: threadErr } = await supabase
        .from('forum_threads').select('*').eq('id', threadId).single();
      if (threadErr) throw threadErr;
      setThread(threadData);

      // Load replies
      const { data: repliesData } = await supabase
        .from('forum_replies').select('*').eq('thread_id', threadId).order('created_at');

      // Load author profiles for thread + replies
      const allAuthorIds = [
        threadData.author_id,
        ...new Set((repliesData || []).map(r => r.author_id)),
      ];
      const { data: profiles } = await supabase
        .from('profiles').select('id, display_name, avatar_url').in('id', allAuthorIds);
      const profileMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
      (profiles || []).forEach(p => { profileMap[p.id] = p; });

      setAuthorName(profileMap[threadData.author_id]?.display_name || null);
      setAuthorAvatar(profileMap[threadData.author_id]?.avatar_url || null);

      const enrichedReplies: Reply[] = (repliesData || []).map(r => ({
        ...r,
        author_name: profileMap[r.author_id]?.display_name || null,
        author_avatar: profileMap[r.author_id]?.avatar_url || null,
      }));
      setReplies(enrichedReplies);

      // Load category name
      const { data: catData } = await supabase
        .from('forum_categories').select('title').eq('id', threadData.category_id).single();
      setCategoryName(catData?.title || '');

      // Load votes
      const { data: votes } = await supabase
        .from('forum_votes').select('vote_type, user_id').eq('thread_id', threadId);
      let score = 0;
      let myVote: 'up' | 'down' | null = null;
      (votes || []).forEach(v => {
        score += v.vote_type === 'up' ? 1 : -1;
        if (user && v.user_id === user.id) myVote = v.vote_type as 'up' | 'down';
      });
      setVoteScore(score);
      setUserVote(myVote);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(type: 'up' | 'down') {
    if (!user || !threadId) return;

    if (userVote === type) {
      // Remove vote
      await supabase.from('forum_votes').delete().eq('thread_id', threadId).eq('user_id', user.id);
      setVoteScore(prev => prev + (type === 'up' ? -1 : 1));
      setUserVote(null);
    } else {
      // Upsert vote
      const { error } = await supabase.from('forum_votes').upsert(
        { thread_id: threadId, user_id: user.id, vote_type: type },
        { onConflict: 'thread_id,user_id' }
      );
      if (error) {
        toast.error('Failed to vote');
        return;
      }
      const scoreDelta = userVote ? (type === 'up' ? 2 : -2) : (type === 'up' ? 1 : -1);
      setVoteScore(prev => prev + scoreDelta);
      setUserVote(type);
    }
  }

  async function submitReply() {
    if (!threadId || !user) return;
    if (replyText.trim().length < 10) {
      toast.error('Reply must be at least 10 characters');
      return;
    }

    setPosting(true);
    try {
      const { error } = await supabase.from('forum_replies').insert({
        thread_id: threadId,
        author_id: user.id,
        content: replyText.trim(),
      });
      if (error) throw error;
      toast.success('Reply posted');
      setReplyText('');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post reply');
    } finally {
      setPosting(false);
    }
  }

  function quoteReply(content: string) {
    const quoted = `> ${content.replace(/\n/g, '\n> ')}\n\n`;
    setReplyText(prev => (prev ? prev + '\n\n' : '') + quoted);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-muted-foreground">Thread not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/forum">Back to threads</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto space-y-4">
      {/* Thread */}
      <Card className="p-5">
        <div className="flex gap-4">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <button
              onClick={() => handleVote('up')}
              className={`p-1 rounded transition-colors ${userVote === 'up' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'}`}
            >
              <ArrowUp className="h-5 w-5" />
            </button>
            <span className={`text-sm font-bold ${voteScore > 0 ? 'text-primary' : voteScore < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {voteScore}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded transition-colors ${userVote === 'down' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-destructive'}`}
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {thread.pinned && <Pin className="h-4 w-4 text-accent" />}
              {thread.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
              <Badge variant="secondary" className="text-xs">{categoryName}</Badge>
            </div>
            <h1 className="text-xl font-bold font-[var(--font-display)] mb-2">{thread.title}</h1>
            <p className="whitespace-pre-wrap leading-relaxed text-sm">{thread.content}</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Avatar className="h-5 w-5">
                <AvatarImage src={authorAvatar || undefined} />
                <AvatarFallback className="text-[8px]">{(authorName || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{authorName || 'User'}</span>
              <span>
                {new Date(thread.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Replies */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {replies.length === 0 ? (
          <Card className="p-4 text-sm text-muted-foreground text-center">
            No replies yet. Be the first to respond!
          </Card>
        ) : (
          replies.map(r => (
            <Card key={r.id} className="p-4">
              <p className="text-sm whitespace-pre-wrap">{r.content}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={r.author_avatar || undefined} />
                    <AvatarFallback className="text-[8px]">{(r.author_name || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{r.author_name || 'User'}</span>
                  <span>{new Date(r.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => quoteReply(r.content)}>
                  Quote
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reply form */}
      {thread.locked ? (
        <Card className="p-4 text-sm text-muted-foreground text-center">
          This thread is locked. No new replies can be posted.
        </Card>
      ) : user ? (
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-semibold">Add a reply</h3>
          <Textarea
            ref={textareaRef}
            rows={4}
            placeholder="Write your reply (min 10 characters)..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button onClick={submitReply} disabled={posting || replyText.trim().length < 10}>
            {posting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Posting...</> : 'Post Reply'}
          </Button>
        </Card>
      ) : (
        <Card className="p-4 text-sm text-muted-foreground text-center">
          Sign in to post a reply.
        </Card>
      )}
    </div>
  );
}
