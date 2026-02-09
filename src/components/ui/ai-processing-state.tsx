import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AIProcessingStateProps {
    /** Active state - when true, the component renders */
    isActive: boolean;
    /** Display mode */
    mode?: 'inline' | 'overlay' | 'prose';
    /** Custom messages to cycle through. Defaults to standard AI messages. */
    messages?: string[];
    /** Duration per message in ms. Default: 2000 */
    duration?: number;
    /** Custom icon component. Defaults to Sparkles. */
    icon?: React.ElementType;
    /** Additional className for the container */
    className?: string;
}

// ---------------------------------------------------------------------------
// Default Messages
// ---------------------------------------------------------------------------

const DEFAULT_MESSAGES = [
    'Analyzing requirements...',
    'Consulting regulatory context...',
    'Reviewing your profile...',
    'Drafting personalized path...',
    'Almost ready...',
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIProcessingState({
    isActive,
    mode = 'inline',
    messages = DEFAULT_MESSAGES,
    duration = 2000,
    icon: Icon = Sparkles,
    className,
}: AIProcessingStateProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cycle through messages
    useEffect(() => {
        if (!isActive) {
            setCurrentIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, duration);

        return () => clearInterval(interval);
    }, [isActive, messages.length, duration]);

    if (!isActive) return null;

    const currentMessage = messages[currentIndex];

    // Prose mode: minimal text only
    if (mode === 'prose') {
        return (
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentMessage}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className={cn('text-sm text-muted-foreground animate-pulse', className)}
                >
                    {currentMessage}
                </motion.p>
            </AnimatePresence>
        );
    }

    // Inline mode: centered icon + rotating text
    if (mode === 'inline') {
        return (
            <div className={cn('flex flex-col items-center justify-center py-12 space-y-4', className)}>
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative z-10"
                    >
                        <Icon className="w-12 h-12 text-primary" />
                    </motion.div>
                </div>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentMessage}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="text-muted-foreground font-medium text-center"
                    >
                        {currentMessage}
                    </motion.p>
                </AnimatePresence>
            </div>
        );
    }

    // Overlay mode: backdrop blur + card
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm',
                className
            )}
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
                    <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                        <Icon className="w-7 h-7 text-primary" />
                    </motion.div>
                </div>

                {/* Phase message */}
                <div className="h-14 flex items-center justify-center mb-4">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentMessage}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="font-display text-lg md:text-xl font-semibold"
                        >
                            {currentMessage}
                        </motion.h2>
                    </AnimatePresence>
                </div>

                {/* Step counter */}
                <p className="text-xs text-muted-foreground">
                    Step {currentIndex + 1} of {messages.length}
                </p>
            </motion.div>
        </motion.div>
    );
}
