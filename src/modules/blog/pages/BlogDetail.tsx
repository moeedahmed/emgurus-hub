import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getBlog, toggleLike, trackShare } from "@/modules/blog/lib/blogsApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/core/auth/supabase';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { ThumbsUp, MessageCircle, Share2, ArrowLeft, Clock, Eye, Link2 } from "lucide-react";
import ShareButtons from "@/modules/blog/components/blogs/ShareButtons";
import CommentThread from "@/modules/blog/components/blogs/CommentThread";
import ReportIssueModal from "@/modules/blog/components/blogs/ReportIssueModal";
import BlogBreadcrumbs from "@/modules/blog/components/blogs/BlogBreadcrumbs";
import { getCategoryColor } from "@/modules/blog/lib/taxonomy";
import DOMPurify from "dompurify";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);
  const scrollRaf = useRef<number | null>(null);

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

  const contentSections = useMemo(() => {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 64);

    if (!sanitizedContent) return { intro: "", sections: [] as Array<{ id: string; title: string; level: 2 | 3; html: string }> };

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="blog-root">${sanitizedContent}</div>`, "text/html");
    const root = doc.getElementById("blog-root");
    if (!root) return { intro: sanitizedContent, sections: [] as Array<{ id: string; title: string; level: 2 | 3; html: string }> };

    const intro: string[] = [];
    const sections: Array<{ id: string; title: string; level: 2 | 3; html: string }> = [];
    let current: { id: string; title: string; level: 2 | 3; chunks: string[] } | null = null;
    let i = 0;

    for (const node of Array.from(root.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toUpperCase();
        if (tag === "H2" || tag === "H3") {
          if (current) sections.push({ id: current.id, title: current.title, level: current.level, html: current.chunks.join("") });
          const title = el.textContent?.trim() || `Section ${sections.length + 1}`;
          current = {
            id: `${slugify(title)}-${i++}`,
            title,
            level: tag === "H2" ? 2 : 3,
            chunks: [],
          };
          continue;
        }
      }

      const html = node.nodeType === Node.TEXT_NODE ? node.textContent || "" : (node as HTMLElement).outerHTML || "";
      if (current) current.chunks.push(html);
      else intro.push(html);
    }

    if (current) sections.push({ id: current.id, title: current.title, level: current.level, html: current.chunks.join("") });

    return { intro: intro.join(""), sections };
  }, [sanitizedContent]);

  const readTime = useMemo(() => {
    if (!data) return 1;
    const text = (data.content || data.content_html || data.content_md || "")
      .replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(text / 220));
  }, [data]);

  useEffect(() => {
    if (!contentSections.sections.length) {
      setOpenSections([]);
      setActiveSection("");
      return;
    }
    const first = contentSections.sections[0].id;
    setOpenSections([first]);
    setActiveSection(first);
  }, [contentSections.sections]);

  useEffect(() => {
    if (!contentSections.sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const nextId = visible[0].target.getAttribute("id") || "";
        if (nextId) setActiveSection(nextId);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    for (const section of contentSections.sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [contentSections.sections, openSections]);

  useEffect(() => {
    const onScroll = () => {
      if (scrollRaf.current != null) return;
      scrollRaf.current = window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        setReadingProgress(progress);
        scrollRaf.current = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf.current != null) window.cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

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

  const copySectionLink = async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Section link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  if (loading) return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-64 w-full rounded-xl mb-6" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2" />
    </main>
  );

  if (!data) return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Card className="p-8 text-center">
        <p className="text-lg font-medium mb-2">Article not found</p>
        <Button variant="outline" onClick={() => navigate('/blog')}>Back to Blog</Button>
      </Card>
    </main>
  );

  return (
    <main className="min-h-screen pb-20 lg:pb-8 overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${readingProgress}%` }} />
      </div>
      {/* Breadcrumbs / Back link */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pt-6">
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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-8">
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
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-8">
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

      {/* Article content — collapsible for better scanability */}
      <article className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl lg:max-w-5xl">
        <div className="rounded-2xl border border-border/60 bg-card/20 p-3 sm:p-5 lg:p-7 overflow-hidden">
          <style>{`
            .blog-content { font-family: inherit; line-height: 1.8; color: hsl(var(--foreground)); font-size: 0.95rem; overflow-wrap: break-word; word-break: break-word; }
            @media (min-width: 640px) { .blog-content { font-size: 1.025rem; line-height: 1.9; } }
            .blog-content h1 { font-size: 1.9rem; font-weight: 700; margin: 2.2rem 0 1rem; letter-spacing: -0.01em; font-family: inherit !important; }
            .blog-content h2 { font-size: 1.55rem; font-weight: 650; margin: 1.9rem 0 0.85rem; letter-spacing: -0.01em; color: hsl(var(--foreground)); font-family: inherit !important; }
            .blog-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1.65rem 0 0.6rem; color: hsl(var(--primary)); text-wrap: balance; font-family: inherit !important; }
            .blog-content p { margin-bottom: 1.1rem; font-family: inherit !important; }
            .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
            .blog-content li { margin-bottom: 0.5rem; }
            .blog-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; }
            .blog-content a { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 2px; }
            .blog-content a:hover { opacity: 0.8; }
            .blog-content blockquote { border-left: 3px solid hsl(var(--primary)); padding-left: 1rem; margin: 1.5rem 0; color: hsl(var(--muted-foreground)); font-style: italic; }
            .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; display: block; overflow-x: auto; }
            .blog-content th, .blog-content td { border: 1px solid hsl(var(--border)); padding: 0.5rem 0.75rem; text-align: left; }
            .blog-content th { background: hsl(var(--muted)); font-weight: 600; }
            .blog-content span { font-family: inherit !important; }
            .blog-content strong { font-weight: 600; }
            .blog-content hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 2rem 0; }
          `}</style>

          {contentSections.sections.length > 0 && (
            <div className="mb-4 space-y-3 lg:hidden">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground">On this page</p>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2"
                      onClick={() => setOpenSections(contentSections.sections.map((s) => s.id))}
                    >
                      Expand all
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2"
                      onClick={() => setOpenSections([])}
                    >
                      Collapse
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {contentSections.sections.map((s) => (
                    <Button
                      key={s.id}
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-7 shrink-0 px-2 text-xs border border-transparent",
                        s.level === 3 && "opacity-80",
                        activeSection === s.id && "border-primary/35 bg-primary/10 text-primary"
                      )}
                      onClick={() => {
                        setActiveSection(s.id);
                        setOpenSections((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]));
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      {s.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
            <div className="rounded-lg border border-border/60 bg-muted/15 p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-muted-foreground">Read time</div>
              <div className="text-sm sm:text-base font-semibold">{readTime} min</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/15 p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-muted-foreground">Sections</div>
              <div className="text-sm sm:text-base font-semibold">{Math.max(1, contentSections.sections.length)}</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/15 p-2 sm:p-3">
              <div className="text-[10px] sm:text-xs text-muted-foreground">Best for</div>
              <div className="text-sm sm:text-base font-semibold">Focused revision</div>
            </div>
          </div>

          <div className={cn(contentSections.sections.length > 0 && "lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-5")}>
            <div className="min-w-0">
              {contentSections.intro && (
                <div className="blog-content mb-4" dangerouslySetInnerHTML={{ __html: contentSections.intro }} />
              )}

              {contentSections.sections.length > 0 ? (
                <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="space-y-0 border-l-2 border-border/60 ml-1">
                  {contentSections.sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id} id={section.id} className="border-b-0 border-none">
                      <div className={cn(
                        "flex items-center gap-1 -ml-[2px] border-l-2 transition-colors",
                        activeSection === section.id ? "border-primary" : "border-transparent"
                      )}>
                        <AccordionTrigger className="text-left py-2 sm:py-2.5 pl-3 sm:pl-4 hover:no-underline flex-1 min-w-0">
                          <span
                            className={cn(
                              "tracking-tight text-foreground/90 break-words",
                              section.level === 2 && "text-[0.95rem] sm:text-[1.05rem] font-semibold",
                              section.level === 3 && "text-[0.88rem] sm:text-[0.95rem] font-medium text-primary/80 pl-2 sm:pl-3"
                            )}
                          >
                            {section.title}
                          </span>
                        </AccordionTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground/50 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            copySectionLink(section.id);
                          }}
                          aria-label={`Copy link to ${section.title}`}
                        >
                          <Link2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <AccordionContent>
                        <div className="blog-content pl-3 sm:pl-4 pb-3" dangerouslySetInnerHTML={{ __html: section.html }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
              )}
            </div>

            {contentSections.sections.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-20 rounded-xl border border-border/60 bg-muted/15 p-3">
                  <p className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground mb-2">On this page</p>
                  <div className="space-y-1.5">
                    {contentSections.sections.map((s) => (
                      <button
                        key={`desktop-${s.id}`}
                        onClick={() => {
                          setActiveSection(s.id);
                          setOpenSections((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]));
                          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={cn(
                          "w-full rounded-md px-2.5 py-2 text-left text-xs transition-colors",
                          s.level === 3 && "pl-5",
                          activeSection === s.id ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {/* Action bar */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-10">
        <div className="flex items-center justify-between py-4 border-t border-b gap-2 overflow-hidden">
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              className={`gap-1.5 hover:text-primary px-2 sm:px-3 ${userLiked ? "text-primary" : ""}`}
            >
              <ThumbsUp className={`h-4 w-4 ${userLiked ? "fill-current" : ""}`} />
              {engagementCounts.likes > 0 ? engagementCounts.likes : "Like"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
              className="gap-1.5 px-2 sm:px-3"
            >
              <MessageCircle className="h-4 w-4" />
              {engagementCounts.comments > 0 ? engagementCounts.comments : "Comment"}
            </Button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
              variant="dropdown"
              size="sm"
              buttonVariant="ghost"
            />
            <ReportIssueModal postId={data.id} postTitle={data.title} />
          </div>
        </div>
      </div>

      {/* Author card — clean, no fake bio */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-8">
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
      <section className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-10" id="comments">
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
        <div className="w-full mx-auto px-4 py-2 flex items-center justify-between">
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
