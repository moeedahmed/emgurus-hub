import { z } from 'zod';

export const profileValidationSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100, 'Name must be less than 100 characters'),
  careerStage: z.string().min(1, 'Career stage is required'),
  currentCountry: z.string().min(1, 'Current country is required'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  graduationYear: z.string().optional(),
  trainingPaths: z.array(z.string()).optional(),
  milestonesAchieved: z.array(z.string()).optional(),
  yearsExperience: z.string().optional(),
  additionalContext: z.string().optional(),
  workRhythm: z.string().optional(),
  pathwayId: z.string().optional(),
  pathwayIds: z.array(z.string()).optional(),
  customMilestones: z.array(z.any()).optional(),
});

export type ProfileValidationErrors = Partial<Record<keyof z.infer<typeof profileValidationSchema>, string>>;

// Validate a single field
export function validateField(
  field: keyof z.infer<typeof profileValidationSchema>,
  value: unknown
): string | undefined {
  const fieldSchema = profileValidationSchema.shape[field];
  if (!fieldSchema) return undefined;

  const result = fieldSchema.safeParse(value);
  if (result.success) return undefined;

  return result.error.errors[0]?.message;
}

// Validate all required fields
export function validateAllRequired(data: z.infer<typeof profileValidationSchema>): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  // Only validate required fields
  const requiredFields: (keyof typeof data)[] = ['displayName', 'careerStage', 'currentCountry', 'specialties'];

  for (const field of requiredFields) {
    const error = validateField(field, data[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Check if there are any validation errors
export function hasValidationErrors(errors: ProfileValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
