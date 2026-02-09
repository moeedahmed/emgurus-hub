import {
  ClipboardCheck,
  Award,
  Mail,
  Briefcase,
  FolderOpen,
  FileText,
  ScrollText,
  FileCheck,
  BookMarked,
  User,
  Send,
  type LucideIcon
} from 'lucide-react';

/**
 * Evidence type families for color coordination
 */
export type EvidenceFamily =
  | 'exam'           // Exam results, test scores
  | 'certificate'    // Certificates, diplomas
  | 'letter'         // Official letters, appointments
  | 'portfolio'      // Portfolios, case logs, CVs
  | 'document'       // Applications, reports
  | 'other';         // Default

export interface EvidenceTypeConfig {
  label: string;           // Display name: "Exam Result"
  icon: LucideIcon;        // Lucide icon component
  family: EvidenceFamily;  // Color family grouping
  badgeVariant: string;    // Tailwind classes for badge
}

/**
 * Maps snake_case evidence types from database to display config
 */
export const EVIDENCE_TYPE_CONFIG: Record<string, EvidenceTypeConfig> = {
  // Exams
  exam_result: {
    label: 'Exam Result',
    icon: ClipboardCheck,
    family: 'exam',
    badgeVariant: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  OET: {
    label: 'OET',
    icon: ClipboardCheck,
    family: 'exam',
    badgeVariant: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  'PLAB Part 1 + Part 2': {
    label: 'PLAB',
    icon: ClipboardCheck,
    family: 'exam',
    badgeVariant: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },

  // Certificates
  certificate: {
    label: 'Certificate',
    icon: Award,
    family: 'certificate',
    badgeVariant: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  registration_certificate: {
    label: 'Registration Cert',
    icon: Award,
    family: 'certificate',
    badgeVariant: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  training_certificate: {
    label: 'Training Cert',
    icon: Award,
    family: 'certificate',
    badgeVariant: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  course_certificate: {
    label: 'Course Cert',
    icon: Award,
    family: 'certificate',
    badgeVariant: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  degree_certificate: {
    label: 'Degree Cert',
    icon: Award,
    family: 'certificate',
    badgeVariant: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },

  // Letters
  appointment_letter: {
    label: 'Appointment Letter',
    icon: Mail,
    family: 'letter',
    badgeVariant: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  employment_letter: {
    label: 'Employment Letter',
    icon: Briefcase,
    family: 'letter',
    badgeVariant: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },

  // Portfolio items
  portfolio: {
    label: 'Portfolio',
    icon: FolderOpen,
    family: 'portfolio',
    badgeVariant: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  case_log: {
    label: 'Case Log',
    icon: FileText,
    family: 'portfolio',
    badgeVariant: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  cv: {
    label: 'CV',
    icon: User,
    family: 'portfolio',
    badgeVariant: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  research_paper: {
    label: 'Research Paper',
    icon: BookMarked,
    family: 'portfolio',
    badgeVariant: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },

  // Documents
  application: {
    label: 'Application',
    icon: Send,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  arcp_outcome: {
    label: 'ARCP Outcome',
    icon: FileCheck,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  appraisal_evidence: {
    label: 'Appraisal Evidence',
    icon: FileCheck,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  assessment_report: {
    label: 'Assessment Report',
    icon: FileCheck,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  verification_report: {
    label: 'Verification Report',
    icon: FileCheck,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  thesis_approval: {
    label: 'Thesis Approval',
    icon: ScrollText,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  'ST3 Entry (from ACCS)': {
    label: 'ST3 Entry',
    icon: FileCheck,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  'ST4 Entry (Direct HST)': {
    label: 'ST4 Entry',
    icon: FileCheck,
    family: 'document',
    badgeVariant: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
};

/**
 * Get config for an evidence type, with fallback
 */
export function getEvidenceTypeConfig(type: string): EvidenceTypeConfig {
  const config = EVIDENCE_TYPE_CONFIG[type];
  if (config) return config;

  // Fallback for unknown types
  return {
    label: formatEvidenceLabel(type),
    icon: FileText,
    family: 'other',
    badgeVariant: 'bg-muted text-muted-foreground',
  };
}

/**
 * Convert snake_case to Title Case
 */
function formatEvidenceLabel(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
