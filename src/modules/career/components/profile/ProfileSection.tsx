import { useRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSectionProps {
    title: string;
    description: string;
    icon: LucideIcon;
    variant?: 'primary' | 'success' | 'warning' | 'accent' | 'default';
    children: React.ReactNode;
    action?: React.ReactNode;
    delay?: number;
    className?: string;
}

export function ProfileSection({
    title,
    description,
    icon: Icon,
    variant = 'primary',
    children,
    action,
    delay = 0,
    className
}: ProfileSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    const getVariantStyles = (variant: string) => {
        switch (variant) {
            case 'success': return 'bg-success/10 text-success';
            case 'warning': return 'bg-warning/10 text-warning';
            case 'accent': return 'bg-accent/10 text-accent';
            case 'default': return 'bg-muted text-muted-foreground';
            case 'primary':
            default: return 'bg-primary/10 text-primary';
        }
    };

    return (
        <motion.div
            ref={ref}
            className={cn("bg-card border border-border rounded-lg p-4 md:p-5 mb-4 md:mb-6", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", getVariantStyles(variant))}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children}
        </motion.div>
    );
}
