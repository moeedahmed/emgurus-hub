// Target area options for "Build Expertise" goal type
// Using "Core + Specify" pattern: universal options first, specialized options with free text

export interface TargetAreaOption {
    value: string;
    label: string;
    category: 'Development' | 'Academic' | 'Leadership' | 'Specialized';
    /** If true, selecting this option shows a free text field for specifics */
    requiresSpecification?: boolean;
    /** Placeholder text for the specification field */
    specificationPlaceholder?: string;
}

export const targetAreaOptions: TargetAreaOption[] = [
    // Development (Clinical/Skills)
    {
        value: 'clinical_skills',
        label: 'Clinical skills',
        category: 'Development'
    },
    {
        value: 'procedural',
        label: 'Procedural focus',
        category: 'Development',
        requiresSpecification: true,
        specificationPlaceholder: 'e.g., Central lines, Intubation, Chest drains...'
    },
    {
        value: 'subspecialty',
        label: 'Subspecialty training',
        category: 'Development',
        requiresSpecification: true,
        specificationPlaceholder: 'e.g., Cardiology, Toxicology, Trauma...'
    },
    {
        value: 'point_of_care_ultrasound',
        label: 'Point-of-care ultrasound',
        category: 'Development'
    },
    {
        value: 'critical_care',
        label: 'Critical care / ICU skills',
        category: 'Development'
    },
    {
        value: 'diagnostic_reasoning',
        label: 'Diagnostic reasoning',
        category: 'Development'
    },

    // Academic & Research
    {
        value: 'research',
        label: 'Research & publications',
        category: 'Academic'
    },
    {
        value: 'teaching',
        label: 'Teaching & education',
        category: 'Academic'
    },
    {
        value: 'quality_improvement',
        label: 'Quality improvement',
        category: 'Academic'
    },
    {
        value: 'medical_education',
        label: 'Medical education',
        category: 'Academic'
    },
    {
        value: 'guideline_development',
        label: 'Guideline development',
        category: 'Academic'
    },
    {
        value: 'clinical_trials',
        label: 'Clinical trials & evidence',
        category: 'Academic'
    },

    // Leadership & Management
    {
        value: 'leadership',
        label: 'Clinical leadership',
        category: 'Leadership'
    },
    {
        value: 'management',
        label: 'Healthcare management',
        category: 'Leadership'
    },
    {
        value: 'clinical_operations',
        label: 'Clinical operations',
        category: 'Leadership'
    },
    {
        value: 'service_design',
        label: 'Service design',
        category: 'Leadership'
    },
    {
        value: 'patient_safety',
        label: 'Patient safety & governance',
        category: 'Leadership'
    },

    // Specialized (catch-all with free text)
    {
        value: 'specialized',
        label: 'Specialized area',
        category: 'Specialized',
        requiresSpecification: true,
        specificationPlaceholder: 'e.g., Point-of-care ultrasound, Simulation, Global health...'
    },
    {
        value: 'informatics',
        label: 'Clinical informatics',
        category: 'Specialized'
    },
    {
        value: 'global_health',
        label: 'Global health',
        category: 'Specialized'
    },
    {
        value: 'simulation',
        label: 'Simulation & skills training',
        category: 'Specialized'
    },
    {
        value: 'palliative_care',
        label: 'Palliative care',
        category: 'Specialized'
    },
];

/**
 * Get the display label for a target area value
 */
export function getTargetAreaLabel(value: string): string | undefined {
    return targetAreaOptions.find(o => o.value === value)?.label;
}

/**
 * Get option details by value
 */
export function getTargetAreaOption(value: string): TargetAreaOption | undefined {
    return targetAreaOptions.find(o => o.value === value);
}

/**
 * Group options by category
 */
export function groupTargetAreasByCategory(): Record<string, TargetAreaOption[]> {
    return targetAreaOptions.reduce((acc, option) => {
        const category = option.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(option);
        return acc;
    }, {} as Record<string, TargetAreaOption[]>);
}

/**
 * Get ordered target areas based on career stage (smart ordering)
 * - Trainees/Students: Development first
 * - Consultants/Attendings: Leadership first
 * - Academics: Academic/Research first
 */
export function getOrderedTargetAreas(careerStage?: string): TargetAreaOption[] {
    const categoryOrder = getCategoryOrderForStage(careerStage);

    // Sort options based on category priority
    return [...targetAreaOptions].sort((a, b) => {
        const aOrder = categoryOrder.indexOf(a.category);
        const bOrder = categoryOrder.indexOf(b.category);
        return aOrder - bOrder;
    });
}

/**
 * Get ordered categories with smart ordering for dropdown display
 */
export function getSmartOrderedCategories(careerStage?: string): {
    categories: Record<string, TargetAreaOption[]>;
    categoryOrder: string[];
} {
    const categoryOrder = getCategoryOrderForStage(careerStage);
    const grouped = groupTargetAreasByCategory();

    // Reorder the grouped object based on category priority
    const orderedCategories: Record<string, TargetAreaOption[]> = {};
    for (const cat of categoryOrder) {
        if (grouped[cat]) {
            orderedCategories[cat] = grouped[cat];
        }
    }

    return {
        categories: orderedCategories,
        categoryOrder,
    };
}

function getCategoryOrderForStage(careerStage?: string): string[] {
    if (!careerStage) {
        return ['Development', 'Academic', 'Leadership', 'Specialized'];
    }

    const stage = careerStage.toLowerCase();

    // Consultant / Attending / Senior level → Leadership focus
    if (stage.includes('consultant') || stage.includes('attending') || stage.includes('senior')) {
        return ['Leadership', 'Specialized', 'Academic', 'Development'];
    }

    // Academic / Research focus
    if (stage.includes('academic') || stage.includes('research') || stage.includes('professor')) {
        return ['Academic', 'Specialized', 'Leadership', 'Development'];
    }

    // Default: Trainee / Student / Early career → Development focus
    return ['Development', 'Academic', 'Specialized', 'Leadership'];
}
