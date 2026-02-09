import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PageShellProps {
    children: React.ReactNode;
    width?: 'full' | 'wide' | 'focused' | 'reading';
    className?: string;
    animate?: boolean;
}

export const PageShell = ({
    children,
    width = 'wide',
    className,
    animate = true
}: PageShellProps) => {
    const maxWidthClass = {
        full: 'max-w-full',
        wide: 'max-w-7xl',     // 1280px - Dashboard, Admin, Helpers
        focused: 'max-w-5xl',  // 1024px - Profile, Forms
        reading: 'max-w-3xl',  // 768px - Roadmap, Articles
    }[width];

    const content = (
        <div className={cn(
            "w-full mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6",
            maxWidthClass,
            className
        )}>
            {children}
        </div>
    );

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
};
