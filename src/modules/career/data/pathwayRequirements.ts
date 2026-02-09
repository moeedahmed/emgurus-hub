// Pathway type definitions used across the app.
// Data comes from Supabase at runtime; these types define the shape.
// The TypeScript files in src/data/pathways/ are the authoring source
// for the seed generator — they are NOT imported at runtime.

export interface PathwayRequirement {
    name: string;
    category: 'Exam' | 'Registration' | 'Training' | 'Language' | 'Document' | 'Certification';
    isRequired: boolean;
    order: number;
    description?: string;
    evidenceTypes?: string[]; // Document types that prove completion
    resourceUrl?: string;
    alternatives?: string[]; // Alternative requirements that can satisfy this
    dbId?: string; // UUID from milestones table in Supabase
    estimatedDuration?: string; // '30d' | '6mo' | '12mo' | '18mo+'
    costEstimate?: {
        label?: string;
        min: number;
        max?: number | null;
        currency: string;
        note?: string | null;
        source_url?: string | null;
    };
    verificationStatus?: string; // 'manual' | 'ai_validated' | 'ai_unvalidated' | 'community' | 'stale'
    lastVerifiedAt?: string;
}

export interface PathwayDefinition {
    id: string;
    name: string;
    description: string;
    requirements: PathwayRequirement[];
    estimatedDuration: string;
    targetRole: string;
    country?: string;
    matchedVia?: string; // Track original selection if mapped
}

// Helper to get all required requirements for a pathway
export function getRequiredItems(pathway: PathwayDefinition): PathwayRequirement[] {
    return pathway.requirements.filter(r => r.isRequired).sort((a, b) => a.order - b.order);
}
