import { useEffect } from 'react';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { logger } from '@/modules/career/lib/logger';

/**
 * Automatically syncs the avatar URL from OAuth identities to the user's metadata.
 * This ensures that if the metadata is missing but the identity info exists (e.g. from Google),
 * it gets persisted effectively "self-healing" the missing avatar issue.
 */
export function useAvatarSync() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const currentAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

        // If we already have an avatar in metadata, we're good.
        if (currentAvatar) return;

        // Look for avatar in identities (Google typically provides 'picture' or 'avatar_url')
        const identityAvatar =
            user.identities?.find((i) => i.identity_data?.avatar_url || i.identity_data?.picture)?.identity_data?.avatar_url ||
            user.identities?.find((i) => i.identity_data?.picture)?.identity_data?.picture;

        if (identityAvatar) {
            // Persist to Supabase Auth metadata
            supabase.auth.updateUser({
                data: { avatar_url: identityAvatar }
            }).then(({ error }) => {
                if (error) {
                    logger.error('[AvatarSync] Failed to sync avatar:', error);
                }
            });
        }
    }, [user]); // Re-run when user object changes (e.g. after auth state change)
}
