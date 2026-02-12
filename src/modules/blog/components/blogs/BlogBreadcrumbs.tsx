import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BlogBreadcrumbsProps {
  breadcrumbPath: string[];
  currentTitle: string;
  parentSlug?: string | null;
}

/**
 * Renders a clickable breadcrumb trail for blog posts based on the 
 * original Google Sites hierarchy.
 * 
 * e.g., Blog > Career Pathways > UK Pathway > Entry Routes > Clinical Attachment
 */
export default function BlogBreadcrumbs({ breadcrumbPath, currentTitle }: BlogBreadcrumbsProps) {
  if (!breadcrumbPath?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap mb-4">
      <Link
        to="/blog"
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Blog</span>
      </Link>

      {breadcrumbPath.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <Link
            to={`/blog?section=${encodeURIComponent(crumb)}`}
            className="hover:text-foreground transition-colors"
          >
            {crumb}
          </Link>
        </span>
      ))}

      <span className="flex items-center gap-1">
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px]" title={currentTitle}>
          {currentTitle}
        </span>
      </span>
    </nav>
  );
}
