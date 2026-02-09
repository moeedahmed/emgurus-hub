import { motion } from 'framer-motion';
import { TrendingUp, Settings, ArrowRight } from 'lucide-react';
import { usePathwayProgress } from '@/modules/career/hooks/usePathwayProgress';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { useUserMilestones } from '@/modules/career/hooks/useUserMilestones';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';
import { CHART_SERIES_COLORS } from '@/modules/career/lib/chartTheme';

interface ProgressSummaryWidgetProps {
    className?: string;
}

export function ProgressSummaryWidget({ className }: ProgressSummaryWidgetProps) {
    const { data: profile, isLoading: profileLoading } = useProfile();
    const { data: userMilestones } = useUserMilestones();

    const results = usePathwayProgress(
        profile ? {
            pathway_ids: profile.pathway_ids,
            specialty: profile.specialty,
            custom_milestones: profile.custom_milestones,
        } : null,
        userMilestones,
    );

    // Don't show if no pathways selected
    if (profileLoading || !results || results.length === 0) {
        return (
            <div className={cn("bg-card border border-border rounded-xl p-6 flex flex-col", className)}>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest text-[10px]">Career Snapshot</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-4">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                        Select pathways in your profile to track your professional growth.
                    </p>
                    <Button
                        onClick={() => (window.location.href = '/profile')}
                        variant="outline"
                        className="w-full h-12 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                    >
                        Update Profile
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    // Prepare data for Recharts
    // Recharts RadialBar needs data in specific format.
    // For single bar "Gauge" look: we might need a background track data point or use specific Recharts tricks.
    // For now, let's just map correct values.

    // Sort by progress descending for better visual layering (outer to inner usually)
    // Actually for RadialBar, the first item is inner-most usually, depending on implementation.
    // Let's stick to consistent top 3.
    const topPathways = results.slice(0, 3);

    const chartData = topPathways.map((result, index) => ({
        name: result.pathway?.matchedVia || result.pathway?.name || 'Unknown',
        uv: result.percentComplete || 0, // 'uv' is arbitrary key for data
        fill: CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length],
        // We add a 'max' value for the gauge background if needed, but Recharts handles scales.
    }));

    // If only 1 pathway, we want a nice gauge look.
    // We can simulate a background track by adding a "max" data set or using PolarAngleAxis background

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4 }}
            className={cn("group bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all duration-300 flex flex-col h-full", className)}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase tracking-widest text-[10px]">Career Snapshot</h3>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[140px] relative">
                <div className="w-full h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="85%"
                            barSize={12}
                            data={chartData}
                            startAngle={90}
                            endAngle={-270}
                            style={{ shapeRendering: 'geometricPrecision' }}
                        >
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                            />
                            <RadialBar
                                label={{ position: 'insideStart', fill: '#fff', fontSize: '0px' }}
                                background={{ fill: '#eee', opacity: 0.1 }}
                                dataKey="uv"
                                cornerRadius={6}
                                isAnimationActive={true}
                                animationBegin={0}
                                animationDuration={1500}
                                animationEasing="ease-out"
                                style={{ shapeRendering: 'geometricPrecision' }} // Double-force precision
                            />
                            <Tooltip
                                cursor={false}
                                wrapperStyle={{ zIndex: 1000 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-background border border-border px-3 py-2 rounded-lg shadow-lg text-xs max-w-[200px]">
                                                <p className="font-semibold mb-0.5 leading-tight">{data.name}</p>
                                                <p className="text-muted-foreground">{data.uv}% Complete</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>

                    {/* Centered Percentage if Single Pathway */}
                    {chartData.length === 1 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground tracking-tight">{chartData[0].uv}%</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Legend / List */}
            <div className="mt-2 pt-4 border-t border-border/50">
                <div className="space-y-2 mb-4">
                    {chartData.map((d, i) => (
                        <div key={d.name} className="flex justify-between items-start text-xs gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                                <div
                                    className="w-2 h-2 rounded-full shrink-0 mt-1"
                                    style={{ backgroundColor: d.fill }}
                                />
                                <span className="text-muted-foreground leading-tight" title={d.name}>
                                    {d.name}
                                </span>
                            </div>
                            <span className="font-bold font-mono shrink-0">{d.uv}%</span>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={() => (window.location.href = '/pathways')}
                    className="w-full h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all mt-auto"
                >
                    <Settings className="w-4 h-4" />
                    Manage Pathways
                </Button>
            </div>
        </motion.div>
    );
}

