import {
    ShieldCheck,
    Languages,
    FileText,
    GraduationCap,
    ScrollText,
    Award,
    UserPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Display categories for pathway milestones.
 * 'Career' from raw data is merged into 'Training' at resolve time.
 */
export type MilestoneCategory =
    | 'Registration'
    | 'Language'
    | 'Exam'
    | 'Training'
    | 'Document'
    | 'Certification'
    | 'Custom';

export interface CategoryMeta {
    label: string;
    icon: LucideIcon;
    /** Tailwind text-color class for the icon */
    iconColor: string;
    /** Hex color for inline styles (e.g. category dots) */
    color: string;
    order: number;
}

export const CATEGORY_CONFIG: Record<MilestoneCategory, CategoryMeta> = {
    Registration:  { label: 'Registration',  icon: ShieldCheck,   iconColor: 'text-blue-500',    color: '#3b82f6', order: 1 },
    Language:      { label: 'Language',       icon: Languages,     iconColor: 'text-violet-500',  color: '#8b5cf6', order: 2 },
    Exam:          { label: 'Exams',          icon: FileText,      iconColor: 'text-amber-500',   color: '#f59e0b', order: 3 },
    Training:      { label: 'Training',       icon: GraduationCap, iconColor: 'text-emerald-500', color: '#10b981', order: 4 },
    Document:      { label: 'Documents',      icon: ScrollText,    iconColor: 'text-orange-500',  color: '#f97316', order: 5 },
    Certification: { label: 'Certification',  icon: Award,         iconColor: 'text-yellow-500',  color: '#eab308', order: 6 },
    Custom:        { label: 'Custom',         icon: UserPlus,      iconColor: 'text-sky-500',     color: '#0ea5e9', order: 7 },
};

/** Ordered list of categories for consistent rendering */
export const CATEGORY_ORDER: MilestoneCategory[] = [
    'Registration',
    'Language',
    'Exam',
    'Training',
    'Document',
    'Certification',
    'Custom',
];

/**
 * Maps a raw PathwayRequirement.category value to its display category.
 * 'Career' is merged into 'Training'. Unknown values default to 'Training'.
 */
export function resolveCategory(raw: string | undefined): MilestoneCategory {
    if (!raw) return 'Training';
    if (raw === 'Career') return 'Training';
    if (raw in CATEGORY_CONFIG) return raw as MilestoneCategory;
    return 'Training';
}
