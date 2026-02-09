import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, FileCheck, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PathwayGenerationProgressProps {
  isActive: boolean;
  pathwayName?: string | null;
  country?: string | null;
  specialty?: string | null;
  isRefreshMode?: boolean;
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
  'New Zealand': 'MCNZ',
  'France': 'CNOM',
  'Spain': 'OMC',
  'Italy': 'FNOMCEO',
};

const EXTENDED_MESSAGES = [
  'Almost there — verifying official requirements...',
  'Cross-checking with latest guidelines...',
  'Complex pathways need a bit more time...',
];

// ---------------------------------------------------------------------------
// Phase builder
// ---------------------------------------------------------------------------

function buildPhases(
  pathwayName: string | null | undefined,
  country: string | null | undefined,
  specialty: string | null | undefined,
  isRefreshMode: boolean,
): Phase[] {
  const phases: Phase[] = [];
  const regulator = country ? COUNTRY_REGULATORS[country] : null;

  // 1 — Context analysis
  phases.push({
    icon: MapPin,
    message: isRefreshMode
      ? `Checking for updates to ${pathwayName || 'your pathway'}...`
      : specialty
        ? `Analyzing ${specialty} requirements...`
        : 'Analyzing pathway requirements...',
    duration: 1500,
  });

  // 2 — Regulation search
  if (regulator) {
    phases.push({
      icon: Search,
      message: `Searching ${regulator} official guidelines...`,
      duration: 2500,
    });
  } else if (country) {
    phases.push({
      icon: Search,
      message: `Searching ${country} medical regulations...`,
      duration: 2500,
    });
  } else {
    phases.push({
      icon: Search,
      message: 'Searching official medical regulations...',
      duration: 2500,
    });
  }

  // 3 — Verification
  phases.push({
    icon: FileCheck,
    message: isRefreshMode
      ? 'Comparing with your existing milestones...'
      : 'Verifying requirements from official sources...',
    duration: 1500,
  });

  // 4 — AI generation
  phases.push({
    icon: Sparkles,
    message: isRefreshMode
      ? 'Identifying new requirements...'
      : `Building ${pathwayName || 'your pathway'} milestones...`,
    duration: 2500,
  });

  // 5 — Finalizing
  phases.push({
    icon: CheckCircle,
    message: isRefreshMode
      ? 'Finalizing updates...'
      : 'Finalizing your milestone list...',
    duration: 1500,
  });

  return phases;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PathwayGenerationProgress({
  isActive,
  pathwayName,
  country,
  specialty,
  isRefreshMode = false,
}: PathwayGenerationProgressProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [extendedIdx, setExtendedIdx] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases = useMemo(
    () => buildPhases(pathwayName, country, specialty, isRefreshMode),
    [pathwayName, country, specialty, isRefreshMode],
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
