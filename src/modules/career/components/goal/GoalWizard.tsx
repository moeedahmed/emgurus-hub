import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, TrendingUp, Target, Sparkles, Mic, MicOff, Loader2, GraduationCap, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useCreateGoal, GoalConstraints as GoalConstraintsType } from '@/modules/career/hooks/useGoals';
import { useCreateRoadmap } from '@/modules/career/hooks/useRoadmap';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { useVoiceRecording } from '@/modules/career/hooks/useVoiceRecording';
import { GoalConstraints } from '@/modules/career/components/goal/GoalConstraints';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { toast } from 'sonner';
import { getTargetAreaLabel } from '@/modules/career/data/targetAreaOptions';
import { GenerationProgress } from '@/modules/career/components/roadmap/GenerationProgress';
import { MagicGoalInput } from '@/modules/career/components/goal/MagicGoalInput';
import { AIProcessingState } from '@/components/ui/ai-processing-state';

export type GoalType = 'exam' | 'expertise' | 'advance' | 'migrate';

export interface GoalWizardProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialState?: {
        promotedFromStep?: string;
        parentGoalTitle?: string;
        promotedFromMilestone?: string;
        pathwayContext?: string;
        currentProgress?: string[];
        stepWhy?: string;
        stepHow?: string[];
        completedSteps?: string[];
        autoMagic?: boolean;
    } | null;
}

interface ExtractedGoal {
    targetCountry?: string;
    targetRole?: string;
    timeline: string;
    constraints: string[];
    suggestedPathway?: string;
    confidence?: 'high' | 'medium' | 'low';
}

interface UserDocument {
    id: string;
    file_name: string;
    document_type: string;
    extracted_data: Record<string, unknown>;
    analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
}

const goalTypes = [
    {
        id: 'exam' as GoalType,
        icon: GraduationCap,
        title: 'Pass exam',
        description: 'Prepare for and pass a professional medical examination',
    },
    {
        id: 'expertise' as GoalType,
        icon: Target,
        title: 'Build expertise',
        description: 'Master a subspecialty or develop new clinical skills',
    },
    {
        id: 'advance' as GoalType,
        icon: TrendingUp,
        title: 'Advance career',
        description: 'Climb the ladder in your current location or system',
    },
    {
        id: 'migrate' as GoalType,
        icon: Globe,
        title: 'Migrate abroad',
        description: 'Move to a new country and continue your medical career there',
    },
];

export const GoalWizard = ({ onSuccess, onCancel, initialState }: GoalWizardProps) => {
    const [step, setStep] = useState<'type' | 'narrative'>('type');
    const [selectedType, setSelectedType] = useState<GoalType | null>(null);
    const [narrative, setNarrative] = useState('');
    const [constraints, setConstraints] = useState<GoalConstraintsType>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAnalyzingContext, setIsAnalyzingContext] = useState(() => !!initialState?.autoMagic);
    const [userDocuments, setUserDocuments] = useState<UserDocument[]>([]);
    const [magicConfidence, setMagicConfidence] = useState<'high' | 'medium' | 'low' | null>(null);

    const navigate = useNavigate();
    const { user, session } = useAuth();
    const createGoal = useCreateGoal();
    const createRoadmap = useCreateRoadmap();
    const { data: profile } = useProfile();

    // Fetch user documents for AI context
    useEffect(() => {
        const fetchDocuments = async () => {
            const { data } = await supabase
                .from('user_documents')
                .select('*')
                .eq('analysis_status', 'completed');
            if (data) setUserDocuments(data as unknown as UserDocument[]);
        };
        fetchDocuments();
    }, []);

    // Handle pre-filled state from roadmap step or milestone promotion
    useEffect(() => {
        const state = initialState;
        if (!state) return;

        let contextText = '';

        if (state.promotedFromStep) {
            contextText = state.parentGoalTitle
                ? `This goal was promoted from step: '${state.promotedFromStep}' in your '${state.parentGoalTitle}' roadmap.`
                : `This goal was promoted from step: '${state.promotedFromStep}'.`;

            const details: string[] = [];
            if (state.stepWhy) details.push(`Why: ${state.stepWhy}`);
            if (state.stepHow && state.stepHow.length > 0) {
                details.push(`Steps:\n- ${state.stepHow.join('\n- ')}`);
            }

            if (details.length > 0) {
                contextText += `\n\nContext from original step:\n${details.join('\n\n')}`;
            }

            if (state.completedSteps && state.completedSteps.length > 0) {
                const progressList = state.completedSteps.slice(0, 3).join(', ');
                const moreCount = state.completedSteps.length > 3 ? ` and ${state.completedSteps.length - 3} more` : '';
                contextText += `\n\nProgress so far: I have already completed ${progressList}${moreCount} in this roadmap.`;
            }
        } else if (state.promotedFromMilestone) {
            contextText = `I'm pursuing the '${state.promotedFromMilestone}' milestone`;
            if (state.pathwayContext) {
                contextText += ` as part of my ${state.pathwayContext} pathway`;
            }
            contextText += '.';

            if (state.currentProgress && state.currentProgress.length > 0) {
                const progressList = state.currentProgress.slice(0, 4).join(', ');
                const moreCount = state.currentProgress.length > 4 ? ` and ${state.currentProgress.length - 4} more` : '';
                contextText += `\n\nI have already completed: ${progressList}${moreCount}.`;
            }

            contextText += '\n\nPlease create a roadmap to help me achieve this milestone.';
        }

        if (contextText) {
            setNarrative(contextText);

            // AUTO-MAGIC LOGIC
            if (state.autoMagic) {
                // Force loading state immediately for recycled components
                setIsAnalyzingContext(true);

                if (profile) {
                    supabase.functions.invoke('analyze-goal-intent', {
                        body: {
                            text: contextText,
                            userProfile: {
                                career_stage: profile.career_stage,
                                specialty: profile.specialty,
                                years_experience: profile.years_experience,
                                current_country: profile.current_country,
                            },
                        },
                    }).then(({ data, error }) => {
                        setIsAnalyzingContext(false);
                        if (!error && data && data.goalType) {
                            handleMagicAnalysis({
                                goalType: data.goalType as GoalType,
                                constraints: data.constraints || {},
                                narrative: data.narrative || contextText,
                                confidence: data.confidence || 'medium',
                            });
                        } else {
                            // Extract error message for better UX
                            const errorMsg = error?.message || data?.error || 'Unknown error';
                            console.error('Auto-magic analysis failed:', errorMsg);

                            // Check for rate limit or usage limit errors
                            if (errorMsg.includes('Rate limit') || errorMsg.includes('Usage limit') || errorMsg.includes('busy')) {
                                toast.error('AI is busy. Please wait a moment and try again, or select your goal type manually.');
                            } else {
                                toast.error('Auto-magic analysis failed. Please select your goal type manually.');
                            }
                        }
                    }).catch((err) => {
                        console.error('Auto-magic analysis network error:', err);
                        setIsAnalyzingContext(false);
                        toast.error('Connection error. Please select your goal type manually.');
                    });
                }
            }
        }
    }, [initialState, profile]);

    const { isRecording, isTranscribing, toggleRecording } = useVoiceRecording({
        onTranscription: (text) => {
            setNarrative((prev) => prev ? `${prev} ${text}` : text);
        },
    });

    const handleSelectType = (type: GoalType) => {
        setSelectedType(type);
        setConstraints({});

        const hasPromotedContext = narrative.includes('promoted from step') || narrative.includes("I'm pursuing the");
        if (!hasPromotedContext) {
            setNarrative('');
        }

        setStep('narrative');
    };

    const handleMagicAnalysis = (result: {
        goalType: GoalType;
        constraints: GoalConstraintsType;
        narrative: string;
        confidence: 'high' | 'medium' | 'low';
    }) => {
        setSelectedType(result.goalType);
        setConstraints(result.constraints);
        setNarrative(result.narrative);
        setMagicConfidence(result.confidence);
        setStep('narrative');
    };

    const canGenerate = (): boolean => {
        if (!selectedType) return false;

        switch (selectedType) {
            case 'exam':
                return !!constraints.exam_target?.trim();
            case 'migrate':
                return !!constraints.target_country;
            case 'advance':
                return !!constraints.target_role;
            case 'expertise':
                const currentTargetArea = constraints.target_area || constraints.focus_area;
                if (currentTargetArea === 'other') {
                    return !!constraints.target_area_other?.trim();
                }
                return !!currentTargetArea;
            default:
                return false;
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!selectedType || !canGenerate()) return;

        if (!session?.access_token) {
            toast.error('Please create a free account to generate your roadmap.');
            navigate('/login', { state: { from: window.location.pathname } });
            onCancel?.(); // Close modal if navigated away
            return;
        }

        setIsProcessing(true);

        try {
            const extractedGoal: ExtractedGoal = {
                targetCountry: constraints.target_country,
                targetRole: selectedType === 'exam'
                    ? constraints.exam_target
                    : constraints.target_role,
                timeline: constraints.timeline_preference || constraints.exam_date || '12 months',
                constraints: [],
                suggestedPathway: selectedType === 'exam'
                    ? `${constraints.exam_target} preparation pathway`
                    : selectedType === 'migrate'
                        ? `Migration to ${constraints.target_country}`
                        : selectedType === 'advance'
                            ? `Career advancement to ${constraints.target_role}`
                            : `${constraints.target_area || constraints.subspecialty || 'Expertise'} development`,
                confidence: 'high',
            };

            const currentTargetArea = constraints.target_area || constraints.focus_area;
            const targetAreaDisplay = currentTargetArea === 'other'
                ? constraints.target_area_other
                : currentTargetArea;

            const formatDisplayValue = (value: string): string => {
                return value
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, char => char.toUpperCase());
            };

            let title: string;
            switch (selectedType) {
                case 'migrate':
                    title = constraints.target_country
                        ? `Move to ${formatDisplayValue(constraints.target_country)}`
                        : 'International career move';
                    break;
                case 'advance':
                    title = constraints.target_role
                        ? `Become ${formatDisplayValue(constraints.target_role)}`
                        : 'Career advancement';
                    break;
                case 'exam':
                    title = constraints.exam_target
                        ? `Pass ${formatDisplayValue(constraints.exam_target)}`
                        : 'Exam preparation';
                    break;
                case 'expertise':
                    if (constraints.target_area_other) {
                        title = `Master ${formatDisplayValue(constraints.target_area_other)}`;
                    } else if (targetAreaDisplay && targetAreaDisplay !== 'other') {
                        const areaLabel = getTargetAreaLabel(targetAreaDisplay);
                        title = areaLabel ? `Master ${areaLabel}` : `Master ${formatDisplayValue(targetAreaDisplay)}`;
                    } else {
                        title = 'Build clinical expertise';
                    }
                    break;
                default:
                    title = 'Career goal';
            }

            const goal = await createGoal.mutateAsync({
                type: selectedType,
                title,
                narrative,
                target_country: constraints.target_country || extractedGoal.targetCountry,
                target_role: extractedGoal.targetRole,
                timeline: extractedGoal.timeline,
                constraints,
            });

            const { data: roadmapData, error: roadmapError } = await supabase.functions.invoke('generate-roadmap', {
                body: {
                    extractedGoal,
                    goalType: selectedType,
                    constraints,
                    narrative,
                    profile: profile ? {
                        career_stage: profile.career_stage,
                        current_country: profile.current_country,
                        specialty: profile.specialty,
                        years_experience: profile.years_experience,
                        milestones_achieved: profile.milestones_achieved,
                        training_paths: profile.training_paths,
                        preferred_countries: profile.preferred_countries,
                        graduation_year: profile.graduation_year,
                        primary_career_goal: profile.primary_career_goal,
                        language_proficiency: profile.language_proficiency,
                    } : null,
                    userDocuments: userDocuments.map(doc => ({
                        file_name: doc.file_name,
                        document_type: doc.document_type,
                        extracted_data: doc.extracted_data,
                        analysis_status: doc.analysis_status,
                    })),
                }
            });

            if (roadmapError) {
                console.error('Roadmap generation error:', roadmapError);
                toast.error('Failed to generate roadmap. Please try again.');
                return;
            }

            if (roadmapData?.code === 'USAGE_LIMIT_EXCEEDED') {
                toast.error('You\'ve reached your roadmap limit. Upgrade to generate more.');
                return;
            }

            const generatedNodes = roadmapData?.nodes || [];

            await createRoadmap.mutateAsync({
                goal_id: goal.id,
                title: `${title} Pathway`,
                pathway: extractedGoal.suggestedPathway || 'Personalized career pathway',
                nodes: generatedNodes,
            });

            toast.success('Roadmap created successfully!');

            onSuccess?.();
            navigate(`/roadmap/${goal.id}`);

        } catch (err) {
            console.error('Error creating roadmap:', err);
            toast.error('Failed to create roadmap. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBack = () => {
        if (step === 'narrative') {
            setStep('type');
            setSelectedType(null);
            setConstraints({});
            setMagicConfidence(null);
        }
    };

    const progress = step === 'type' ? 50 : 100;

    return (
        <div className="flex flex-col h-full min-h-0 bg-background">
            {/* Header - now part of the content flow */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-start gap-3 mb-2">
                    {step === 'narrative' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="-ml-2 mt-0.5 shrink-0 hover:bg-muted"
                            onClick={handleBack}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold tracking-tight">
                            {step === 'type' ? "What's your career goal?" : "Tell us about your goal"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {step === 'type'
                                ? "Describe your goal or choose a type below"
                                : "Customize your guidance options"
                            }
                        </p>
                    </div>
                </div>
                <Progress value={progress} className="h-1 mt-4" />
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-4 pb-8">
                <AnimatePresence mode="wait">
                    {step === 'type' && (
                        <motion.div
                            key="type"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Loading state for Auto-Magic */}
                            {isAnalyzingContext ? (
                                <AIProcessingState
                                    isActive={isAnalyzingContext}
                                    mode="inline"
                                    messages={[
                                        'Analyzing context...',
                                        'Reviewing your profile...',
                                        'Identifying goal type...',
                                        'Drafting constraints...',
                                        'Almost ready...',
                                    ]}
                                    duration={1800}
                                />
                            ) : (
                                <>
                                    {/* Magic Input — hidden when opened from promotion context */}
                                    {!initialState?.promotedFromStep && !initialState?.promotedFromMilestone && (
                                        <MagicGoalInput onAnalysisComplete={handleMagicAnalysis} />
                                    )}

                                    <div className="space-y-3">
                                        {goalTypes.map((goal) => (
                                            <motion.button
                                                key={goal.id}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleSelectType(goal.id)}
                                                className="w-full text-left bg-card border border-border rounded-lg p-4 card-hover"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                                        <goal.icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold mb-1 text-sm">{goal.title}</h3>
                                                        <p className="text-muted-foreground text-xs">{goal.description}</p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {step === 'narrative' && selectedType && (
                        <motion.div
                            key="narrative"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="space-y-6">
                                {magicConfidence === 'low' && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            We weren't fully sure about some choices. Please review and adjust the options below before generating.
                                        </p>
                                    </div>
                                )}

                                <GoalConstraints
                                    goalType={selectedType}
                                    constraints={constraints}
                                    onChange={setConstraints}
                                    careerStage={profile?.career_stage || ''}
                                    specialty={profile?.specialty || ''}
                                />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Additional Context</p>
                                    </div>

                                    <div className="relative">
                                        <Textarea
                                            placeholder={
                                                selectedType === 'exam' ? 'Example: I want to pass PLAB in 3 months, focused on clinical scenarios...' :
                                                    selectedType === 'migrate' ? 'Example: I\'m a resident in Pakistan looking to move to the UK NHS...' :
                                                        selectedType === 'advance' ? 'Example: I want to become a consultant in the next 2 years...' :
                                                            'Example: I want to develop expertise in point-of-care ultrasound...'
                                            }
                                            value={narrative}
                                            onChange={(e) => setNarrative(e.target.value)}
                                            className="min-h-[100px] resize-none pr-14"
                                        />
                                        <Button
                                            type="button"
                                            variant={isRecording ? "destructive" : "outline"}
                                            size="icon"
                                            className="absolute right-2 bottom-2 h-8 w-8"
                                            onClick={toggleRecording}
                                            disabled={isTranscribing}
                                        >
                                            {isTranscribing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : isRecording ? (
                                                <MicOff className="w-4 h-4" />
                                            ) : (
                                                <Mic className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        className="w-full"
                                        onClick={handleGenerateRoadmap}
                                        disabled={isProcessing || !canGenerate()}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Generate Roadmap
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Full-screen progress overlay (portal) */}
            {selectedType && (
                <GenerationProgress
                    isActive={isProcessing}
                    goalType={selectedType}
                    targetCountry={constraints.target_country}
                    targetRole={constraints.target_role}
                    constraints={constraints}
                    specialty={profile?.specialty}
                    currentCountry={profile?.current_country}
                    hasDocuments={!!(profile?.milestones_achieved?.length)}
                />
            )}
        </div>
    );
};
