import { careerPathsBySpecialty, type CareerPath } from '@/modules/career/data/careerPathMappings';
import { type PathwayDefinition } from '@/modules/career/data/pathwayRequirements';

/**
 * Resolves a career pathway name to its official ID from the registry.
 * This bridges the gap between legacy name-based storage and the new ID-based system.
 */
export function resolvePathwayId(pathwayName: string): string | null {
    // 1. Iterate through all specialties in the registry
    for (const specialty of Object.values(careerPathsBySpecialty)) {
        // 2. Find a matching pathway by name
        const match = specialty.find(p => p.name === pathwayName);

        // 3. Return the ID if it exists
        if (match?.pathwayId) {
            return match.pathwayId;
        }
    }

    return null;
}

/**
 * Resolves a pathway ID to its full definition.
 * Useful for hydrating UI from stored IDs.
 */
export function getPathwayById(pathwayId: string): CareerPath | null {
    for (const specialty of Object.values(careerPathsBySpecialty)) {
        const match = specialty.find(p => p.pathwayId === pathwayId);
        if (match) {
            return match;
        }
    }
    return null;
}

/**
 * Checks if a pathway name corresponds to a custom or unknown path.
 * A path is custom if it exists in the user's list but NOT in the registry.
 */
export function isCustomPathway(pathwayName: string): boolean {
    return resolvePathwayId(pathwayName) === null;
}

export type PathwayMatchSource =
    | 'pathway_ids'
    | 'pathway_id'
    | 'name_to_id'
    | 'direct_name'
    | 'fuzzy_name'
    | 'fallback'
    | null;

export interface ResolvePrimaryPathwayInput {
    pathwayIds?: Array<string | null | undefined>;
    pathwayId?: string | null;
    pathwayName?: string | null;
    trainingPaths?: Array<string | null | undefined>;
    specialty?: string | null;
    useFallback?: boolean;
}

export interface ResolvePrimaryPathwayResult {
    pathway: PathwayDefinition | undefined;
    matchedFrom: PathwayMatchSource;
    matchedVia: string | null;
}

function isDevEnv(): boolean {
    try {
        return typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);
    } catch {
        return false;
    }
}

function withMatchedVia(pathway: PathwayDefinition, sourceName: string): PathwayDefinition {
    if (pathway.name === sourceName) return pathway;
    return { ...pathway, matchedVia: sourceName };
}

/**
 * Fuzzy match a pathway name against a provided list of pathways.
 * Handles International Service aliases, UK college name mappings,
 * and specialty-aware legacy string matching.
 *
 * This is called AFTER ID-based and exact-name matching have already failed,
 * so it only handles fuzzy/heuristic cases.
 */
export function fuzzyMatchByNameFromList(
    pathways: PathwayDefinition[],
    name: string,
    specialty?: string | null
): PathwayDefinition | undefined {
    // Strict ID match (handles cases where a name IS an ID)
    const strictIdMatch = pathways.find(p => p.id === name);
    if (strictIdMatch) return strictIdMatch;

    const normalized = name.toLowerCase().trim();

    // Non-training / service post aliases — map to country-specific service pathways
    if (normalized.includes('staff specialist')) {
        return pathways.find(p => p.id === 'service-post-australia');
    }
    if (normalized.includes('hospitalist')) {
        return pathways.find(p => p.id === 'us-img-clinical')
            || pathways.find(p => p.id === 'ca-clinical-associate');
    }
    if (name.includes('NCHD')) {
        return pathways.find(p => p.id === 'ie-nchd-pathway');
    }
    if (normalized.includes('non-academic') || normalized.includes('career medical officer') || normalized.includes('surgical assistant')) {
        return pathways.find(p => p.id === 'service-post-united-kingdom');
    }

    // UK College name -> pathway ID mappings
    if (normalized.includes('jrcptb')) return pathways.find(p => p.id === 'mrcp-imt');
    if (normalized.includes('jcst')) return pathways.find(p => p.id === 'hst-cct');
    if (normalized.includes('rcpch')) return pathways.find(p => p.id === 'mrcpch-cct');
    if (normalized.includes('rcpsych')) return pathways.find(p => p.id === 'mrcpsych-cct');
    if (normalized.includes('rcoa')) return pathways.find(p => p.id === 'rcoa-hst');
    if (normalized.includes('rcr')) return pathways.find(p => p.id === 'frcr-cct');
    if (normalized.includes('rcog')) return pathways.find(p => p.id === 'mrcog-cct');

    // Specialty-aware fuzzy mapping for legacy strings
    if (
        normalized.includes('hst') ||
        normalized.includes('higher specialty') ||
        normalized.includes('run-through') ||
        normalized.includes('accs') ||
        normalized.includes('core training')
    ) {
        const specialtyLower = (specialty || '').toLowerCase();

        if (specialtyLower.includes('emergency')) {
            if (normalized.includes('higher specialty') || normalized === 'hst' || normalized.includes('hst ')) {
                return pathways.find(p => p.id === 'rcem-hst');
            }
            if (normalized.includes('run-through')) {
                return pathways.find(p => p.id === 'rcem-run-through');
            }
            return pathways.find(p => p.id === 'rcem-run-through');
        }
        if (specialtyLower.includes('internal') || specialtyLower.includes('medicine')) {
            return pathways.find(p => p.id === 'mrcp-imt');
        }
        if (specialtyLower.includes('surg')) {
            return pathways.find(p => p.id === 'hst-cct');
        }
        if (specialtyLower.includes('paed') || specialtyLower.includes('pediat')) {
            return pathways.find(p => p.id === 'mrcpch-cct');
        }
        if (specialtyLower.includes('psychiatry')) {
            return pathways.find(p => p.id === 'mrcpsych-cct');
        }
        if (specialtyLower.includes('general practice') || specialtyLower.includes('family medicine') || specialtyLower.includes('gp')) {
            return pathways.find(p => p.id === 'mrcgp-cct');
        }
        if (specialtyLower.includes('anaesthe') || specialtyLower.includes('anesthe')) {
            return pathways.find(p => p.id === 'rcoa-hst');
        }
        if (specialtyLower.includes('radiolo')) {
            return pathways.find(p => p.id === 'frcr-cct');
        }
        if (specialtyLower.includes('obstetric') || specialtyLower.includes('gynaecol') || specialtyLower.includes('gynecol') || specialtyLower.includes('o&g')) {
            return pathways.find(p => p.id === 'mrcog-cct');
        }
        if (normalized.includes('hst') || normalized.includes('higher specialty')) {
            return pathways.find(p => p.id === 'rcem-hst');
        }

        // Substring fallback
        return pathways.find(p =>
            p.name.toLowerCase().includes(normalized) ||
            normalized.includes(p.name.toLowerCase())
        );
    }

    return undefined;
}

function directMatchByNameFromList(
    pathways: PathwayDefinition[],
    pathwayName: string
): PathwayDefinition | undefined {
    const normalized = pathwayName.trim().toLowerCase();
    return pathways.find(p => p.name.toLowerCase() === normalized);
}

function resolveFromNameWithList(
    pathways: PathwayDefinition[],
    pathwayName: string,
    specialty?: string | null
): ResolvePrimaryPathwayResult {
    const mappedId = resolvePathwayId(pathwayName);
    if (mappedId) {
        const byMappedId = pathways.find(p => p.id === mappedId);
        if (byMappedId) {
            return {
                pathway: withMatchedVia(byMappedId, pathwayName),
                matchedFrom: 'name_to_id',
                matchedVia: pathwayName,
            };
        }
    }

    const byDirectName = directMatchByNameFromList(pathways, pathwayName);
    if (byDirectName) {
        return {
            pathway: withMatchedVia(byDirectName, pathwayName),
            matchedFrom: 'direct_name',
            matchedVia: pathwayName,
        };
    }

    const byFuzzyName = fuzzyMatchByNameFromList(pathways, pathwayName, specialty);
    if (byFuzzyName) {
        return {
            pathway: withMatchedVia(byFuzzyName, pathwayName),
            matchedFrom: 'fuzzy_name',
            matchedVia: pathwayName,
        };
    }

    return { pathway: undefined, matchedFrom: null, matchedVia: pathwayName };
}

function getFallbackPathwayFromList(pathways: PathwayDefinition[]): PathwayDefinition | undefined {
    return pathways.find(p => p.id === 'service-post-united-kingdom');
}

export function resolvePrimaryPathwayFromList(
    input: ResolvePrimaryPathwayInput,
    pathways: PathwayDefinition[]
): ResolvePrimaryPathwayResult {
    const dev = isDevEnv();
    const pathwayIds = (input.pathwayIds || []).filter(Boolean) as string[];

    for (const id of pathwayIds) {
        const pathway = pathways.find(p => p.id === id);
        if (pathway) {
            return { pathway, matchedFrom: 'pathway_ids', matchedVia: id };
        }
    }

    if (input.pathwayId) {
        const bySingleId = pathways.find(p => p.id === input.pathwayId);
        if (bySingleId) {
            return { pathway: bySingleId, matchedFrom: 'pathway_id', matchedVia: input.pathwayId };
        }
    }

    if (input.pathwayName) {
        const fromName = resolveFromNameWithList(pathways, input.pathwayName, input.specialty);
        if (fromName.pathway) {
            if (dev && fromName.matchedFrom === 'fuzzy_name') {
                console.warn('[pathwayResolver] Fuzzy match used for pathway name:', input.pathwayName);
            }
            return fromName;
        }
    }

    const trainingPaths = (input.trainingPaths || []).filter(Boolean) as string[];
    for (const tp of trainingPaths) {
        const byId = pathways.find(p => p.id === tp);
        if (byId) {
            return { pathway: byId, matchedFrom: 'pathway_id', matchedVia: tp };
        }
        const fromName = resolveFromNameWithList(pathways, tp, input.specialty);
        if (fromName.pathway) {
            if (dev && fromName.matchedFrom === 'fuzzy_name') {
                console.warn('[pathwayResolver] Fuzzy match used for training path:', tp);
            }
            return fromName;
        }
    }

    if (input.useFallback) {
        const fallback = getFallbackPathwayFromList(pathways);
        if (fallback) {
            if (dev) {
                console.warn('[pathwayResolver] Falling back to international service pathway.');
            }
            return { pathway: fallback, matchedFrom: 'fallback', matchedVia: fallback.id };
        }
    }

    if (dev) {
        console.warn('[pathwayResolver] No pathway resolved from provided input.');
    }

    return { pathway: undefined, matchedFrom: null, matchedVia: null };
}
