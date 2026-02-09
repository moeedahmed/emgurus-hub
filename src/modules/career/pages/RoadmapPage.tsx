import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle, Clock, AlertCircle, MessageSquare, Loader2, RefreshCw, Calendar, Plus, Pencil, Trash2, Share2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { PageShell } from '@/modules/career/components/layout/PageShell';

import { useRoadmap, RoadmapNode, useRegenerateRoadmap, useUpdateNodeStatus, useReorderNodes, useUpdateNode, useAddNode, useDeleteNode } from '@/modules/career/hooks/useRoadmap';
import { useGoal } from '@/modules/career/hooks/useGoals';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { RoadmapAssistant } from '@/modules/career/components/roadmap/RoadmapAssistant';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import { RoadmapStepCard } from '@/modules/career/components/roadmap/RoadmapStepCard';
import { ProgressCelebration } from '@/modules/career/components/roadmap/ProgressCelebration';
import { GenerationProgress } from '@/modules/career/components/roadmap/GenerationProgress';
import { EditStepDialog } from '@/modules/career/components/roadmap/EditStepDialog';
import { AddStepDialog } from '@/modules/career/components/roadmap/AddStepDialog';
import { DeleteStepConfirm } from '@/modules/career/components/roadmap/DeleteStepConfirm';
import { RoadmapShareDialog } from '@/modules/career/components/roadmap/RoadmapShareDialog';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useGoalWizard } from '@/modules/career/contexts/GoalWizardContext';

const RoadmapPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [updatingNodeId, setUpdatingNodeId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<{ show: boolean; milestone: '50%' | '100%' } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const previousProgressRef = useRef<number>(0);
  const { toast } = useToast();

  const { user } = useAuth();
  const { data: goal, isLoading: goalLoading } = useGoal(id || '');
  const { data: roadmap, isLoading: roadmapLoading } = useRoadmap(id || '');
  const { data: profile } = useProfile();
  const regenerateRoadmap = useRegenerateRoadmap();
  const updateNodeStatus = useUpdateNodeStatus();
  const reorderNodes = useReorderNodes();
  const updateNode = useUpdateNode();
  const addNode = useAddNode();
  const deleteNode = useDeleteNode();

  // Edit/Add/Delete dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<RoadmapNode | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<RoadmapNode | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoading = goalLoading || roadmapLoading;

  // Calculate progress for celebration detection
  const nodes = roadmap?.nodes || [];
  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const progressPercent = nodes.length > 0
    ? Math.round((completedCount / nodes.length) * 100)
    : 0;

  // Get currently expanded node for AI assistant context
  const expandedNode = expandedNodeId ? nodes.find(n => n.id === expandedNodeId) || null : null;

  /* 
     Fix for intrusive celebration on page load:
     Track if this is the first time we're seeing data. 
     If so, sync the ref but DO NOT show celebration.
  */
  const isFirstLoad = useRef(true);

  // Track progress changes for celebration
  useEffect(() => {
    if (nodes.length === 0) return;

    const currentProgress = progressPercent;

    // On first load of data, just sync the ref and skip celebration
    if (isFirstLoad.current) {
      previousProgressRef.current = currentProgress;
      isFirstLoad.current = false;
      return;
    }

    const prevProgress = previousProgressRef.current;

    // Check for milestone achievements
    // Only show if we explicitly crossed the threshold from a lower value
    if (prevProgress < 50 && currentProgress >= 50 && currentProgress < 100) {
      setShowCelebration({ show: true, milestone: '50%' });
    } else if (prevProgress < 100 && currentProgress === 100) {
      setShowCelebration({ show: true, milestone: '100%' });
    }

    previousProgressRef.current = currentProgress;
  }, [progressPercent, nodes.length]);

  // DnD sensors - include touch for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler for header AI button - always opens with roadmap context
  const handleOpenRoadmapAssistant = () => {
    setExpandedNodeId(null); // Reset to ensure roadmap context, not step context
    setAssistantOpen(true);
  };

  // Toggle expand - only one card at a time
  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodeId(prev => prev === nodeId ? null : nodeId);
  };

  const getTimeframeColor = (timeframe: string | null) => {
    switch (timeframe) {
      case '30d': return 'bg-success/10 text-success';
      case '6mo': return 'bg-primary/10 text-primary';
      case '12mo': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (node: RoadmapNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (updatingNodeId) return;

    const nextStatus: Record<string, 'pending' | 'in-progress' | 'completed'> = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending',
    };

    const newStatus = nextStatus[node.status];
    setUpdatingNodeId(node.id);

    try {
      await updateNodeStatus.mutateAsync({ nodeId: node.id, status: newStatus });
      toast({
        title: newStatus === 'completed' ? '🎉 Step completed!' :
          newStatus === 'in-progress' ? '▶️ Step in progress' :
            'Step reset to pending',
        description: node.title,
      });
    } catch (error) {
      toast({
        title: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingNodeId(null);
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || active.id === over.id || !roadmap) return;

    const nodes = roadmap?.nodes || [];
    const oldIndex = nodes.findIndex((n) => n.id === active.id);
    const newIndex = nodes.findIndex((n) => n.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedNodes = arrayMove(nodes, oldIndex, newIndex);
    const nodeIds = reorderedNodes.map((n) => n.id);

    try {
      await reorderNodes.mutateAsync({ roadmapId: roadmap.id, nodeIds });
      toast({
        title: 'Steps reordered',
        description: 'Your roadmap order has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Failed to reorder',
        variant: 'destructive',
      });
    }
  };

  // Handle edit step
  const handleEditStep = (node: RoadmapNode) => {
    setNodeToEdit(node);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (data: {
    title: string;
    timeframe: '30d' | '6mo' | '12mo' | '18mo+' | null;
    why: string | null;
    how: string[];
  }) => {
    if (!nodeToEdit) return;
    setIsSaving(true);
    try {
      await updateNode.mutateAsync({ nodeId: nodeToEdit.id, data });
      toast({ title: 'Step updated' });
      setEditDialogOpen(false);
      setNodeToEdit(null);
    } catch (error) {
      toast({ title: 'Failed to update step', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle add step
  const handleAddStep = async (data: {
    title: string;
    timeframe: '30d' | '6mo' | '12mo' | '18mo+' | null;
    why: string | null;
    how: string[];
  }) => {
    if (!roadmap) return;
    setIsAdding(true);
    try {
      await addNode.mutateAsync({ roadmapId: roadmap.id, data });
      toast({ title: 'Step added' });
      setAddDialogOpen(false);
    } catch (error) {
      toast({ title: 'Failed to add step', variant: 'destructive' });
    } finally {
      setIsAdding(false);
    }
  };

  // Handle delete step
  const handleDeleteStep = (node: RoadmapNode) => {
    setNodeToDelete(node);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!nodeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteNode.mutateAsync(nodeToDelete.id);
      toast({ title: 'Step deleted' });
      setDeleteConfirmOpen(false);
      setNodeToDelete(null);
      // Clear expansion if deleted node was expanded
      if (expandedNodeId === nodeToDelete.id) {
        setExpandedNodeId(null);
      }
    } catch (error) {
      toast({ title: 'Failed to delete step', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const { openGoalWizard } = useGoalWizard();

  const handlePromoteStep = (node: RoadmapNode) => {
    // Gather completed steps for context
    const completedSteps = nodes
      .filter(n => n.status === 'completed')
      .map(n => n.title);

    openGoalWizard({
      promotedFromStep: node.title,
      parentGoalTitle: goal?.title,
      stepWhy: node.why || undefined,
      stepHow: node.how,
      completedSteps,
      autoMagic: true,
    });
  };

  const handleGenerateOrRegenerateRoadmap = async () => {
    if (!goal || isRegenerating) return;

    setIsRegenerating(true);
    try {
      toast({
        title: 'Regenerating roadmap',
        description: 'AI is creating your personalized steps...',
      });

      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-roadmap', {
        body: {
          goalType: goal.type,
          userId: user?.id,
          extractedGoal: {
            title: goal.title,
            targetRole: goal.target_role,
            targetCountry: goal.target_country,
            timeline: goal.timeline,
            narrative: goal.narrative,
          },
          constraints: goal.constraints,
          profile: profile ? {
            displayName: profile.display_name,
            specialty: profile.specialty,
            currentCountry: profile.current_country,
            careerStage: profile.career_stage,
            yearsExperience: profile.years_experience,
            graduationYear: profile.graduation_year,
            milestones_achieved: profile.milestones_achieved,
            trainingPaths: profile.training_paths,
          } : null,
        },
      });

      // Handle quota exceeded
      if (functionData?.error && functionData?.remaining !== undefined) {
        toast({
          title: 'Roadmap quota exceeded',
          description: 'Upgrade your plan to generate more roadmaps.',
          variant: 'destructive',
        });
        return;
      }

      if (functionError) throw functionError;

      const nodes = functionData?.nodes || [];

      if (nodes.length === 0) {
        throw new Error('No roadmap steps were generated. Please try again.');
      }

      // If no roadmap exists, create one first
      let roadmapId = roadmap?.id;
      if (!roadmapId) {
        const { data: newRoadmap, error: roadmapError } = await supabase
          .from('roadmaps')
          .insert({
            goal_id: goal.id,
            title: goal.title,
            pathway: goal.target_role || null,
          })
          .select()
          .single();

        if (roadmapError) throw roadmapError;
        roadmapId = newRoadmap.id;
      }

      await regenerateRoadmap.mutateAsync({
        roadmapId: roadmapId,
        nodes: (nodes as RoadmapNode[]).map((node, index) => ({
          title: node.title,
          timeframe: node.timeframe || null,
          status: 'pending' as const,
          dependencies: node.dependencies || [],
          why: node.why || null,
          how: node.how || [],
          examples: node.examples || [],
          sources: node.sources || [],
          cost_estimate: node.cost_estimate || null,
          confidence: node.confidence || 'medium',
          position: node.position || { x: 0, y: index * 100 },
          order_index: index,
          completed_at: null,
        })),
      });

      toast({
        title: roadmap ? 'Roadmap regenerated!' : 'Roadmap generated!',
        description: `${nodes.length} personalized steps created.`,
      });
    } catch (error) {
      console.error('Regenerate roadmap error:', error);
      toast({
        title: 'Failed to regenerate',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border p-4">
          <div className="container flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/goals')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display font-semibold">Goal not found</h1>
          </div>
        </header>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground mb-4">This goal doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/goals')}><ArrowLeft className="w-4 h-4" />Back to Goals</Button>
        </div>
      </div>
    );
  }

  const inProgressCount = nodes.filter(n => n.status === 'in-progress').length;

  return (
    <AppLayout>
      {/* Progress Celebration */}
      {showCelebration && (
        <ProgressCelebration
          show={showCelebration.show}
          milestone={showCelebration.milestone}
          type="roadmap"
          onComplete={() => setShowCelebration(null)}
        />
      )}

      <PageShell width="focused">
        {/* Header */}
        <PageHeader
          title={roadmap?.title || goal.title}
          description={nodes.length > 0
            ? `${completedCount}/${nodes.length} steps completed`
            : (roadmap?.pathway || 'Personalized roadmap')}
          backUrl="/goals"
        >
          <div className="flex items-center gap-2">
            <Button
              variant={isEditMode ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className={cn(isEditMode && "bg-secondary text-secondary-foreground")}
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden md:inline">{isEditMode ? 'Done Editing' : 'Edit Steps'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </Button>
            <Button
              size="sm"
              onClick={handleOpenRoadmapAssistant}
              className="bg-primary hover:bg-primary/90 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">AI Help</span>
            </Button>
          </div>
        </PageHeader>

        <div>
          {/* Roadmap Flow */}
          {/* Full-screen progress overlay (portal) for regeneration */}
          {goal && (
            <GenerationProgress
              isActive={isRegenerating}
              goalType={goal.type}
              targetCountry={goal.target_country}
              targetRole={goal.target_role}
              constraints={goal.constraints}
              specialty={profile?.specialty}
              currentCountry={profile?.current_country}
              hasDocuments={!!(profile?.milestones_achieved?.length)}
            />
          )}

          {nodes.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Clock className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">
                No roadmap steps yet
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Your roadmap is empty. Click below to generate personalized steps based on your goal.
              </p>
              <Button
                onClick={handleGenerateOrRegenerateRoadmap}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={nodes.map(n => n.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {nodes.map((node, index) => (
                    <RoadmapStepCard
                      key={node.id}
                      node={node}
                      index={index}
                      isExpanded={expandedNodeId === node.id}
                      onToggleExpand={() => handleToggleExpand(node.id)}
                      onStatusToggle={(e) => handleStatusToggle(node, e)}
                      isUpdating={updatingNodeId === node.id}
                      getTimeframeColor={getTimeframeColor}
                      onEdit={() => handleEditStep(node)}
                      onDelete={() => handleDeleteStep(node)}
                      onPromote={() => handlePromoteStep(node)}
                      onAskAI={() => {
                        setExpandedNodeId(node.id);
                        setAssistantOpen(true);
                      }}
                      isEditMode={isEditMode}
                    />
                  ))}

                  {/* Add step button - only in edit mode */}
                  {isEditMode && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-dashed"
                      onClick={() => setAddDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Step
                    </Button>
                  )}
                </div>

                {/* AI Disclaimer */}
                <div className="mt-4 pt-3 border-t border-border/40 text-center">
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed mx-auto uppercase tracking-wider">
                    AI-Generated Milestones · Personalized for your pathway. Please verify requirements with official regulatory bodies.
                  </p>
                </div>
              </SortableContext>

              {/* Drag overlay for lifted card effect */}
              <DragOverlay
                dropAnimation={{
                  duration: 200,
                  easing: 'ease-out',
                }}
              >
                {activeId ? (() => {
                  const activeNode = nodes.find(n => n.id === activeId);
                  const activeIndex = nodes.findIndex(n => n.id === activeId);
                  if (!activeNode) return null;
                  return (
                    <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-medium',
                          activeNode.status === 'completed' ? 'bg-success text-success-foreground' :
                            activeNode.status === 'in-progress' ? 'bg-primary text-primary-foreground' :
                              'bg-muted text-muted-foreground'
                        )}>
                          {activeNode.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : activeNode.status === 'in-progress' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            activeIndex + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{activeNode.title}</h3>
                        </div>
                      </div>
                    </div>
                  );
                })() : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        {/* Roadmap Assistant */}
        <RoadmapAssistant
          open={assistantOpen}
          onOpenChange={setAssistantOpen}
          goal={goal}
          roadmap={roadmap || null}
          userProfile={profile ? {
            displayName: profile.display_name || undefined,
            specialty: profile.specialty || undefined,
            currentCountry: profile.current_country || undefined,
            careerStage: profile.career_stage || undefined,
          } : undefined}
          initialSelectedStep={expandedNode}
        />

        {/* Edit Step Dialog */}
        <EditStepDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          node={nodeToEdit}
          onSave={handleSaveEdit}
          isSaving={isSaving}
        />

        {/* Add Step Dialog */}
        <AddStepDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAdd={handleAddStep}
          isAdding={isAdding}
        />

        {/* Delete Confirmation */}
        <DeleteStepConfirm
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          stepTitle={nodeToDelete?.title || ''}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        {/* Share Roadmap Dialog */}
        {roadmap && (
          <RoadmapShareDialog
            roadmap={roadmap}
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
          />
        )}
      </PageShell>
    </AppLayout >
  );
};

export default RoadmapPage;
