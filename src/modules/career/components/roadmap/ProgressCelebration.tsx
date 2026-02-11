import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressCelebrationProps {
  show: boolean;
  milestone: '50%' | '100%';
  type?: 'pathway' | 'roadmap';
  onComplete?: () => void;
}

const confettiColors = [
  'var(--primary)',
  'var(--accent)',
  'var(--destructive)',
  'var(--ring)',
];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

export function ProgressCelebration({ show, milestone, type = 'pathway', onComplete }: ProgressCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onCompleteRef.current?.();
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay with message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto cursor-pointer"
            onClick={() => {
              setParticles([]);
              onComplete?.();
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-6 shadow-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-4xl mb-3"
              >
                {milestone === '100%' ? '🎉' : '🌟'}
              </motion.div>
              <h2 className="font-display text-xl font-semibold mb-1">
                {milestone === '100%'
                  ? (type === 'roadmap' ? 'Goal Complete!' : 'Pathway Complete!')
                  : 'Halfway There!'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {milestone === '100%'
                  ? 'Amazing work! You\'ve completed all steps.'
                  : 'Great progress! Keep going!'}
              </p>
            </motion.div>
          </motion.div>

          {/* Confetti particles */}
          <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: `${particle.x}vw`,
                  y: '-20px',
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: '110vh',
                  rotate: particle.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: particle.delay,
                  ease: 'easeIn',
                }}
                style={{
                  position: 'absolute',
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
