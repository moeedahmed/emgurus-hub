import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useToggleRoadmapPublic } from '@/modules/career/hooks/useRoadmap';
import { toast } from 'sonner';
import type { Roadmap } from '@/modules/career/hooks/useRoadmap';

interface RoadmapShareDialogProps {
  roadmap: Roadmap;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RoadmapShareDialog({ roadmap, open, onOpenChange }: RoadmapShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const togglePublic = useToggleRoadmapPublic();

  const shareUrl = `${window.location.origin}/shared/${roadmap.share_token}`;

  const handleTogglePublic = async (isPublic: boolean) => {
    try {
      await togglePublic.mutateAsync({
        roadmapId: roadmap.id,
        isPublic,
      });
      toast.success(isPublic ? 'Roadmap is now public' : 'Roadmap is now private');
    } catch (error) {
      console.error('Failed to toggle public status:', error);
      toast.error('Failed to update sharing settings');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const stepCount = roadmap.nodes.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Roadmap</DialogTitle>
          <DialogDescription>
            Share your roadmap with others via a public link
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Public Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-toggle" className="text-base font-medium">
                Make this roadmap public
              </Label>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={roadmap.is_public}
              onCheckedChange={handleTogglePublic}
              disabled={togglePublic.isPending}
            />
          </div>

          {/* Share URL */}
          {roadmap.is_public && (
            <div className="space-y-2">
              <Label htmlFor="share-url">Share link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="font-mono text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Privacy Info */}
          <div className="rounded-lg border border-muted bg-muted/30 p-3 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">What's shared</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Roadmap title and {stepCount} step{stepCount !== 1 ? 's' : ''}</li>
                  <li>• Step details (why, how, examples, costs)</li>
                  <li>• Your display name</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">What's private</p>
                <p className="text-xs text-muted-foreground">
                  Your personal goal details, narrative, constraints, and other roadmaps remain private
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
