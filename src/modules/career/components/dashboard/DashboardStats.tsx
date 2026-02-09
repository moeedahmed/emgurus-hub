import { motion } from 'framer-motion';
import { Map, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
    activePlans: number;
    dueThisWeek: number;
    profileCompletion: number;
}

export function DashboardStats({ activePlans, dueThisWeek, profileCompletion }: DashboardStatsProps) {
    const stats = [
        {
            label: "Active plans",
            value: activePlans,
            icon: Map,
            color: "primary",
            gradient: "from-primary/20 via-primary/5 to-transparent",
            iconColor: "text-primary",
            iconBg: "bg-primary/10"
        },
        {
            label: "Due this week",
            value: dueThisWeek,
            icon: Clock,
            color: "warning",
            gradient: "from-warning/20 via-warning/5 to-transparent",
            iconColor: "text-warning",
            iconBg: "bg-warning/10"
        },
        {
            label: "Profile",
            value: `${profileCompletion}%`,
            icon: User,
            color: "success",
            gradient: "from-success/20 via-success/5 to-transparent",
            iconColor: "text-success",
            iconBg: "bg-success/10"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={cn(
                        "relative group overflow-hidden bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-5 hover:border-border transition-all duration-300 shadow-sm hover:shadow-md"
                    )}
                >
                    {/* Subtle gradient background effect */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.gradient)} />

                    <div className="relative flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner", stat.iconBg)}>
                            <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-display font-bold tabular-nums">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
