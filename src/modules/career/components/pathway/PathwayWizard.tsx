import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, TrendingUp, Check, Loader2, MapPin, Sparkles, Star, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfile, useUpdateProfile } from '@/modules/career/hooks/useProfile';
import { useGenerateMilestones, GeneratedMilestone, PathwayMatch, AlternativePathway, AIPathwayMetadata } from '@/modules/career/hooks/useGenerateMilestones';
import { useListPathways, PathwayOption } from '@/modules/career/hooks/useListPathways';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CountryField } from '@/modules/career/components/profile/ProfileFormFields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { specialtyOptions } from '@/modules/career/data/mockData';
import { resolveCategory, CATEGORY_CONFIG } from '@/modules/career/data/categoryConfig';
import { PathwayGenerationProgress } from './PathwayGenerationProgress';
import { MagicPathwayInput } from './MagicPathwayInput';

export interface PathwayWizardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialState?: {
    preSelectedPathway?: string;
    fromOnboarding?: boolean;
  } | null;
}

type WizardStep = 'select' | 'verify';

export const PathwayWizard = ({ onSuccess, onCancel, initialState }: PathwayWizardProps) => {
  // Step state
  const [step, setStep] = useState<WizardStep>('select');

  // Selection state
  const [country, setCountry] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  // Generation state
  const [selectedPathway, setSelectedPathway] = useState<PathwayMatch | null>(null);
  const [milestones, setMilestones] = useState<GeneratedMilestone[]>([]);
  const [alternatives, setAlternatives] = useState<AlternativePathway[]>([]);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshMode, setIsRefreshMode] = useState(false);
  const [refreshDiff, setRefreshDiff] = useState<{ added: number; updated: number; unchanged: number } | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false); // NEW: Track if current pathway is AI-generated
  const [aiPathwayMetadata, setAiPathwayMetadata] = useState<AIPathwayMetadata | null>(null); // NEW: AI pathway metadata

  // Already added pathway handling
  const [alreadyAddedPathway, setAlreadyAddedPathway] = useState<PathwayOption | null>(null);

  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const generateMilestones = useGenerateMilestones();

  // Fetch pathways for current country
  const { data: pathwaysData, isLoading: isLoadingPathways } = useListPathways({
    country,
    specialty,
    showAll: false,
  });
  const pathways = pathwaysData?.pathways || [];
  const similarPathways = pathwaysData?.similar_pathways || [];
  const supportsAiGeneration = pathwaysData?.supports_ai_generation || false;
  const existingPathwayIds = profile?.pathway_ids || [];

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      if (profile.current_country && !country) {
        setCountry(profile.current_country);
      }
      if (profile.specialty && !specialty) {
        setSpecialty(profile.specialty);
      }
      if (profile.milestones_achieved) {
        setCompletedMilestones(new Set(profile.milestones_achieved));
      }
    }
  }, [profile]);

  // Handle pre-selected pathway from initialState
  useEffect(() => {
    if (initialState?.preSelectedPathway) {
      handleGenerate(initialState.preSelectedPathway);
    }
  }, [initialState]);

  // Validation
  const canGenerate = useCallback((): boolean => {
    return !!country && !!selectedPathwayId;
  }, [country, selectedPathwayId]);

  const canSave = useCallback((): boolean => {
    return !!selectedPathway && milestones.length > 0;
  }, [selectedPathway, milestones.length]);

  // Handle magic input result
  const handleMagicAnalysis = (result: {
    country: string;
    specialty?: string;
    suggestedPathwayCode?: string;
    confidence: 'high' | 'medium' | 'low';
  }) => {
    setCountry(result.country);
    if (result.specialty) {
      setSpecialty(result.specialty);
    }
    if (result.suggestedPathwayCode) {
      setSelectedPathwayId(result.suggestedPathwayCode);
    }
  };

  // Handle pathway selection
  const handleSelectPathway = (pathway: PathwayOption) => {
    const alreadyAdded = existingPathwayIds.includes(pathway.code);

    if (alreadyAdded) {
      setAlreadyAddedPathway(pathway);
      return;
    }

    setSelectedPathwayId(pathway.code);
    setAlreadyAddedPathway(null);
  };

  // Generate milestones
  const handleGenerate = async (pathwayCode?: string, customGeneration = false) => {
    const codeToUse = pathwayCode || selectedPathwayId;
    if (!codeToUse && !customGeneration) return;

    setIsGenerating(true);
    setIsRefreshMode(false);
    setRefreshDiff(null);
    setAlreadyAddedPathway(null);

    try {
      const isExistingPathway = codeToUse ? existingPathwayIds.includes(codeToUse) : false;

      const result = await generateMilestones.mutateAsync({
        pathwayId: codeToUse,
        forceRefresh: isExistingPathway,
        generateCustom: customGeneration,
      });

      // Handle AI-generated pathway (new flow)
      if (result.is_ai_generated && result.ai_pathway_metadata) {
        setIsAiGenerated(true);
        setAiPathwayMetadata(result.ai_pathway_metadata);
        setMilestones(result.milestones);
        setSelectedPathway(null); // No pathway in DB yet
        setStep('verify');
        toast.success(`Generated ${result.milestones.length} AI milestones for ${result.ai_pathway_metadata.specialty} in ${result.ai_pathway_metadata.country_name}`);
      }
      // Handle curated pathway (existing flow)
      else if (result.pathway) {
        const pathwayAlreadyAdded = existingPathwayIds.includes(result.pathway.code);
        setIsRefreshMode(pathwayAlreadyAdded);

        if (result.diff) {
          setRefreshDiff(result.diff);
        }

        setIsAiGenerated(false);
        setAiPathwayMetadata(null);
        setSelectedPathway(result.pathway);
        setMilestones(result.milestones);
        setAlternatives(result.alternatives || []);
        setStep('verify');
      }
      // No pathway found
      else {
        setAlternatives(result.alternatives || []);
        if (result.alternatives && result.alternatives.length > 0) {
          toast.info('Please select a pathway from the options below');
        } else {
          toast.error('No matching pathways found. Please check your country and specialty.');
        }
      }
    } catch (error) {
      console.error('Generate milestones error:', error);
      toast.error('Failed to generate milestones. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle milestone completion
  const toggleMilestoneComplete = (milestoneName: string) => {
    setCompletedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneName)) {
        newSet.delete(milestoneName);
      } else {
        newSet.add(milestoneName);
      }
      return newSet;
    });
  };

  // Helper: Resolve category name to UUID
  const resolveCategoryId = async (categoryName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('milestone_categories')
        .select('id')
        .ilike('label', categoryName)
        .limit(1)
        .single();

      if (error || !data) {
        console.warn(`[PathwayWizard] Category "${categoryName}" not found, using null`);
        return null;
      }

      return data.id;
    } catch (err) {
      console.warn(`[PathwayWizard] Error resolving category "${categoryName}":`, err);
      return null;
    }
  };

  // Save pathway
  const handleSave = async () => {
    if (!selectedPathway && !isAiGenerated) return;
    if (!profile?.id) return;

    try {
      // AI-generated pathway: Save to user_pathways and custom_milestones
      if (isAiGenerated && aiPathwayMetadata) {
        // Step 1: Insert user_pathway record
        const { data: userPathway, error: pathwayError } = await supabase
          .from('user_pathways')
          .insert({
            user_id: profile.id,
            pathway_name: aiPathwayMetadata.name,
            pathway_description: aiPathwayMetadata.description,
            country_id: aiPathwayMetadata.country_id,
            specialty: aiPathwayMetadata.specialty,
            is_ai_generated: true,
            generated_at: new Date().toISOString(),
            ai_disclaimer: aiPathwayMetadata.disclaimer,
            status: 'active',
            is_primary: (profile.pathway_ids || []).length === 0,
          })
          .select()
          .single();

        if (pathwayError || !userPathway) {
          throw new Error(pathwayError?.message || 'Failed to save AI pathway');
        }

        // Step 2: Insert custom_milestones
        const milestonesToInsert = await Promise.all(
          milestones.map(async (m, idx) => ({
            user_id: profile.id,
            user_pathway_id: userPathway.id,
            name: m.name,
            description: m.description || '',
            category_id: await resolveCategoryId(m.category),
            display_order: m.display_order || idx,
            is_ai_generated: true,
            generated_at: new Date().toISOString(),
            resource_url: m.resource_url,
            is_required: m.is_required ?? true,
            status: 'todo',
          }))
        );

        const { error: milestonesError } = await supabase
          .from('custom_milestones')
          .insert(milestonesToInsert);

        if (milestonesError) {
          throw new Error(milestonesError.message || 'Failed to save AI milestones');
        }

        toast.success(`Saved AI-generated pathway: ${aiPathwayMetadata.specialty} in ${aiPathwayMetadata.country_name}`);
        onSuccess?.();
        navigate(`/pathways/ai/${userPathway.id}`);
      }
      // Curated pathway: Save to user_pathways and user_milestones
      else if (selectedPathway) {
        // Step 1: Get pathway UUID from code
        const { data: pathway, error: pathwayLookupError } = await supabase
          .from('pathways')
          .select('id')
          .eq('code', selectedPathway.code)
          .single();

        if (pathwayLookupError || !pathway) {
          throw new Error('Pathway not found in database');
        }

        // Step 2: Insert user_pathway record
        const { data: userPathway, error: pathwayError } = await supabase
          .from('user_pathways')
          .insert({
            user_id: profile.id,
            pathway_id: pathway.id,
            status: 'active',
            is_primary: (profile.pathway_ids || []).length === 0,
          })
          .select()
          .single();

        if (pathwayError || !userPathway) {
          // Check if already exists
          if (pathwayError?.code === '23505') {
            toast.info('You are already enrolled in this pathway');
            navigate(`/pathways/${selectedPathway.code}`);
            return;
          }
          throw new Error(pathwayError?.message || 'Failed to save pathway');
        }

        // Step 3: Save completed milestones to user_milestones (if any)
        if (completedMilestones.size > 0) {
          const milestoneIds = milestones
            .filter(m => completedMilestones.has(m.name))
            .map(m => m.id)
            .filter(Boolean);

          if (milestoneIds.length > 0) {
            // Get milestone UUIDs from milestones table
            const { data: dbMilestones } = await supabase
              .from('milestones')
              .select('id, name')
              .eq('pathway_id', pathway.id);

            const milestoneMap = new Map(dbMilestones?.map(m => [m.name, m.id]) || []);

            const userMilestonesToInsert = Array.from(completedMilestones)
              .map(name => milestoneMap.get(name))
              .filter(Boolean)
              .map(milestoneId => ({
                user_id: profile.id,
                milestone_id: milestoneId,
                status: 'done' as const,
                completed_at: new Date().toISOString(),
              }));

            if (userMilestonesToInsert.length > 0) {
              await supabase
                .from('user_milestones')
                .insert(userMilestonesToInsert);
            }
          }
        }

        toast.success('Pathway saved!');
        onSuccess?.();
        navigate(`/pathways/${selectedPathway.code}`);
      }
    } catch (error) {
      console.error('Save pathway error:', error);
      toast.error('Failed to save pathway. Please try again.');
    }
  };

  // Handle back
  const handleBack = () => {
    if (step === 'verify') {
      setStep('select');
      setSelectedPathway(null);
      setMilestones([]);
      setAlternatives([]);
      setRefreshDiff(null);
      setIsRefreshMode(false);
    }
  };

  // Group milestones by category
  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const category = resolveCategory(milestone.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(milestone);
    return acc;
  }, {} as Record<string, GeneratedMilestone[]>);

  const sortedCategories = Object.keys(groupedMilestones).sort(
    (a, b) => (CATEGORY_CONFIG[a as keyof typeof CATEGORY_CONFIG]?.order || 99) -
      (CATEGORY_CONFIG[b as keyof typeof CATEGORY_CONFIG]?.order || 99)
  );

  const progress = step === 'select' ? 50 : 100;

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-start gap-3 mb-2">
          {step === 'verify' && (
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
              {step === 'select' ? "Choose your career pathway" : "Review milestones"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {step === 'select'
                ? "Describe your situation or select your country and pathway"
                : isRefreshMode
                  ? "We checked for updates to your pathway"
                  : "Mark milestones you've already completed"
              }
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-1 mt-4" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-4 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Select */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Magic Input */}
              <MagicPathwayInput
                onAnalysisComplete={handleMagicAnalysis}
                disabled={isGenerating}
              />

              {/* Country & Specialty Fields */}
              <div className="space-y-4">
                <CountryField
                  value={country}
                  onChange={setCountry}
                  label="Country"
                />

                <div className="space-y-2">
                  <Label className="text-sm">Specialty (optional)</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtyOptions.sort().map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Already Added Pathway Message */}
              {alreadyAddedPathway && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium">{alreadyAddedPathway.name}</p>
                        <p className="text-sm text-muted-foreground">You're already tracking this pathway</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onCancel?.();
                            navigate(`/pathways/${alreadyAddedPathway.code}`);
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          View Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleGenerate(alreadyAddedPathway.code)}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Check for Updates
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="link"
                        className="px-0 text-muted-foreground"
                        onClick={() => setAlreadyAddedPathway(null)}
                      >
                        ← Choose different pathway
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pathway Selection */}
              {!alreadyAddedPathway && country && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Pathway</Label>

                  {isLoadingPathways ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : pathways.length === 0 ? (
                    <div className="space-y-4">
                      {/* Similar Pathways Section */}
                      {similarPathways.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>Similar pathways from other countries:</span>
                          </div>
                          <div className="space-y-2">
                            {similarPathways.map((pathway) => {
                              const isSelected = selectedPathwayId === pathway.code;
                              return (
                                <button
                                  key={pathway.id}
                                  onClick={() => setSelectedPathwayId(pathway.code)}
                                  className={cn(
                                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                    isSelected ? "border-primary bg-primary/5" : "border-border"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">{pathway.name}</span>
                                        {pathway.match_reason && (
                                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            {pathway.match_reason}
                                          </span>
                                        )}
                                      </div>
                                      {pathway.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {pathway.description}
                                        </p>
                                      )}
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {pathway.milestone_count} milestones
                                      </p>
                                    </div>
                                    <div
                                      className={cn(
                                        "w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center",
                                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                                      )}
                                    >
                                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* AI Generation Section */}
                      {supportsAiGeneration && (
                        <div className="space-y-3">
                          {similarPathways.length > 0 && (
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or</span>
                              </div>
                            </div>
                          )}
                          <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div>
                                  <p className="font-medium text-sm">Generate with AI</p>
                                  <p className="text-xs text-muted-foreground">
                                    We'll research official requirements for {specialty} in {country} and create a custom pathway for you
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleGenerate(undefined, true)}
                                  disabled={isGenerating}
                                >
                                  {isGenerating ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      Generate Custom Pathway
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fallback message if neither similar pathways nor AI generation available */}
                      {similarPathways.length === 0 && !supportsAiGeneration && (
                        <div className="text-center py-6">
                          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No pathways found for {country}
                            {specialty && ` in ${specialty}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Try selecting a different country or specialty
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pathways.map((pathway) => {
                        const isSelected = selectedPathwayId === pathway.code;
                        const alreadyAdded = existingPathwayIds.includes(pathway.code);

                        return (
                          <button
                            key={pathway.id}
                            onClick={() => handleSelectPathway(pathway)}
                            className={cn(
                              "w-full text-left p-4 rounded-lg border-2 transition-all",
                              "hover:border-primary/50 hover:bg-primary/5",
                              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                              isSelected ? "border-primary bg-primary/5" : "border-border",
                              alreadyAdded && "ring-1 ring-blue-300 dark:ring-blue-700"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">{pathway.name}</span>
                                  {pathway.is_recommended && (
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                      <Star className="w-3 h-3" />
                                      Recommended
                                    </span>
                                  )}
                                  {alreadyAdded && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                      Tracking
                                    </span>
                                  )}
                                </div>
                                {pathway.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {pathway.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {pathway.milestone_count} milestones
                                </p>
                              </div>

                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center",
                                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                                )}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => handleGenerate()}
                  disabled={!canGenerate() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading Milestones...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Load Milestones
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Verify */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Pathway Info */}
              {selectedPathway && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{selectedPathway.name}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      selectedPathway.match_confidence === 'high' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                      selectedPathway.match_confidence === 'medium' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      selectedPathway.match_confidence === 'low' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    )}>
                      {selectedPathway.match_confidence} confidence
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPathway.match_reason}</p>

                  {/* Refresh Diff */}
                  {isRefreshMode && refreshDiff && (
                    <div className={cn(
                      "mt-3 p-4 rounded-lg border",
                      refreshDiff.added > 0
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    )}>
                      {refreshDiff.added > 0 ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">
                            ✓ {refreshDiff.added} new milestone{refreshDiff.added > 1 ? 's' : ''} found!
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Added to your pathway based on latest official guidelines.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            ✓ You're up to date
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            No new requirements found. Your milestone list matches current guidelines.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Milestones */}
              <div className="space-y-4">
                {sortedCategories.map((category) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.color || '#888' }}
                      />
                      {category}
                    </div>
                    <div className="space-y-1 pl-4">
                      {groupedMilestones[category].map((milestone) => (
                        <label
                          key={milestone.name}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <Checkbox
                            checked={completedMilestones.has(milestone.name)}
                            onCheckedChange={() => toggleMilestoneComplete(milestone.name)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{milestone.name}</div>
                            {milestone.description && (
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {milestone.description}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Alternatives */}
              {alternatives.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Not the right pathway? Try:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {alternatives.map((alt) => (
                      <Button
                        key={alt.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerate(alt.id)}
                      >
                        {alt.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4">
                {isRefreshMode ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      onSuccess?.();
                      navigate(`/pathways/${selectedPathway?.code}`);
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                    View My Pathway
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleSave}
                    disabled={!canSave() || updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Pathway
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen progress overlay */}
      <PathwayGenerationProgress
        isActive={isGenerating}
        pathwayName={pathways.find(p => p.code === selectedPathwayId)?.name || selectedPathway?.name}
        country={country}
        specialty={specialty}
        isRefreshMode={isRefreshMode}
      />
    </div>
  );
};
