// Shared platform types

export interface DoctorProfile {
  id: string;
  fullName: string;
  email: string;
  stage: DoctorStage;
  track: DoctorTrack;
  specialty: string | null;
  goals: Goal[];
  constraints: Record<string, unknown>;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DoctorStage = 
  | 'student'
  | 'foundation'
  | 'core'
  | 'higher'
  | 'consultant'
  | 'img'
  | 'gp';

export type DoctorTrack = 'uk' | 'img' | 'global';

export interface Goal {
  id: string;
  userId: string;
  moduleId: string;
  title: string;
  targetDate: string | null;
  status: 'active' | 'completed' | 'paused';
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface Entitlement {
  id: string;
  userId: string;
  moduleId: string;
  tier: 'free' | 'pro' | 'pro_review';
  validUntil: string | null;
}
