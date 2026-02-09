import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePublicRoadmap } from '@/modules/career/hooks/useRoadmap';
import { RoadmapStepCard } from '@/modules/career/components/roadmap/RoadmapStepCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const getTimeframeColor = (timeframe: string | null): string => {
  switch (timeframe) {
    case '30d':
      return 'success';
    case '6mo':
      return 'primary';
    case '12mo':
      return 'accent';
    case '18mo+':
      return 'warning';
    default:
      return 'muted';
  }
};

export function SharedRoadmapPage() {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = usePublicRoadmap(token || '');
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  // Set page title and Open Graph meta tags
  useEffect(() => {
    if (data?.roadmap) {
      const { title, nodes } = data.roadmap;
      const stepCount = nodes.length;

      // Set page title
      document.title = `${title} | Career Guru`;

      // Set or update meta tags
      const setMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      const setNameTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Open Graph tags
      setMetaTag('og:title', title);
      setMetaTag('og:description', `A ${stepCount}-step roadmap to achieve this career goal`);
      setMetaTag('og:type', 'article');
      setMetaTag('og:url', window.location.href);

      // Twitter Card tags
      setNameTag('twitter:card', 'summary_large_image');
      setNameTag('twitter:title', title);
      setNameTag('twitter:description', `A ${stepCount}-step roadmap to achieve this career goal`);
    }

    return () => {
      document.title = 'Career Guru';
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Skeleton */}
          <div className="text-center space-y-4 mb-12">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Steps Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-display text-3xl font-semibold mb-4">
            Roadmap not found
          </h1>
          <p className="text-muted-foreground mb-8">
            This roadmap could not be found or is no longer public.
          </p>
          <Button asChild size="lg">
            <Link to="/login">
              Create your own roadmap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { roadmap, creatorDisplayName } = data;
  const stepCount = roadmap.nodes.length;
  const completedCount = roadmap.nodes.filter((n) => n.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-3xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                {roadmap.title}
              </h1>
              {roadmap.pathway && (
                <p className="text-lg md:text-xl text-muted-foreground">
                  {roadmap.pathway}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {creatorDisplayName && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Created by {creatorDisplayName}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>
                  {stepCount} step{stepCount !== 1 ? 's' : ''}
                  {completedCount > 0 && ` • ${completedCount} completed`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(roadmap.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-3">
          {roadmap.nodes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">This roadmap has no steps yet.</p>
            </div>
          ) : (
            roadmap.nodes.map((node, idx) => (
              <RoadmapStepCard
                key={node.id}
                node={node}
                index={idx + 1}
                isExpanded={expandedNode === node.id}
                onToggleExpand={() =>
                  setExpandedNode(expandedNode === node.id ? null : node.id)
                }
                onStatusToggle={() => { }} // No-op for public view
                isUpdating={false}
                getTimeframeColor={getTimeframeColor}
                isEditMode={false} // Read-only mode
              />
            ))
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t bg-gradient-to-b from-background to-primary/5">
        <div className="container max-w-2xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Create your own personalized career roadmap
            </h2>
            <p className="text-lg text-muted-foreground">
              Join professionals mapping their path to success. Get AI-powered guidance tailored to your unique career goals.
            </p>
            <Button size="lg" className="h-12 px-8" asChild>
              <Link to="/login">
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center">
            Roadmap content generated by AI. Always verify critical information and consult qualified professionals for personalized advice.{' '}
            <Link to="/" className="text-primary hover:underline">
              Learn more about Career Guru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
