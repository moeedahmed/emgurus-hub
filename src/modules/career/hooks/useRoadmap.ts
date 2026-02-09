import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';

export interface RoadmapNode {
  id: string;
  roadmap_id: string;
  title: string;
  timeframe: '30d' | '6mo' | '12mo' | '18mo+' | null;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
  why: string | null;
  how: string[];
  examples: string[];
  sources: { title: string; url: string; lastVerified: string }[];
  cost_estimate: {
    label: string;
    min: number;
    max: number | null;
    currency: string;
    note: string | null;
    source_url: string | null;
  } | null;
  confidence: 'high' | 'medium' | 'low';
  position: { x: number; y: number };
  order_index: number;
  created_at: string;
  completed_at: string | null;
}

export interface Roadmap {
  id: string;
  goal_id: string;
  title: string;
  pathway: string | null;
  created_at: string;
  is_public: boolean;
  share_token: string;
  nodes: RoadmapNode[];
}

export interface CreateRoadmapInput {
  goal_id: string;
  title: string;
  pathway?: string;
  nodes: Omit<RoadmapNode, 'id' | 'roadmap_id' | 'created_at'>[];
}

export function useRoadmap(goalId: string) {
  return useQuery({
    queryKey: queryKeys.roadmap.byGoal(goalId),
    queryFn: async () => {
      // First get the roadmap
      const { data: roadmap, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('goal_id', goalId)
        .maybeSingle();

      if (roadmapError) throw roadmapError;
      if (!roadmap) return null;

      // Then get the nodes
      const { data: nodes, error: nodesError } = await supabase
        .from('roadmap_nodes')
        .select('*')
        .eq('roadmap_id', roadmap.id)
        .order('order_index', { ascending: true });

      if (nodesError) throw nodesError;

      // Transform nodes to match expected format
      const transformedNodes: RoadmapNode[] = (nodes || []).map((node) => ({
        id: node.id,
        roadmap_id: node.roadmap_id,
        title: node.title,
        timeframe: node.timeframe as RoadmapNode['timeframe'],
        status: node.status as RoadmapNode['status'],
        dependencies: (node.dependencies as string[]) || [],
        why: node.why,
        how: (node.how as string[]) || [],
        examples: (node.examples as string[]) || [],
        sources: (node.sources as RoadmapNode['sources']) || [],
        cost_estimate: ((node as Record<string, unknown>).cost_estimate as RoadmapNode['cost_estimate']) || null,
        confidence: (node.confidence as RoadmapNode['confidence']) || 'medium',
        position: (node.position as unknown as RoadmapNode['position']) || { x: 0, y: 0 },
        order_index: node.order_index,
        created_at: node.created_at || '',
        completed_at: node.completed_at || null,
      }));

      return {
        id: roadmap.id,
        goal_id: roadmap.goal_id,
        title: roadmap.title,
        pathway: roadmap.pathway,
        created_at: roadmap.created_at,
        is_public: roadmap.is_public ?? false,
        share_token: roadmap.share_token,
        nodes: transformedNodes,
      } as Roadmap;
    },
    enabled: !!goalId,
  });
}

export interface PublicRoadmapData {
  roadmap: Roadmap;
  creatorDisplayName: string | null;
}

export function usePublicRoadmap(token: string) {
  return useQuery({
    queryKey: ['public-roadmap', token],
    queryFn: async () => {
      // Fetch roadmap by share_token with nodes and creator display name
      const { data, error } = await supabase
        .from('roadmaps')
        .select(`
          *,
          roadmap_nodes(*),
          goals!inner(
            user_id,
            profiles!inner(display_name)
          )
        `)
        .eq('share_token', token)
        .eq('is_public', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Transform nodes
      const transformedNodes: RoadmapNode[] = (data.roadmap_nodes || [])
        .map((node: Record<string, unknown>) => ({
          id: node.id as string,
          roadmap_id: node.roadmap_id as string,
          title: node.title as string,
          timeframe: (node.timeframe as RoadmapNode['timeframe']) || null,
          status: (node.status as RoadmapNode['status']) || 'pending',
          dependencies: (node.dependencies as string[]) || [],
          why: (node.why as string | null) || null,
          how: (node.how as string[]) || [],
          examples: (node.examples as string[]) || [],
          sources: (node.sources as RoadmapNode['sources']) || [],
          cost_estimate: (node.cost_estimate as RoadmapNode['cost_estimate']) || null,
          confidence: (node.confidence as RoadmapNode['confidence']) || 'medium',
          position: (node.position as RoadmapNode['position']) || { x: 0, y: 0 },
          order_index: (node.order_index as number) || 0,
          created_at: (node.created_at as string) || '',
          completed_at: (node.completed_at as string | null) || null,
        }))
        .sort((a, b) => a.order_index - b.order_index);

      // Extract creator display name from nested structure
      const creatorDisplayName =
        (data.goals as Record<string, unknown>)?.profiles
          ? ((data.goals as Record<string, unknown>).profiles as Record<string, unknown>).display_name as string | null
          : null;

      const roadmap: Roadmap = {
        id: data.id,
        goal_id: data.goal_id,
        title: data.title,
        pathway: data.pathway || null,
        created_at: data.created_at,
        is_public: data.is_public ?? false,
        share_token: data.share_token,
        nodes: transformedNodes,
      };

      return {
        roadmap,
        creatorDisplayName,
      } as PublicRoadmapData;
    },
    enabled: !!token,
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRoadmapInput) => {
      // Create the roadmap
      const { data: roadmap, error: roadmapError } = await supabase
        .from('roadmaps')
        .insert({
          goal_id: input.goal_id,
          title: input.title,
          pathway: input.pathway || null,
        })
        .select()
        .single();

      if (roadmapError) throw roadmapError;

      // Create nodes if any
      if (input.nodes.length > 0) {
        const nodesToInsert = input.nodes.map((node, index) => ({
          roadmap_id: roadmap.id,
          title: node.title,
          timeframe: node.timeframe,
          status: node.status,
          dependencies: node.dependencies,
          why: node.why,
          how: node.how,
          examples: node.examples,
          sources: node.sources,
          cost_estimate: node.cost_estimate || null,
          confidence: node.confidence,
          position: node.position,
          order_index: index,
        }));

        const { error: nodesError } = await supabase
          .from('roadmap_nodes')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(nodesToInsert as any[]);

        if (nodesError) throw nodesError;
      }

      return roadmap;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.byGoal(data.goal_id) });
    },
  });
}

export function useUpdateNodeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nodeId,
      status,
    }: {
      nodeId: string;
      status: 'pending' | 'in-progress' | 'completed';
    }) => {
      const updateData: { status: string; completed_at?: string | null } = { status };

      // Set completed_at when marking as completed, clear it otherwise
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { data, error } = await supabase
        .from('roadmap_nodes')
        .update(updateData)
        .eq('id', nodeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}

export function useUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nodeId,
      data,
    }: {
      nodeId: string;
      data: {
        title?: string;
        timeframe?: '30d' | '6mo' | '12mo' | '18mo+' | null;
        why?: string | null;
        how?: string[];
      };
    }) => {
      const { data: result, error } = await supabase
        .from('roadmap_nodes')
        .update(data)
        .eq('id', nodeId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}

export function useAddNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roadmapId,
      data,
    }: {
      roadmapId: string;
      data: {
        title: string;
        timeframe?: '30d' | '6mo' | '12mo' | '18mo+' | null;
        why?: string | null;
        how?: string[];
      };
    }) => {
      // Get current max order_index
      const { data: existingNodes } = await supabase
        .from('roadmap_nodes')
        .select('order_index')
        .eq('roadmap_id', roadmapId)
        .order('order_index', { ascending: false })
        .limit(1);

      const maxOrderIndex = existingNodes?.[0]?.order_index ?? -1;

      const { data: result, error } = await supabase
        .from('roadmap_nodes')
        .insert({
          roadmap_id: roadmapId,
          title: data.title,
          timeframe: data.timeframe || null,
          why: data.why || null,
          how: data.how || [],
          status: 'pending',
          order_index: maxOrderIndex + 1,
          dependencies: [],
          examples: [],
          sources: [],
          confidence: 'medium',
          position: { x: 0, y: 0 },
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}

export function useDeleteNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nodeId: string) => {
      const { error } = await supabase
        .from('roadmap_nodes')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}

export function useRegenerateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roadmapId,
      nodes,
    }: {
      roadmapId: string;
      nodes: Omit<RoadmapNode, 'id' | 'roadmap_id' | 'created_at'>[];
    }) => {
      // Delete existing nodes
      const { error: deleteError } = await supabase
        .from('roadmap_nodes')
        .delete()
        .eq('roadmap_id', roadmapId);

      if (deleteError) throw deleteError;

      // Insert new nodes
      if (nodes.length > 0) {
        const nodesToInsert = nodes.map((node, index) => ({
          roadmap_id: roadmapId,
          title: node.title,
          timeframe: node.timeframe,
          status: node.status,
          dependencies: node.dependencies,
          why: node.why,
          how: node.how,
          examples: node.examples,
          sources: node.sources,
          cost_estimate: node.cost_estimate || null,
          confidence: node.confidence,
          position: node.position,
          order_index: index,
        }));

        const { error: insertError } = await supabase
          .from('roadmap_nodes')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(nodesToInsert as any[]);

        if (insertError) throw insertError;
      }

      return { roadmapId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}

export function useReorderNodes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roadmapId,
      nodeIds,
    }: {
      roadmapId: string;
      nodeIds: string[];
    }) => {
      // Update each node's order_index based on new position
      const updates = nodeIds.map((id, index) =>
        supabase
          .from('roadmap_nodes')
          .update({ order_index: index })
          .eq('id', id)
      );

      await Promise.all(updates);
      return { roadmapId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}

export function useToggleRoadmapPublic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roadmapId,
      isPublic,
    }: {
      roadmapId: string;
      isPublic: boolean;
    }) => {
      const { data, error } = await supabase
        .from('roadmaps')
        .update({ is_public: isPublic })
        .eq('id', roadmapId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.all });
    },
  });
}
