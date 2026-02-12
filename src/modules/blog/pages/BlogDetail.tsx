import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBlog, toggleLike, trackShare } from "@/modules/blog/lib/blogsApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/core/auth/supabase';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { ThumbsUp, MessageCircle, Share2, ArrowLeft, Clock, Eye } from "lucide-react";
import ShareButtons from "@/modules/blog/components/blogs/ShareButtons";
import CommentThread from "@/modules/blog/components/blogs/CommentThread";
import ReportIssueModal from "@/modules/blog/components/blogs/ReportIssueModal";
import BlogBreadcrumbs from "@/modules/blog/components/blogs/BlogBreadcrumbs";
import { getCategoryColor } from "@/modules/blog/lib/taxonomy";
import DOMPurify from "dompurify";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorProfile, setAuthorProfile] = useState<any | null>(null);
  const [engagementCounts, setEngagementCounts] = useState({
    views: 0, likes: 0, comments: 0, shares: 0
  });
  const [userLiked, setUserLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getBlog(slug!);
        setData(res);
        if (res.counts) {
          setEngagementCounts({
            views: res.counts.views || 0,
            likes: res.counts.likes || 0,
            comments: res.counts.comments || 0,
            shares: res.counts.shares || 0,
          });
        }
        setUserLiked(!!res.user_liked);
        // SEO
        document.title = `${res.title} | EMGurus`;
        const meta = document.querySelector("meta[name='description']");
        if (meta) meta.setAttribute("content", res.excerpt || res.title);
      } catch (e: any) {
        toast.error(e.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!data?.author?.id) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, bio, specialty')
        .eq('id', data.author.id)
        .maybeSingle();
      setAuthorProfile(profile || null);
    };
    fetchProfile();
  }, [data]);

  const sanitizedContent = useMemo(() => {
    if (!data) return "";
    const raw = data.content_html || data.content || data.content_md || "";
    return DOMPurify.sanitize(raw);
  }, [data]);

  const readTime = useMemo(() => {
    if (!data) return 1;
    const text = (data.content || data.content_html || data.content_md || "")
      .replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(text / 220));
  }, [data]);

  const handleLike = async () => {
    if (!user?.id) { toast.error("Please log in to like this post"); return; }
    if (liking) return;
    setLiking(true);
    // Optimistic update
    const wasLiked = userLiked;
    setUserLiked(!wasLiked);
    setEngagementCounts(prev => ({ ...prev, likes: prev.likes + (wasLiked ? -1 : 1) }));
    try {
      const result = await toggleLike(data.id);
      setUserLiked(result.liked);
      setEngagementCounts(prev => ({ ...prev, likes: result.count }));
    } catch {
      // Revert on error
      setUserLiked(wasLiked);
      setEngagementCounts(prev => ({ ...prev, likes: prev.likes + (wasLiked ? 1 : -1) }));
      toast.error("Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  const hasEngagement = engagementCounts.views > 0 || engagementCounts.likes > 0 || engagementCounts.comments > 0;
  const authorName = authorProfile?.display_name || data?.author?.name || "Unknown";
  const authorAvatar = authorProfile?.avatar_url || data?.author?.avatar;
  const displayCategory = data?.category?.title && !/^imported$/i.test(data.category.title) ? data.category.title : null;

  if (loading) return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-64 w-full rounded-xl mb-6" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2" />
    </main>
  );

  if (!data) return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Card className="p-8 text-center">
        <p className="text-lg font-medium mb-2">Article not found</p>
        <Button variant="outline" onClick={() => navigate('/blog')}>Back to Blog</Button>
      </Card>
    </main>
  );

  return (
    <main className="min-h-screen pb-20 lg:pb-8">
      {/* Breadcrumbs / Back link */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pt-6">
        {data.breadcrumb_path?.length ? (
          <BlogBreadcrumbs
            breadcrumbPath={data.breadcrumb_path}
            currentTitle={data.title}
            parentSlug={data.parent_slug}
          />
        ) : (
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </button>
        )}
      </div>

      {/* Cover image */}
      {data.cover_image_url && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-8">
          <img
            src={data.cover_image_url}
            alt={data.title}
            className="w-full h-auto max-h-[400px] object-cover rounded-xl"
            loading="eager"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Article header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-8">
        {/* Category badge */}
        {displayCategory && (
          <button
            onClick={() => navigate(`/blog?category=${encodeURIComponent(displayCategory)}`)}
            className={`text-xs font-medium hover:underline mb-3 block ${getCategoryColor(displayCategory)}`}
          >
            {displayCategory}
          </button>
        )}

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
          {data.title}
        </h1>

        {/* Author + meta row */}
        <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
          <Link
            to={`/profile/${data.author?.id}`}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-foreground">{authorName}</span>
          </Link>
          <span>·</span>
          <span>{data.published_at ? new Date(data.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ""}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime} min read
          </span>
          {hasEngagement && (
            <>
              <span>·</span>
              {engagementCounts.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {engagementCounts.views}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Article content — continuous prose, no accordions */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <style>{`
          .blog-content { font-family: inherit; line-height: 1.8; color: hsl(var(--foreground)); }
          .blog-content h1 { font-size: 1.75rem; font-weight: 700; margin: 2rem 0 1rem; font-family: inherit !important; }
          .blog-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1.75rem 0 0.75rem; font-family: inherit !important; }
          .blog-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: hsl(var(--primary)); font-family: inherit !important; }
          .blog-content p { margin-bottom: 1rem; font-family: inherit !important; }
          .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
          .blog-content li { margin-bottom: 0.5rem; }
          .blog-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; }
          .blog-content a { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 2px; }
          .blog-content a:hover { opacity: 0.8; }
          .blog-content blockquote { border-left: 3px solid hsl(var(--primary)); padding-left: 1rem; margin: 1.5rem 0; color: hsl(var(--muted-foreground)); font-style: italic; }
          .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
          .blog-content th, .blog-content td { border: 1px solid hsl(var(--border)); padding: 0.5rem 0.75rem; text-align: left; }
          .blog-content th { background: hsl(var(--muted)); font-weight: 600; }
          .blog-content span { font-family: inherit !important; }
          .blog-content strong { font-weight: 600; }
          .blog-content hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 2rem 0; }
        `}</style>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>

      {/* Action bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-10">
        <div className="flex items-center justify-between py-4 border-t border-b">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className={`gap-1.5 hover:text-primary ${userLiked ? "text-primary" : ""}`}
            >
              <ThumbsUp className={`h-4 w-4 ${userLiked ? "fill-current" : ""}`} />
              {engagementCounts.likes > 0 ? engagementCounts.likes : "Like"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
              className="gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              {engagementCounts.comments > 0 ? engagementCounts.comments : "Comment"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <ShareButtons
              title={data.title}
              url={window.location.href}
              text={data.excerpt || "Check out this blog post on EMGurus"}
              postId={data.id}
              shareCount={engagementCounts.shares}
              onShare={async (platform: string) => {
                setEngagementCounts(prev => ({ ...prev, shares: prev.shares + 1 }));
                try { await trackShare(data.id, platform); } catch {}
              }}
              variant="inline"
            />
            <ReportIssueModal postId={data.id} postTitle={data.title} />
          </div>
        </div>
      </div>

      {/* Author card — clean, no fake bio */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-8">
        <Link
          to={`/profile/${data.author?.id}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold">{authorName}</p>
            {authorProfile?.specialty && (
              <p className="text-sm text-muted-foreground">{authorProfile.specialty}</p>
            )}
          </div>
        </Link>
      </div>

      {/* Comments */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-10" id="comments">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentThread
          postId={data.id}
          comments={data.comments || []}
          onCommentsChange={(comments) => {
            setData((d: any) => ({ ...d, comments }));
            setEngagementCounts(prev => ({ ...prev, comments: comments.length }));
          }}
        />
      </section>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={handleLike} className={`gap-1 ${userLiked ? "text-primary" : ""}`}>
              <ThumbsUp className={`h-4 w-4 ${userLiked ? "fill-current" : ""}`} />
              {engagementCounts.likes > 0 && engagementCounts.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
              className="gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              {engagementCounts.comments > 0 && engagementCounts.comments}
            </Button>
          </div>
          <ShareButtons title={data.title} url={window.location.href} text={data.excerpt || ""} size="sm" />
        </div>
      </div>
    </main>
  );
}
