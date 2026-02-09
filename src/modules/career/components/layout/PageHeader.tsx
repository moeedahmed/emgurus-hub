import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    backUrl?: string;
    onBack?: () => void;
}

export const PageHeader = ({
    title,
    description,
    children,
    className,
    backUrl,
    onBack
}: PageHeaderProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (backUrl) {
            navigate(backUrl);
        }
    };

    return (
        <div className={cn(
            "sticky top-0 z-20 -mt-4 md:-mt-6 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-background/80 backdrop-blur-md border-b border-border/50 mb-6 md:mb-8",
            className
        )}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Desktop: Single row with title + buttons */}
                {/* Mobile: Title row, then buttons row */}
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                    {/* Title Section - always full width on mobile */}
                    <div className="flex items-start gap-3 md:gap-4 min-w-0">
                        {(backUrl || onBack) && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="-ml-2 shrink-0 h-9 w-9"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <div className="min-w-0">
                            <h1 className="page-title leading-tight">{title}</h1>
                            {description && (
                                <p className="text-muted-foreground text-xs md:text-sm">{description}</p>
                            )}
                        </div>
                    </div>
                    {/* Actions - second row on mobile, inline on desktop */}
                    {children && (
                        <div className="flex items-center gap-1.5 md:gap-2 shrink-0 ml-10 lg:ml-0">
                            {children}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
