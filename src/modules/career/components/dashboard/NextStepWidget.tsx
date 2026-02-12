import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoals } from '@/modules/career/hooks/useGoals';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/modules/career/lib/queryKeys';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS } from '@/modules/career/lib/chartTheme';

interface NextStepWidgetProps {
    className?: string;
    goals?: any[];
    isLoading?: boolean;
}

interface RoadmapNode {
    id: string;
    title: string;
    status: string;
    goal_id: string;
}

const TYPE_LABELS: Record<string, string> = {
    migrate: 'Migration',
    advance: 'Career Advancement',
    expertise: 'Skill Acquisition',
    exam: 'Exam Preparation'
};

export function NextStepWidget({ className, goals: propGoals, isLoading: propLoading }: NextStepWidgetProps) {
    const navigate = useNavigate();
    const { data: hookGoals = [], isLoading: hookLoading } = useGoals();

    // Support both prop and hook-based data fetching
    const goals = propGoals || hookGoals;
    const goalsLoading = propLoading !== undefined ? propLoading : hookLoading;

    const activeGoals = goals.filter((g) => g.status === 'active');
    const goalIds = activeGoals.map(g => g.id);

    // Second: Fetch first non-completed step across all active goals
    const { data: nextStep, isLoading: stepLoading } = useQuery({
        queryKey: queryKeys.nextStep.byGoals(goalIds),
        queryFn: async () => {
            if (goalIds.length === 0) return null;

            // Simple, atomic fetch: Get first incomplete node across ALL active goal roadmaps
            const { data, error } = await supabase
                .from('roadmap_nodes')
                .select(`
                    id, 
                    title, 
                    status, 
                    roadmap:roadmaps!inner(goal_id)
                `)
                .in('roadmap.goal_id', goalIds)
                .neq('status', 'completed')
                .order('order_index', { ascending: true })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error fetching next step:', error);
                throw error;
            }

            if (!data) return null;

            return {
                id: data.id,
                title: data.title,
                status: data.status,
                goal_id: (data.roadmap as unknown as { goal_id: string }).goal_id
            } as RoadmapNode;
        },
        enabled: goalIds.length > 0,
        retry: 1,
    });

    // Only block main render on GOALS loading, not Next Step loading
    const isLoading = goalsLoading;

    // Loading state - Skeleton to match layout
    if (isLoading) {
        return (
            <div className={cn("bg-card border border-border rounded-xl p-6 h-full flex flex-col", className)}>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-4 flex-1">
                    <div className="h-8 w-full bg-muted animate-pulse rounded" />
                    <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
                </div>
            </div>
        );
    }

    // No active goals - prompt to create
    if (activeGoals.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={cn("group bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 transition-all duration-300 flex flex-col overflow-hidden", className)}
            >
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest text-[10px]">Active Goals</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        Define your first career milestone to build a tailored AI roadmap.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/goal')}
                    className="w-full h-12 text-sm font-semibold shadow-sm hover:shadow-md transition-all mt-auto"
                >
                    Create Your First Goal
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </motion.div>
        );
    }

    // Aggregate data for chart
    const goalCounts = activeGoals.reduce((acc, goal) => {
        const type = goal.type || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(goalCounts).map(([type, value]) => ({
        name: type,
        value,
        label: TYPE_LABELS[type] || 'Other'
    }));

    const totalGoals = activeGoals.length;

    // Determine Primary Action
    const handlePrimaryAction = () => {
        if (nextStep) {
            navigate(`/career/roadmap/${nextStep.goal_id}`);
        } else {
            navigate('/career/goals');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={cn("group bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all duration-300 flex flex-col h-full", className)}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest text-[10px]">
                        {nextStep ? 'Active Focus' : 'Goal Distribution'}
                    </h3>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[140px] relative">
                <div className="w-full h-[160px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[entry.name as keyof typeof CHART_COLORS] || CHART_COLORS.muted}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                wrapperStyle={{ zIndex: 1000 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-background border border-border px-3 py-2 rounded-lg shadow-lg text-xs">
                                                <p className="font-semibold mb-0.5">{data.label}</p>
                                                <p className="text-muted-foreground">{data.value} {data.value === 1 ? 'Goal' : 'Goals'}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                        <span className="text-3xl font-bold text-foreground">{totalGoals}</span>
                        <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-medium">Active</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {chartData.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5 overflow-hidden">
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: CHART_COLORS[d.name as keyof typeof CHART_COLORS] || CHART_COLORS.muted }}
                            />
                            <span className="text-xs text-muted-foreground truncate" title={d.label}>
                                {d.label}
                            </span>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={handlePrimaryAction}
                    disabled={stepLoading}
                    className="w-full h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all mt-auto"
                >
                    {stepLoading ? (
                        <span className="opacity-70">Loading...</span>
                    ) : nextStep ? (
                        <span className="truncate">Resume: {nextStep.title}</span>
                    ) : (
                        <><Settings className="w-4 h-4" />Manage Goals</>
                    )}
                    {!stepLoading && nextStep && <Play className="w-3 h-3 fill-current" />}
                </Button>
            </div>
        </motion.div>

    );
}

