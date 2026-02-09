import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { queryKeys } from '@/modules/career/lib/queryKeys';

/**
 * Hook for managing user pathways (archive, delete, restore)
 */
export function usePathwayManagement() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const archivePathway = useMutation({
        mutationFn: async (pathwayId: string) => {
            if (!user) throw new Error('Not authenticated');

            // Get current pathway_ids and archived_pathway_ids
            const { data: profile, error: fetchError } = await supabase
                .from('profiles')
                .select('pathway_ids, archived_pathway_ids')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;

            const currentIds = profile?.pathway_ids || [];
            const archivedIds = profile?.archived_pathway_ids || [];

            // Move from active to archived
            const updatedIds = currentIds.filter((id: string) => id !== pathwayId);
            const updatedArchivedIds = [...archivedIds, pathwayId];

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    pathway_ids: updatedIds,
                    archived_pathway_ids: updatedArchivedIds
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            return pathwayId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profile.byUser(user?.id) });
        },
    });

    const restorePathway = useMutation({
        mutationFn: async (pathwayId: string) => {
            if (!user) throw new Error('Not authenticated');

            // Get current pathway_ids and archived_pathway_ids
            const { data: profile, error: fetchError } = await supabase
                .from('profiles')
                .select('pathway_ids, archived_pathway_ids')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;

            const currentIds = profile?.pathway_ids || [];
            const archivedIds = profile?.archived_pathway_ids || [];

            // Move from archived to active
            const updatedArchivedIds = archivedIds.filter((id: string) => id !== pathwayId);
            const updatedIds = [...currentIds, pathwayId];

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    pathway_ids: updatedIds,
                    archived_pathway_ids: updatedArchivedIds
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            return pathwayId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profile.byUser(user?.id) });
        },
    });

    const removePathway = useMutation({
        mutationFn: async (pathwayId: string) => {
            if (!user) throw new Error('Not authenticated');

            // Get current pathway_ids and archived_pathway_ids
            const { data: profile, error: fetchError } = await supabase
                .from('profiles')
                .select('pathway_ids, archived_pathway_ids')
                .eq('id', user.id)
                .single();

            if (fetchError) throw fetchError;

            const currentIds = profile?.pathway_ids || [];
            const archivedIds = profile?.archived_pathway_ids || [];

            // Remove from both active and archived
            const updatedIds = currentIds.filter((id: string) => id !== pathwayId);
            const updatedArchivedIds = archivedIds.filter((id: string) => id !== pathwayId);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    pathway_ids: updatedIds,
                    archived_pathway_ids: updatedArchivedIds
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            return pathwayId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profile.byUser(user?.id) });
        },
    });

    return {
        archivePathway,
        restorePathway,
        removePathway,
    };
}
