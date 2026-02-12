import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import AuthorChip from "@/modules/blog/components/blogs/AuthorChip";
import { Eye, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryColor } from "@/modules/blog/lib/taxonomy";

interface EngagementCounts {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  feedback?: number;
}

interface Author {
  id: string;
  name: string;
  avatar?: string | null;
}

interface Category {
  title?: string | null;
}

interface Tag {
  slug?: string;
  title?: string;
}

interface BlogBaseCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  category?: Category | null;
  tags?: Tag[];
  author?: Author;
  published_at?: string | null;
  counts?: EngagementCounts;
  topBadge?: string;
  isFeatured?: boolean;
  isHero?: boolean;
  className?: string;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function BlogBaseCard({
  id,
  title,
  slug,
  excerpt,
  cover_image_url,
  category,
  tags,
  author,
  published_at,
  counts,
  topBadge,
  isFeatured = false,
  isHero = false,
  className,
  onTagClick,
  onCategoryClick
}: BlogBaseCardProps) {
  const date = published_at ? new Date(published_at).toLocaleDateString() : "";

  const badges = [];
  if (isFeatured) badges.push({ label: "Featured", variant: "default" as const });
  if (topBadge) badges.push({ label: topBadge, variant: "secondary" as const });

  // Only show engagement stats that have non-zero values
  const hasEngagement = counts && (
    (counts.views && counts.views > 0) ||
    (counts.likes && counts.likes > 0) ||
    (counts.comments && counts.comments > 0)
  );

  // Hide "Imported" category from display
  const displayCategory = category?.title && !/^imported$/i.test(category.title) ? category.title : null;

  // Hero layout for featured single posts
  if (isHero) {
    return (
      <Card className={cn(
        "relative overflow-hidden rounded-2xl border group hover-scale motion-safe:transition-all motion-safe:duration-200",
        className
      )}>
        <img
          src={cover_image_url || "/placeholder.svg"}
          alt={`${title} cover image`}
          className="w-full h-[260px] sm:h-[360px] lg:h-[420px] object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8 text-foreground">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant} className="text-xs">
                {badge.label}
              </Badge>
            ))}
            {displayCategory && (
              <Chip
                name={displayCategory}
                value={displayCategory}
                selected={false}
                onSelect={() => onCategoryClick?.(displayCategory)}
                variant="outline"
                size="sm"
              >
                {displayCategory}
              </Chip>
            )}
            {date && <span className="text-xs text-muted-foreground">{date}</span>}
          </div>
          <Link to={`/blog/${slug}`}>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold max-w-3xl mb-2 group-hover:text-primary motion-safe:transition-colors">
              {title}
            </h3>
          </Link>
          {excerpt && (
            <p className="mt-2 max-w-2xl line-clamp-2 text-sm sm:text-base text-muted-foreground">
              {excerpt}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            {author && (
              <AuthorChip id={author.id} name={author.name} avatar={author.avatar || null} />
            )}
            <Button asChild size="sm" variant="secondary" className="ml-auto">
              <Link to={`/blog/${slug}`}>Read Article</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Regular card layout
  return (
    <Link to={`/blog/${slug}`} className="block">
      <Card className={cn(
        "overflow-hidden group hover:shadow-lg motion-safe:transition-all motion-safe:duration-200 h-full flex flex-col",
        className
      )}>
      {/* Cover image */}
      <div className="relative">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={`${title} cover image`}
            className="w-full h-44 object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />
        ) : (
          <div className="w-full h-28 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
            <span className="text-3xl opacity-30">📝</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant} className="text-xs">
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        {/* Category and Date */}
        <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-muted-foreground">
          {displayCategory && (
            <span className={cn("font-medium", getCategoryColor(displayCategory))}>{displayCategory}</span>
          )}
          {displayCategory && date && <span>·</span>}
          {date && <span>{date}</span>}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-lg leading-snug mb-2.5 line-clamp-2 group-hover:text-primary motion-safe:transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-4 flex-1">
            {excerpt}
          </p>
        )}

        {/* Author */}
        {author && (
          <div className="mb-2 mt-auto">
            <AuthorChip
              id={author.id}
              name={author.name}
              avatar={author.avatar || null}
            />
          </div>
        )}
        
        {/* Engagement — only show if any non-zero values */}
        {hasEngagement && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t">
            {counts!.views! > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{counts!.views}</span>
              </div>
            )}
            {counts!.likes! > 0 && (
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{counts!.likes}</span>
              </div>
            )}
            {counts!.comments! > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{counts!.comments}</span>
              </div>
            )}
            {counts!.shares! > 0 && (
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>{counts!.shares}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
    </Link>
  );
}
