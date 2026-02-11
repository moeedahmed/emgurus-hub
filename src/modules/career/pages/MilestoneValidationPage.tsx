import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Check, Filter, RefreshCw, Download, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { PageShell } from '@/modules/career/components/layout/PageShell';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/modules/career/hooks/useAdmin';
import { useMilestoneResearchQueue, ResearchQueueFilters } from '@/modules/career/hooks/useMilestoneResearchQueue';
import { ResearchResultCard } from '@/modules/career/components/admin/ResearchResultCard';
import { getConfidenceBadgeColor } from '@/modules/career/utils/milestoneFormatters';

const MilestoneValidationPage = () => {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const [filters, setFilters] = useState<ResearchQueueFilters>({
    status: 'pending',
  });

  const {
    items,
    stats,
    isLoading,
    refetch,
    approve,
    reject,
    editAndApprove,
    batchApprove,
    isApproving,
    isRejecting,
    isEditing,
    isBatchApproving,
  } = useMilestoneResearchQueue(filters);

  // Redirect non-admins
  if (!isAdminLoading && !isAdmin) {
    return <Navigate to="/career" replace />;
  }

  const handleExportSQL = () => {
    const approvedItems = items.filter(
      (item) => item.status === 'approved' || item.status === 'edited'
    );

    if (approvedItems.length === 0) {
      return;
    }

    const sql = approvedItems
      .map(
        (item) => `-- ${item.milestone_name} (${item.pathway_code})
UPDATE public.milestones
SET
    estimated_duration = ${item.estimated_duration ? `'${item.estimated_duration}'` : 'NULL'},
    cost_estimate = ${item.cost_estimate ? `'${JSON.stringify(item.cost_estimate)}'::jsonb` : 'NULL'},
    verification_status = 'ai_validated',
    last_verified_at = NOW()
WHERE id = '${item.milestone_id}';`
      )
      .join('\n\n');

    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milestone_updates_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <PageShell width="wide">
        <PageHeader
          title="Milestone Validation"
          description="Review and approve AI-researched milestone data"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">{stats.highConfidence}</div>
              <p className="text-xs text-muted-foreground">High Confidence</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.mediumConfidence}</div>
              <p className="text-xs text-muted-foreground">Medium Confidence</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">{stats.lowConfidence}</div>
              <p className="text-xs text-muted-foreground">Low Confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === 'all' ? undefined : (value as ResearchQueueFilters['status']),
                }))
              }
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="edited">Edited</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.confidence || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  confidence: value === 'all' ? undefined : (value as ResearchQueueFilters['confidence']),
                }))
              }
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>

            {stats.highConfidence > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => batchApprove('high')}
                disabled={isBatchApproving}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve All High ({stats.highConfidence})
              </Button>
            )}

            {stats.approved > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSQL}
              >
                <Download className="w-4 h-4 mr-1" />
                Export SQL
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Research Results</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {filters.status === 'pending'
                  ? 'No pending research items to review. Import AI research results to populate this queue.'
                  : 'No items match your current filters.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ResearchResultCard
                key={item.id}
                item={item}
                onApprove={approve}
                onReject={reject}
                onEditAndApprove={editAndApprove}
                isApproving={isApproving}
                isRejecting={isRejecting}
                isEditing={isEditing}
              />
            ))}
          </div>
        )}

        {/* Import Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm">How to Import Research Results</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              1. Run the Codex/background tool to generate research JSON
            </p>
            <p>
              2. Use the Supabase MCP or SQL to insert results into <code className="bg-muted px-1 rounded">milestone_research_queue</code>
            </p>
            <p>
              3. Refresh this page to see new items for review
            </p>
            <p>
              4. Review each item: Approve high-confidence items, edit medium, reject low
            </p>
            <p>
              5. Export approved items as SQL migration for version control
            </p>
          </CardContent>
        </Card>
      </PageShell>
    </AppLayout>
  );
};

export default MilestoneValidationPage;
