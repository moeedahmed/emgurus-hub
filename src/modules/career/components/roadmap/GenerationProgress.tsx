import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, FileCheck, Sparkles, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { GoalConstraints } from '@/modules/career/hooks/useGoals';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GenerationProgressProps {
  isActive: boolean;
  goalType: 'migrate' | 'advance' | 'expertise' | 'exam';
  targetCountry?: string | null;
  targetRole?: string | null;
  constraints?: GoalConstraints | null;
  specialty?: string | null;
  currentCountry?: string | null;
  hasDocuments: boolean;
}

interface Phase {
  icon: React.ElementType;
  message: string;
  duration: number; // ms
}

// ---------------------------------------------------------------------------
// Country → Regulatory body mapping
// ---------------------------------------------------------------------------

const COUNTRY_REGULATORS: Record<string, string> = {
  'United Kingdom': 'GMC & Royal College',
  'United States': 'ECFMG & ACGME',
  'Canada': 'MCC & Royal College',
  'Australia': 'AMC & AHPRA',
  'Ireland': 'Medical Council of Ireland',
  'India': 'NMC & NBE',
  'Pakistan': 'PMDC & CPSP',
  'Germany': 'Approbation & Landesärztekammer',
  'Singapore': 'SMC & MOH',
  'Saudi Arabia': 'SCFHS',
  'UAE': 'DOH & HAAD',
};

const EXTENDED_MESSAGES = [
  'Almost there — crafting detailed recommendations...',
  'Verifying accuracy of every source...',
  'Complex goals need a bit more time...',
];

// ---------------------------------------------------------------------------
// Phase builder (uses flat props)
// ---------------------------------------------------------------------------

function buildPhases(
  goalType: string,
  targetCountry: string | null | undefined,
  targetRole: string | null | undefined,
  constraints: GoalConstraints | null | undefined,
  specialty: string | null | undefined,
  currentCountry: string | null | undefined,
  hasDocuments: boolean,
): Phase[] {
  const phases: Phase[] = [];
  const country = targetCountry ?? constraints?.target_country;
  const regulator = country ? COUNTRY_REGULATORS[country] : null;

  // 1 — Profile analysis
  phases.push({
    icon: User,
    message: specialty
      ? `Analyzing your ${specialty} profile...`
      : 'Analyzing your profile...',
    duration: 1500,
  });

  // 2 — Regulation search (varies by goal type)
  if (goalType === 'migrate' && currentCountry && country) {
    phases.push({
      icon: Search,
      message: `Researching ${currentCountry} to ${country} pathway requirements...`,
      duration: 2500,
    });
  } else if (goalType === 'exam' && constraints?.exam_target) {
    phases.push({
      icon: Search,
      message: `Finding latest ${constraints.exam_target} requirements...`,
      duration: 2500,
    });
  } else if (regulator) {
    phases.push({
      icon: Search,
      message: `Scanning ${regulator} regulations...`,
      duration: 2500,
    });
  } else {
    phases.push({
      icon: Search,
      message: 'Searching medical regulations...',
      duration: 2500,
    });
  }

  // 3 — Document cross-reference (only if user has documents)
  if (hasDocuments) {
    phases.push({
      icon: FileCheck,
      message: 'Cross-referencing your verified documents...',
      duration: 1000,
    });
  }

  // 4 — AI generation (varies by goal type)
  const genMessages: Record<string, string> = {
    migrate: `Crafting your migration strategy${country ? ` to ${country}` : ''}...`,
    advance: targetRole
      ? `Mapping your path to ${targetRole}...`
      : 'Mapping your career advancement...',
    exam: 'Designing your study plan...',
    expertise: 'Planning your development path...',
  };
  phases.push({
    icon: Sparkles,
    message: genMessages[goalType] ?? 'Building your personalized roadmap...',
    duration: 3000,
  });

  // 5 — Finalizing
  phases.push({
    icon: CheckCircle,
    message: 'Finalizing your personalized steps...',
    duration: 1500,
  });

  return phases;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GenerationProgress({
  isActive,
  goalType,
  targetCountry,
  targetRole,
  constraints,
  specialty,
  currentCountry,
  hasDocuments,
}: GenerationProgressProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [extendedIdx, setExtendedIdx] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases = useMemo(
    () => buildPhases(goalType, targetCountry, targetRole, constraints, specialty, currentCountry, hasDocuments),
    [goalType, targetCountry, targetRole, constraints, specialty, currentCountry, hasDocuments],
  );

  const totalDuration = useMemo(
    () => phases.reduce((sum, p) => sum + p.duration, 0),
    [phases],
  );

  // ---- Phase timer progression ----
  useEffect(() => {
    if (!isActive) {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setCurrentPhase(0);
      setProgress(0);
      setExtendedIdx(-1);
      return;
    }

    let cumulative = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    phases.forEach((phase, i) => {
      cumulative += phase.duration;
      if (i < phases.length - 1) {
        timers.push(
          setTimeout(() => setCurrentPhase(i + 1), cumulative),
        );
      }
    });

    // Enter extended-wait after all phases complete
    timers.push(
      setTimeout(() => setExtendedIdx(0), cumulative),
    );

    timersRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, [isActive, phases]);

  // ---- Extended-wait message cycling (every 3 s) ----
  useEffect(() => {
    if (extendedIdx < 0) return;
    const id = setInterval(() => {
      setExtendedIdx((prev) => (prev + 1) % EXTENDED_MESSAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [extendedIdx >= 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Smooth progress interpolation ----
  useEffect(() => {
    if (!isActive) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / totalDuration, 1);
      // ease-out curve: fast start, slow finish, caps at 95 %
      const eased = 1 - Math.pow(1 - ratio, 2);
      setProgress(Math.min(eased * 95, 95));
    };

    progressRef.current = setInterval(tick, 80);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isActive, totalDuration]);

  // ---- Derived display values ----
  const phase = phases[currentPhase];
  const PhaseIcon = phase?.icon ?? Sparkles;
  const displayMessage =
    extendedIdx >= 0 ? EXTENDED_MESSAGES[extendedIdx] : phase?.message ?? '';

  // ---- Portal overlay ----
  return createPortal(
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl shadow-prominent p-8 mx-4 w-full max-w-sm text-center"
          >
            {/* Animated icon */}
            <div className="flex items-center justify-center mb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={extendedIdx >= 0 ? 'extended' : currentPhase}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <PhaseIcon className="w-7 h-7 text-primary" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Phase message */}
            <div className="h-14 flex items-center justify-center mb-6">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={displayMessage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-display text-lg md:text-xl font-semibold"
                >
                  {displayMessage}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <Progress
              value={progress}
              className="h-1.5 rounded-full mb-3"
              indicatorClassName="transition-all duration-300 ease-out"
            />

            {/* Step counter */}
            <p className="text-xs text-muted-foreground">
              {extendedIdx >= 0
                ? 'Finishing up...'
                : `Step ${currentPhase + 1} of ${phases.length}`}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
