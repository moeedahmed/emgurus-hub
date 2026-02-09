import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, type MilestoneCategory } from '@/modules/career/data/categoryConfig';

interface MilestoneCategoryDividerProps {
    category: MilestoneCategory;
    className?: string;
}

export function MilestoneCategoryDivider({ category, className }: MilestoneCategoryDividerProps) {
    const meta = CATEGORY_CONFIG[category];
    const Icon = meta.icon;

    return (
        <div className={cn("flex items-center gap-2 py-1.5", className)}>
            <Icon className={cn("w-3.5 h-3.5 shrink-0", meta.iconColor)} />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap">
                {meta.label}
            </span>
            <div className="flex-1 border-t border-border/60" />
        </div>
    );
}
