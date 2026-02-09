import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { useProfile } from '@/modules/career/hooks/useProfile';
import {
  getCareerPathsForSpecialty,
  type CareerPath,
  milestonesByCareerPath,
  commonMilestones,
} from '@/modules/career/data/careerPathMappings';
import { resolvePathwayId } from '@/modules/career/utils/pathwayResolver';
import { usePathwayRegistry } from '@/modules/career/hooks/usePathwayRegistry';
import {
  validateField as validateSingleField,
  validateAllRequired,
  hasValidationErrors,
  type ProfileValidationErrors,
} from '@/modules/career/lib/profileValidation';
import { debounce } from '@/modules/career/lib/debounce';
import { logger } from '@/modules/career/lib/logger';
import type { Json } from '@/modules/career/integrations/supabase/types';

const USE_DB_PATHWAYS = import.meta.env.VITE_USE_DB_PATHWAYS === 'true';

export interface CustomMilestone {
  id: string;
  name: string;
  pathway_id: string | null;
  pathway_name?: string;
  completed: boolean;
}

export interface ProfileFormData {
  displayName: string;
  careerStage: string;
  currentCountry: string;
  specialties: string[];
  graduationYear: string;
  trainingPaths: string[];
  milestonesAchieved: string[];
  yearsExperience: string;
  additionalContext: string;
  workRhythm: string;
  pathwayIds: string[]; // New: Array of IDs derived from trainingPaths
  pathwayId?: string; // Legacy: Kept for compatibility
  customMilestones: CustomMilestone[];
}

const initialFormData: ProfileFormData = {
  displayName: '',
  careerStage: '',
  currentCountry: '',
  specialties: [],
  graduationYear: '',
  trainingPaths: [],
  milestonesAchieved: [],
  yearsExperience: '',
  additionalContext: '',
  workRhythm: 'full_time',
  pathwayIds: [],
  customMilestones: [],
};

export function useProfileForm() {
  const { user } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { pathways, resolvePrimaryPathway } = usePathwayRegistry();
  const [data, setData] = useState<ProfileFormData>(initialFormData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const useDbPathways = USE_DB_PATHWAYS;

  const milestoneNamesByPath = useMemo(() => {
    const map = new Map<string, string[]>();
    pathways.forEach((pathway) => {
      const names = (pathway.requirements || []).map((req) => req.name).filter(Boolean);
      if (pathway.id) map.set(pathway.id, names);
      if (pathway.name) map.set(pathway.name, names);
    });
    return map;
  }, [pathways]);

  const resolvePathwayIdFromSelection = useCallback((pathName: string) => {
    if (!pathName) return null;
    const direct = pathways.find((pathway) => pathway.id === pathName);
    if (direct) return direct.id;
    const resolved = resolvePrimaryPathway({ pathwayName: pathName });
    return resolved.pathway?.id || resolvePathwayId(pathName);
  }, [pathways, resolvePrimaryPathway]);

  const getMilestoneNamesForPath = useCallback((pathName: string) => {
    if (!pathName) return [];
    const direct = milestoneNamesByPath.get(pathName);
    if (direct) return direct;

    const resolved = resolvePrimaryPathway({ pathwayName: pathName });
    if (resolved.pathway) {
      return (
        milestoneNamesByPath.get(resolved.pathway.id) ||
        milestoneNamesByPath.get(resolved.pathway.name) ||
        []
      );
    }

    return (milestonesByCareerPath[pathName] || []).map((m) => m.name);
  }, [milestoneNamesByPath, resolvePrimaryPathway]);

  // Sync local form state with React Query profile data
  // This ensures changes from other sources (like Quick Complete) are reflected
  useEffect(() => {
    if (!profileData) return;

    // Handle both specialties array and legacy specialty string
    let specialtiesData: string[] = [];
    if (profileData.specialties && profileData.specialties.length > 0) {
      specialtiesData = profileData.specialties;
    } else if (profileData.specialty) {
      // Parse comma-separated string or single value
      specialtiesData = profileData.specialty.includes(',')
        ? profileData.specialty.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [profileData.specialty];
    }

    setData({
      displayName: profileData.display_name || '',
      careerStage: profileData.career_stage || '',
      currentCountry: profileData.current_country || '',
      specialties: specialtiesData,
      graduationYear: profileData.graduation_year || '',
      trainingPaths: profileData.training_paths || [],
      milestonesAchieved: profileData.milestones_achieved || [],
      yearsExperience: profileData.years_experience || '',
      additionalContext: profileData.additional_context || '',
      workRhythm: profileData.work_rhythm || 'full_time',
      pathwayId: profileData.pathway_id || '',
      pathwayIds: (profileData as unknown as { pathway_ids?: string[] }).pathway_ids || (profileData.training_paths || []).map(resolvePathwayId).filter(Boolean),
      customMilestones: profileData.custom_milestones || [],
    });
    setIsInitialized(true);
  }, [profileData]);

  // Derive loading state from React Query
  const isLoading = profileLoading || (!isInitialized && !!user);

  // Validate a single field
  const validateField = useCallback((field: keyof ProfileFormData, value: unknown): string | undefined => {
    return validateSingleField(field, value);
  }, []);

  // Validate all required fields and update errors state
  const validateAll = useCallback((): boolean => {
    const validationErrors = validateAllRequired(data);
    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  }, [data]);

  // Clear a specific error
  const clearError = useCallback((field: keyof ProfileFormData) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Debounced error setter with 300ms delay
  const debouncedSetError = useMemo(
    () =>
      debounce((field: keyof ProfileFormData, error: string | undefined) => {
        if (error) {
          setErrors((prev) => ({ ...prev, [field]: error }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        }
      }, 300),
    []
  );

  // Update a single field with debounced validation
  const updateField = useCallback(<K extends keyof ProfileFormData>(
    field: K,
    value: ProfileFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error immediately for responsive UX
    clearError(field);
    // Debounce the validation
    const error = validateField(field, value);
    debouncedSetError(field, error);
  }, [clearError, validateField, debouncedSetError]);


  // Toggle array item (for specialties, trainingPaths, examsPassed)
  const toggleArrayItem = useCallback((
    field: 'trainingPaths' | 'milestonesAchieved' | 'specialties',
    item: string,
    id?: string // Optional pathway ID
  ) => {
    setData((prev) => {
      const isRemoving = prev[field].includes(item);
      const newValue = isRemoving
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item];

      let milestonesAchieved = prev.milestonesAchieved;
      let customMilestones = prev.customMilestones;

      // Handle pathway removal cleanup
      if (field === 'trainingPaths' && isRemoving) {
        const removedPath = item;
        const remainingPaths = newValue;

        // 1. Identification of milestones for the removed path
        const removedPathMilestones = new Set(
          getMilestoneNamesForPath(removedPath)
        );

        // 2. Identification of milestones for remaining paths
        const remainingMilestoneNames = new Set(
          remainingPaths.flatMap(path =>
            getMilestoneNamesForPath(path)
          )
        );

        // 3. Add common milestones to the "don't touch" set
        commonMilestones.forEach(m => remainingMilestoneNames.add(m.name));

        // 4. Filter out orphaned milestones from milestonesAchieved
        milestonesAchieved = milestonesAchieved.filter(mName => {
          if (removedPathMilestones.has(mName) && !remainingMilestoneNames.has(mName)) {
            return false;
          }
          return true;
        });

        // 5. Reset status of custom milestones associated with this specific path
        const removedPathId = id || resolvePathwayIdFromSelection(removedPath);
        customMilestones = customMilestones.map(catM => {
          if ((removedPathId && catM.pathway_id === removedPathId) || catM.pathway_name === removedPath) {
            return { ...catM, completed: false };
          }
          return catM;
        });
      }

      // Clear error immediately, then debounce validation
      clearError(field);
      const error = validateField(field, newValue);
      debouncedSetError(field, error);

      if (field === 'trainingPaths' && !isRemoving && id) {
        // When adding a path, also add its ID if provided
        return {
          ...prev,
          [field]: newValue,
          pathwayId: id, // Keep legacy single ID for now
          pathwayIds: Array.from(new Set([...prev.pathwayIds, id])),
          milestonesAchieved,
          customMilestones
        };
      } else if (field === 'trainingPaths' && !isRemoving) {
        // If no ID provided, try to resolve it
        const resolvedId = resolvePathwayIdFromSelection(item);
        if (resolvedId) {
          return {
            ...prev,
            [field]: newValue,
            pathwayIds: Array.from(new Set([...prev.pathwayIds, resolvedId])),
            milestonesAchieved,
            customMilestones
          }
        }
      } else if (field === 'trainingPaths' && isRemoving) {
        // Rebuild pathway IDs based on remaining selections
        // NOTE: This logic is imperfect if multiple names map to one ID,
        // but Phase 1 goal is to handle the happy path first.
        // Better: we filter pathwayIds by verifying which remaining paths map to them.
        const remainingIds = newValue.map(p => resolvePathwayIdFromSelection(p)).filter(Boolean) as string[];

        return {
          ...prev,
          [field]: newValue,
          pathwayIds: [...new Set(remainingIds)], // Re-sync entirely to be safe
          milestonesAchieved,
          customMilestones
        }
      }


      return {
        ...prev,
        [field]: newValue,
        milestonesAchieved,
        customMilestones
      };
    });
  }, [clearError, validateField, debouncedSetError, getMilestoneNamesForPath, resolvePathwayIdFromSelection]);

  /**
   * Fire-and-forget sync of milestone arrays → relational user_milestones + user_pathways.
   * Runs after the profiles upsert succeeds. Failures are logged, not surfaced to the user.
   */
  const syncToRelationalTables = (
    userId: string,
    milestonesAchieved: string[],
    pathwayIds: string[],
  ) => {
    // Use void to make fire-and-forget explicit
    void (async () => {
      try {
        const client = supabase as any;

        // 1. Resolve pathway codes → UUIDs and fetch their milestones in one query
        const { data: milestoneRows } = await client
          .from('milestones')
          .select('id, name, pathway_id, pathways!inner(code)')
          .in('pathways.code', pathwayIds);

        if (!milestoneRows || milestoneRows.length === 0) return;

        // Build name → milestone ID map (case-insensitive)
        const nameToId = new Map<string, string>();
        for (const m of milestoneRows) {
          nameToId.set(m.name.toLowerCase().trim(), m.id);
        }

        // 2. Fetch current relational state for this user
        const { data: existingRows } = await client
          .from('user_milestones')
          .select('milestone_id, status')
          .eq('user_id', userId);

        const existingMap = new Map<string, string>();
        for (const row of existingRows || []) {
          existingMap.set(row.milestone_id, row.status);
        }

        // 3. Compute target state
        const achievedIds = new Set<string>();

        for (const name of milestonesAchieved) {
          const id = nameToId.get(name.toLowerCase().trim());
          if (id) achievedIds.add(id);
        }

        // 4. Build upserts: done and revert stale 'done' → 'todo'
        const now = new Date().toISOString();
        const upserts: any[] = [];

        for (const milestoneId of achievedIds) {
          upserts.push({
            user_id: userId,
            milestone_id: milestoneId,
            status: 'done',
            completed_at: now,
            updated_at: now,
          });
        }

        // Revert stale: existing 'done' rows whose milestone is NOT in achievedIds
        for (const [milestoneId, status] of existingMap) {
          if (status === 'done' && !achievedIds.has(milestoneId)) {
            upserts.push({
              user_id: userId,
              milestone_id: milestoneId,
              status: 'todo',
              completed_at: null,
              updated_at: now,
            });
          }
        }

        if (upserts.length > 0) {
          await client
            .from('user_milestones')
            .upsert(upserts, { onConflict: 'user_id,milestone_id' });
        }

        // 5. Sync pathway_ids → user_pathways
        const { data: pathwayRows } = await client
          .from('pathways')
          .select('id, code')
          .in('code', pathwayIds);

        if (pathwayRows && pathwayRows.length > 0) {
          const pathwayUpserts = pathwayRows.map((pw: any, i: number) => ({
            user_id: userId,
            pathway_id: pw.id,
            status: 'active',
            is_primary: pathwayIds[0] === pw.code,
          }));
          await client
            .from('user_pathways')
            .upsert(pathwayUpserts, { onConflict: 'user_id,pathway_id' });
        }
      } catch (e) {
        logger.warn('[dual-write] Relational sync failed:', e);
      }
    })();
  };

  // Save to database
  const saveProfile = async (markOnboardingComplete = false): Promise<{ success: boolean; error?: Error | unknown }> => {
    if (!user) return { success: false, error: new Error('User not authenticated') };

    setIsSaving(true);
    try {

      // Clean up pathway_configs: remove scoped data for pathways the user no longer has
      const currentConfigs = profileData?.pathway_configs || {};
      const activeKeys = new Set([...data.pathwayIds, ...data.trainingPaths]);
      const cleanedConfigs = Object.fromEntries(
        Object.entries(currentConfigs).filter(([key]) => activeKeys.has(key))
      );

      const profileUpdateBase = {
        id: user.id,
        display_name: data.displayName || null,
        career_stage: data.careerStage || null,
        current_country: data.currentCountry || null,
        specialties: data.specialties,
        specialty: data.specialties[0] || null, // Keep legacy field in sync
        training_paths: data.trainingPaths,
        graduation_year: data.graduationYear || null,
        milestones_achieved: data.milestonesAchieved,
        years_experience: data.yearsExperience || null,
        additional_context: data.additionalContext || null,
        work_rhythm: data.workRhythm || 'full_time',
        pathway_id: data.pathwayId || null,
        custom_milestones: data.customMilestones as unknown as Json,
        pathway_configs: cleanedConfigs as unknown as Json,
        ...(markOnboardingComplete && { onboarding_completed: true }),
      };

      const profileUpdateWithIds = {
        ...profileUpdateBase,
        pathway_ids: data.pathwayIds || [],
      };

      const isMissingColumnError = (error: any, column: string) => {
        const needle = column.toLowerCase();
        const message = (error?.message || '').toLowerCase();
        const details = (error?.details || '').toLowerCase();
        const hint = (error?.hint || '').toLowerCase();
        const code = String(error?.code || '').toLowerCase();

        return (
          (message.includes(needle) && message.includes('does not exist')) ||
          (details.includes(needle) && details.includes('does not exist')) ||
          (hint.includes(needle) && hint.includes('does not exist')) ||
          code === '42703' ||
          code === 'pgrst204'
        );
      };

      let { error } = await supabase.from('profiles').upsert(profileUpdateWithIds);

      // Safe fallback: if DB doesn't have pathway_ids yet, retry without it.
      if (error && isMissingColumnError(error, 'pathway_ids')) {
        logger.warn('pathway_ids column missing; retrying profile save without it.');
        const fallback = await supabase.from('profiles').upsert(profileUpdateBase);
        error = fallback.error;
      }

      if (error) {
        logger.error('Supabase upsert error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          profileUpdateWithIds,
        });
        return { success: false, error };
      }

      // --- Dual-write: sync milestone state to relational tables (fire-and-forget) ---
      syncToRelationalTables(user.id, data.milestonesAchieved, data.pathwayIds);

      return { success: true };
    } catch (error) {
      logger.error('Error saving profile:', error);
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  const { data: dbSuggestedPaths = [], isError: dbPathsError } = useQuery({
    queryKey: queryKeys.pathways.suggestions(data.specialties),
    enabled: useDbPathways && data.specialties.length > 0,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (data.specialties.length === 0) return [];
      const client = supabase as any;

      const { data: disciplineRows, error: disciplineError } = await client
        .from('disciplines')
        .select('id, name')
        .in('name', data.specialties);

      if (disciplineError) throw disciplineError;

      let disciplineIds = (disciplineRows || []).map((row: { id: string }) => row.id);

      if (disciplineIds.length === 0) {
        const orFilter = data.specialties
          .map((specialty) => `name.ilike.${specialty}`)
          .join(',');
        if (orFilter) {
          const { data: fallbackRows, error: fallbackError } = await client
            .from('disciplines')
            .select('id, name')
            .or(orFilter);
          if (fallbackError) throw fallbackError;
          disciplineIds = (fallbackRows || []).map((row: { id: string }) => row.id);
        }
      }

      if (disciplineIds.length === 0) return [];

      const { data: pathwayRows, error: pathwayError } = await client
        .from('pathways')
        .select('code, name, description, country:countries(name), pathway_disciplines!inner(discipline_id)')
        .eq('status', 'active')
        .in('pathway_disciplines.discipline_id', disciplineIds);

      if (pathwayError) throw pathwayError;

      const mapped = (pathwayRows || []).map((row: { code: string; name: string; description: string | null; country: { name: string } | null }) => ({
        name: row.name,
        category: row.country?.name || 'Other',
        description: row.description ?? undefined,
        pathwayId: row.code,
      })) as CareerPath[];

      return [...new Map(mapped.map((path) => [path.name, path])).values()];
    },
  });

  // Static career path suggestions based on specialties
  const suggestedPaths = useMemo(() => {
    if (data.specialties.length === 0) return [];
    if (useDbPathways && !dbPathsError) {
      return dbSuggestedPaths;
    }
    const allPaths: CareerPath[] = [];
    data.specialties.forEach(spec => {
      allPaths.push(...getCareerPathsForSpecialty(spec));
    });
    // Remove duplicates by name
    return [...new Map(allPaths.map(p => [p.name, p])).values()];
  }, [data.specialties, dbSuggestedPaths, dbPathsError, useDbPathways]);

  // Group paths by category
  const pathsByCategory = useMemo(() => {
    return suggestedPaths.reduce((acc, path) => {
      const category = path.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(path);
      return acc;
    }, {} as Record<string, CareerPath[]>);
  }, [suggestedPaths]);


  return {
    data,
    setData,
    isLoading,
    isSaving,
    errors,
    updateField,
    toggleArrayItem,
    saveProfile,
    validateField,
    validateAll,
    clearError,
    suggestedPaths,
    pathsByCategory,
  };
}
