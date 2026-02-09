import { useMemo } from 'react';
import {
    PathwayDefinition,
    PathwayRequirement,
} from '@/modules/career/data/pathwayRequirements';
import { usePathwayRegistry } from '@/modules/career/hooks/usePathwayRegistry';
import type { UserMilestoneRow } from '@/modules/career/hooks/useUserMilestones';

export interface PathwayProgressResult {
    pathway: PathwayDefinition | null;
    completed: PathwayRequirement[];
    completedMilestoneNames: string[]; // Actual user milestone names that satisfied requirements
    missing: PathwayRequirement[];
    percentComplete: number;
    completedCount: number; // Includes custom + standard
    totalRequired: number;
    nextSteps: PathwayRequirement[];
    sourcePathName: string; // The original name selected by the user
    profile?: UserProfileForPathwayProgress | null;
}

export interface UserProfileForPathwayProgress {
    specialty?: string | null;
    pathway_ids?: string[] | null;
    custom_milestones?: { id: string; name: string; pathway_id: string | null; completed: boolean }[] | null;
}

/**
 * Checks if a user has completed a requirement using relational milestone data.
 * Uses UUID-based matching (dbId), falling back to exact name match and alternatives.
 */
export function hasCompleted(
    requirement: PathwayRequirement,
    _profile: UserProfileForPathwayProgress,
    _pathwayId?: string,
    userMilestones?: UserMilestoneRow[],
): boolean {
    if (!userMilestones || userMilestones.length === 0) return false;

    // Check by dbId first (most reliable)
    if (requirement.dbId) {
        const row = userMilestones.find(
            um => um.milestone_id === requirement.dbId && um.status === 'done'
        );
        if (row) return true;
    }

    // Fallback: check by exact name match
    const nameMatch = userMilestones.find(um =>
        um.status === 'done' && um.milestone.name === requirement.name
    );
    if (nameMatch) return true;

    // Check alternatives
    if (requirement.alternatives) {
        const altMatch = userMilestones.find(um =>
            um.status === 'done' && requirement.alternatives!.includes(um.milestone.name)
        );
        if (altMatch) return true;
    }

    return false;
}

/**
 * Analyzes progress for multiple pathways using relational milestone data.
 */
export function usePathwayProgress(
    profile: UserProfileForPathwayProgress | null,
    userMilestones?: UserMilestoneRow[],
): PathwayProgressResult[] {
    const {
        resolvePrimaryPathway,
        getPathwayById,
        getPathwayByName,
    } = usePathwayRegistry();

    return useMemo(() => {
        if (!profile) return [];
        if (!profile.pathway_ids?.length) return [];

        const results: PathwayProgressResult[] = [];

        for (const pathwayId of profile.pathway_ids) {
            // Resolve pathway via registry
            const official = resolvePrimaryPathway({
                pathwayIds: [pathwayId],
                specialty: profile.specialty,
                useFallback: false,
            }).pathway;

            let pathway: PathwayDefinition | undefined;
            if (official) {
                pathway = getPathwayById(official.id);
                if (!pathway) {
                    pathway = getPathwayByName(official.name, profile.specialty || undefined);
                }
            } else {
                // Try name-based lookup as last resort
                pathway = getPathwayByName(pathwayId, profile.specialty || undefined);
            }

            if (pathway) {
                const requiredItems = pathway.requirements
                    .filter(r => r.isRequired)
                    .sort((a, b) => a.order - b.order);

                const completed: PathwayRequirement[] = [];
                const missing: PathwayRequirement[] = [];

                for (const req of requiredItems) {
                    if (hasCompleted(req, profile, pathwayId, userMilestones)) {
                        completed.push(req);
                    } else {
                        missing.push(req);
                    }
                }

                // Get completed milestone names from relational data
                const completedMilestoneNames = (userMilestones || [])
                    .filter(um => um.status === 'done')
                    .filter(um => requiredItems.some(req =>
                        (req.dbId && um.milestone_id === req.dbId) || req.name === um.milestone.name
                    ))
                    .map(um => um.milestone.name);

                // Inject Custom Milestones into the result stats
                const relevantCustom = (profile.custom_milestones || []).filter(
                    cm => cm.pathway_id === pathwayId || cm.pathway_id === pathway!.name
                );

                const customCompletedCount = relevantCustom.filter(cm => cm.completed).length;
                const totalCustom = relevantCustom.length;

                const finalCompletedCount = completed.length + customCompletedCount;
                const finalTotalRequired = requiredItems.length + totalCustom;

                results.push({
                    pathway,
                    completed,
                    completedMilestoneNames,
                    missing,
                    percentComplete: finalTotalRequired > 0
                        ? Math.round((finalCompletedCount / finalTotalRequired) * 100)
                        : 0,
                    completedCount: finalCompletedCount,
                    totalRequired: finalTotalRequired,
                    nextSteps: missing.slice(0, 3),
                    sourcePathName: official?.name || pathwayId,
                    profile
                });
            } else {
                // Handle unresolvable pathway IDs
                results.push({
                    pathway: {
                        id: 'custom-path-' + pathwayId.replace(/\s+/g, '-'),
                        name: pathwayId,
                        description: 'Manually defined career progression',
                        requirements: [],
                        estimatedDuration: 'Variable',
                        targetRole: profile.specialty || 'Specialist',
                    },
                    completed: [],
                    completedMilestoneNames: [],
                    missing: [],
                    percentComplete: 0,
                    completedCount: 0,
                    totalRequired: 0,
                    nextSteps: [],
                    sourcePathName: pathwayId,
                    profile
                });
            }
        }

        return results;
    }, [profile, userMilestones, resolvePrimaryPathway, getPathwayById, getPathwayByName]);
}
