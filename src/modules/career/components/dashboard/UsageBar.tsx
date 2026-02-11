import { Link } from 'react-router-dom';
import { Map, MessageSquare, FileText, Mic, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsage } from '@/modules/career/hooks/useUsage';
import { Skeleton } from '@/components/ui/skeleton';

const tierLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  free: { label: 'Free', variant: 'outline' },
  basic: { label: 'Basic', variant: 'secondary' },
  plus: { label: 'Plus', variant: 'secondary' },
  pro: { label: 'Pro', variant: 'default' },
  admin: { label: 'Admin', variant: 'default' },
};

interface UsageMetricProps {
  icon: React.ReactNode;
  used: number;
  limit: number;
}

function UsageMetric({ icon, used, limit }: UsageMetricProps) {
  const isUnlimited = limit >= 999999;
  const remaining = limit - used;
  const isLow = !isUnlimited && remaining <= Math.ceil(limit * 0.2);

  return (
    <div className={`flex items-center gap-1.5 text-sm ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
      {icon}
      <span className="font-medium">
        {isUnlimited ? '∞' : `${used}/${limit}`}
      </span>
    </div>
  );
}

export function UsageBar() {
  const { data: usage, isLoading, error } = useUsage();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 md:p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return null;
  }

  const tierConfig = tierLabels[usage.tier] || tierLabels.free;
  const showUpgrade = usage.tier === 'free' && (
    usage.roadmaps.remaining <= 1 ||
    usage.ai_messages.remaining <= 10 ||
    usage.documents.remaining <= 1 ||
    usage.voice.remaining <= 2
  );

  return (
    <div className="bg-card border border-border rounded-lg p-3 md:p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Tier Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Usage:</span>
          <Badge variant={tierConfig.variant}>{tierConfig.label}</Badge>
          {usage.daysRemaining > 0 && usage.tier !== 'free' && (
            <span className="text-xs text-muted-foreground">
              {usage.daysRemaining}d left
            </span>
          )}
        </div>

        {/* Usage Metrics */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
          <UsageMetric
            icon={<Map className="w-3.5 h-3.5" />}
            used={usage.roadmaps.used}
            limit={usage.roadmaps.limit}
          />
          <UsageMetric
            icon={<MessageSquare className="w-3.5 h-3.5" />}
            used={usage.ai_messages.used}
            limit={usage.ai_messages.limit}
          />
          <UsageMetric
            icon={<FileText className="w-3.5 h-3.5" />}
            used={usage.documents.used}
            limit={usage.documents.limit}
          />
          <UsageMetric
            icon={<Mic className="w-3.5 h-3.5" />}
            used={usage.voice.used}
            limit={usage.voice.limit}
          />
        </div>

        {/* Upgrade Button */}
        {showUpgrade && (
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link to="/pricing">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
