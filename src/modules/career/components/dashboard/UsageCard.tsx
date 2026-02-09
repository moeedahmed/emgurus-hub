import { Link } from 'react-router-dom';
import { Map, MessageSquare, FileText, Mic, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsage, UsageLimits } from '@/modules/career/hooks/useUsage';
import { Skeleton } from '@/components/ui/skeleton';

interface UsageItemProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  remaining: number;
}

function UsageItem({ icon, label, used, limit, remaining }: UsageItemProps) {
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  const isUnlimited = limit >= 999999;
  
  // Color based on remaining percentage
  const getColor = () => {
    if (isUnlimited) return 'bg-success';
    const remainingPct = (remaining / limit) * 100;
    if (remainingPct <= 20) return 'bg-destructive';
    if (remainingPct <= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-medium">
          {isUnlimited ? (
            <span className="text-success">Unlimited</span>
          ) : (
            `${used} / ${limit}`
          )}
        </span>
      </div>
      <Progress 
        value={isUnlimited ? 5 : percentage} 
        className="h-1.5" 
        indicatorClassName={getColor()}
      />
    </div>
  );
}

const tierLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  free: { label: 'Free', variant: 'outline' },
  basic: { label: 'Basic', variant: 'secondary' },
  plus: { label: 'Plus', variant: 'secondary' },
  pro: { label: 'Pro', variant: 'default' },
};

export function UsageCard() {
  const { data: usage, isLoading, error } = useUsage();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-1.5 w-full" />
            </div>
          ))}
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
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Usage</h3>
        <div className="flex items-center gap-2">
          <Badge variant={tierConfig.variant}>{tierConfig.label}</Badge>
          {usage.daysRemaining > 0 && usage.tier !== 'free' && (
            <span className="text-xs text-muted-foreground">
              {usage.daysRemaining}d left
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <UsageItem
          icon={<Map className="w-3.5 h-3.5" />}
          label="Roadmaps"
          used={usage.roadmaps.used}
          limit={usage.roadmaps.limit}
          remaining={usage.roadmaps.remaining}
        />
        <UsageItem
          icon={<MessageSquare className="w-3.5 h-3.5" />}
          label="AI Messages"
          used={usage.ai_messages.used}
          limit={usage.ai_messages.limit}
          remaining={usage.ai_messages.remaining}
        />
        <UsageItem
          icon={<FileText className="w-3.5 h-3.5" />}
          label="Documents"
          used={usage.documents.used}
          limit={usage.documents.limit}
          remaining={usage.documents.remaining}
        />
        <UsageItem
          icon={<Mic className="w-3.5 h-3.5" />}
          label="Voice"
          used={usage.voice.used}
          limit={usage.voice.limit}
          remaining={usage.voice.remaining}
        />
      </div>

      {showUpgrade && (
        <Button asChild variant="outline" size="sm" className="w-full mt-4">
          <Link to="/pricing">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Upgrade for more
          </Link>
        </Button>
      )}
    </div>
  );
}
