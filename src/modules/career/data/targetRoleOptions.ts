
export interface TargetRoleOption {
    value: string;
    label: string;
    category: 'Junior' | 'Senior' | 'Leadership' | 'Academic' | 'Other';
}

export const targetRoleOptions: TargetRoleOption[] = [
    // Junior / Trainee Roles
    { value: 'Foundation Doctor', label: 'Foundation Doctor', category: 'Junior' },
    { value: 'House Officer', label: 'House Officer', category: 'Junior' },
    { value: 'Intern', label: 'Intern', category: 'Junior' },
    { value: 'Resident', label: 'Resident', category: 'Junior' },
    { value: 'Senior Resident', label: 'Senior Resident', category: 'Junior' },
    { value: 'Core Trainee', label: 'Core Trainee', category: 'Junior' },
    { value: 'Registrar', label: 'Registrar', category: 'Junior' },
    { value: 'Senior Registrar', label: 'Senior Registrar', category: 'Junior' },
    { value: 'Junior Clinical Fellow', label: 'Junior Clinical Fellow', category: 'Junior' },
    { value: 'Senior Clinical Fellow', label: 'Senior Clinical Fellow', category: 'Junior' },
    { value: 'Fellow', label: 'Fellow', category: 'Junior' },

    // Senior / Consultant Roles
    { value: 'Consultant', label: 'Consultant', category: 'Senior' },
    { value: 'Attending Physician', label: 'Attending Physician', category: 'Senior' },
    { value: 'Specialist', label: 'Specialist', category: 'Senior' },
    { value: 'Staff Physician', label: 'Staff Physician', category: 'Senior' },
    { value: 'Hospitalist', label: 'Hospitalist', category: 'Senior' },
    { value: 'Senior Clinician', label: 'Senior Clinician', category: 'Senior' },
    { value: 'Associate Specialist', label: 'Associate Specialist', category: 'Senior' },
    { value: 'Associate Consultant', label: 'Associate Consultant', category: 'Senior' },
    { value: 'Private Practice', label: 'Private Practice', category: 'Senior' },
    { value: 'Locum Consultant', label: 'Locum Consultant', category: 'Senior' },

    // Leadership Roles
    { value: 'Clinical Director', label: 'Clinical Director', category: 'Leadership' },
    { value: 'Medical Director', label: 'Medical Director', category: 'Leadership' },
    { value: 'Department Head', label: 'Department Head', category: 'Leadership' },
    { value: 'Chief Medical Officer', label: 'Chief Medical Officer', category: 'Leadership' },
    { value: 'Training Director', label: 'Training Director', category: 'Leadership' },
    { value: 'Program Director', label: 'Program Director', category: 'Leadership' },
    { value: 'Service Line Lead', label: 'Service Line Lead', category: 'Leadership' },
    { value: 'Clinical Governance Lead', label: 'Clinical Governance Lead', category: 'Leadership' },
    { value: 'Director of Medical Education', label: 'Director of Medical Education', category: 'Leadership' },
    { value: 'Quality & Safety Lead', label: 'Quality & Safety Lead', category: 'Leadership' },

    // Academic Roles
    { value: 'Academic Lead', label: 'Academic Lead', category: 'Academic' },
    { value: 'Assistant Professor', label: 'Assistant Professor', category: 'Academic' },
    { value: 'Associate Professor', label: 'Associate Professor', category: 'Academic' },
    { value: 'Senior Lecturer', label: 'Senior Lecturer', category: 'Academic' },
    { value: 'Research Lead', label: 'Research Lead', category: 'Academic' },
    { value: 'Education Lead', label: 'Education Lead', category: 'Academic' },
    { value: 'Professor', label: 'Professor', category: 'Academic' },
    { value: 'Fellowship Director', label: 'Fellowship Director', category: 'Academic' },

    // Other Roles
    { value: 'Medical Officer', label: 'Medical Officer', category: 'Other' },
    { value: 'Staff Grade Doctor', label: 'Staff Grade Doctor', category: 'Other' },
    { value: 'Non-Training Service Post', label: 'Non-Training Service Post', category: 'Other' },
];

/**
 * Get ordered target roles based on career stage (smart ordering)
 */
export function getOrderedTargetRoles(careerStage?: string): TargetRoleOption[] {
    const categoryOrder = getCategoryOrderForStage(careerStage);

    // Sort options based on category priority
    return [...targetRoleOptions].sort((a, b) => {
        const aOrder = categoryOrder.indexOf(a.category);
        const bOrder = categoryOrder.indexOf(b.category);
        // Maintain relative order within category if same
        if (aOrder === bOrder) return 0;
        return aOrder - bOrder;
    });
}

function getCategoryOrderForStage(careerStage?: string): string[] {
    if (!careerStage) {
        return ['Junior', 'Senior', 'Leadership', 'Academic', 'Other'];
    }

    const stage = careerStage.toLowerCase();

    // Consultant / Attending / Senior level → Leadership/Senior focus
    if (stage.includes('consultant') || stage.includes('attending') || stage.includes('senior')) {
        return ['Senior', 'Leadership', 'Academic', 'Junior', 'Other'];
    }

    // Academic focus
    if (stage.includes('academic') || stage.includes('research') || stage.includes('professor')) {
        return ['Academic', 'Senior', 'Leadership', 'Junior', 'Other'];
    }

    // Student / Trainee → Junior focus
    if (stage.includes('student') || stage.includes('trainee') || stage.includes('intern') || stage.includes('resident') || stage.includes('registrar')) {
        return ['Junior', 'Senior', 'Academic', 'Leadership', 'Other'];
    }

    // Default
    return ['Junior', 'Senior', 'Leadership', 'Academic', 'Other'];
}
