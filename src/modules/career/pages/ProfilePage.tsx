import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useMediaQuery } from '@/modules/career/hooks/use-media-query';
import { User, Upload, FileText, Trash2, Loader2, Sparkles, MessageSquare, Mic, MicOff, Settings, CreditCard, Shield, Map, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PageTabs, PageTabsList, PageTabsTrigger, PageTabsContent } from '@/modules/career/components/layout/PageTabs';
import { AppLayout } from '@/modules/career/components/layout/AppLayout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { calculateProfileCompletion } from '@/modules/career/hooks/useProfile';
import { z } from 'zod';
import { MOTION } from '@/modules/career/lib/motion';
import { logger } from '@/modules/career/lib/logger';
import { ProfileSection } from '@/modules/career/components/profile/ProfileSection';
import { SubscriptionSection } from '@/modules/career/components/profile/SubscriptionSection';
import { NotificationSettings } from '@/modules/career/components/profile/NotificationSettings';
import { SecuritySettings } from '@/modules/career/components/profile/SecuritySettings';
import { ProfileCompletionChecklist } from '@/modules/career/components/profile/ProfileCompletionChecklist';
import { useVoiceRecording } from '@/modules/career/hooks/useVoiceRecording';
import { useProfileForm } from '@/modules/career/hooks/useProfileForm';
import { PageHeader } from '@/modules/career/components/layout/PageHeader';
import {
  DisplayNameField,
  CareerStageField,
  CountryField,
  GraduationYearField,
  SpecialtyField,
  ExperienceField,
  CareerPathsField,
  AdditionalContextField,
  WorkRhythmField,
} from '@/modules/career/components/profile/ProfileFormFields';
import { PageShell } from '@/modules/career/components/layout/PageShell';

interface ExtractedData {
  examName?: string;
  score?: string;
  date?: string;
  issuingBody?: string;
  institution?: string;
  degree?: string;
  specialty?: string;
  expiryDate?: string;
  registrationNumber?: string;
  [key: string]: string | undefined;
}

interface UserDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string | null;
  created_at: string;
  document_type: string | null;
  extracted_data: ExtractedData | null;
  analysis_status: string;
  analyzed_at: string | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_STORAGE = 5 * 1024 * 1024; // 5MB total
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];


// Removed duplicate imports

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Use shared profile form hook
  const {
    data: profile,
    isLoading: isProfileLoading,
    isSaving,
    errors,
    updateField,
    toggleArrayItem,
    saveProfile,
    validateAll,
    pathsByCategory,
    suggestedPaths,
  } = useProfileForm();

  // Tab state
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'account'>('profile');

  // Handle URL query params for deep-linking to tabs
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'account' || tabParam === 'documents' || tabParam === 'profile') {
      setActiveTab(tabParam as typeof activeTab);
    }
  }, []);

  // Tab order for swipe navigation
  const tabOrder: typeof activeTab[] = ['profile', 'documents', 'account'];

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (direction === 'left' && currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  }, [activeTab]);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  }, [handleSwipe]);

  // Section refs for scroll-to functionality
  const whoYouAreRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const careerPathsRef = useRef<HTMLDivElement>(null);
  const additionalContextRef = useRef<HTMLDivElement>(null);

  const handleEditSection = (section: 'who-you-are' | 'background' | 'career-paths') => {
    const refs = {
      'who-you-are': whoYouAreRef,
      'background': backgroundRef,
      'career-paths': careerPathsRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Document state
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate real profile completion
  const profileComplete = calculateProfileCompletion({
    id: user?.id || '',
    career_stage: profile.careerStage,
    current_country: profile.currentCountry,
    specialty: profile.specialties[0] || null,
    specialties: profile.specialties,
    training_paths: profile.trainingPaths,
    graduation_year: profile.graduationYear,
    milestones_achieved: profile.milestonesAchieved,
    years_experience: profile.yearsExperience,
    display_name: profile.displayName,
    work_rhythm: profile.workRhythm,
    additional_context: profile.additionalContext,
    preferred_countries: null,
    primary_career_goal: null,
    timeline: null,
    language_proficiency: null,
    custom_milestones: null,
    pathway_id: profile.pathwayId,
    pathway_configs: null,
    milestones_in_progress: null,
    onboarding_completed: true,
    created_at: null,
    updated_at: null,
  });

  // Calculate total storage used
  const totalStorageUsed = documents.reduce((acc, doc) => acc + doc.file_size, 0);
  const storageUsedMB = (totalStorageUsed / (1024 * 1024)).toFixed(1);
  const storagePercentage = (totalStorageUsed / MAX_STORAGE) * 100;

  // Fetch documents on mount
  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setIsLoadingDocs(false);
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments((data || []).map(doc => ({
        ...doc,
        extracted_data: doc.extracted_data as ExtractedData | null,
      })));
    } catch (error) {
      logger.error('Error fetching documents:', error);
      toast({ title: 'Error loading documents', variant: 'destructive' });
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;

    const file = files[0];

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF, JPG, or PNG files only.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB.',
        variant: 'destructive'
      });
      return;
    }

    if (totalStorageUsed + file.size > MAX_STORAGE) {
      toast({
        title: 'Storage limit reached',
        description: 'You have reached your 5MB storage limit.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('evidence-vault')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: docData, error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setDocuments(prev => [{
        ...docData,
        extracted_data: docData.extracted_data as ExtractedData | null,
      }, ...prev]);
      toast({ title: 'Document uploaded successfully', description: 'Analyzing document...' });

      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-document', {
          body: {
            documentId: docData.id,
            filePath: filePath,
            mimeType: file.type,
            userId: user?.id,
          },
        });

        if (analysisData?.error && analysisData?.remaining !== undefined) {
          toast({
            title: 'Document analysis quota exceeded',
            description: 'Upgrade to analyze more documents.',
            variant: 'destructive'
          });
          return;
        }

        if (analysisError) {
          logger.error('Analysis error:', analysisError);
        } else {
          fetchDocuments();
          toast({ title: 'Document analyzed successfully' });
        }
      } catch (analysisErr) {
        logger.error('Failed to analyze document:', analysisErr);
      }
    } catch (error) {
      logger.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your document.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDoc = async (doc: UserDocument) => {
    if (!user) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('evidence-vault')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      toast({ title: 'Document deleted' });
    } catch (error) {
      logger.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting your document.',
        variant: 'destructive'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: 'Please sign in to save your profile', variant: 'destructive' });
      return;
    }

    // Validate before saving
    const isValid = validateAll();
    if (!isValid) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const result = await saveProfile();
    if (result.success) {
      toast({ title: 'Profile saved', description: 'Your changes have been saved.' });
    } else {
      const error = result.error as { message?: string; code?: string; details?: string } | undefined;
      const errorMessage = error?.message || 'Unknown error';
      const errorCode = error?.code ? ` (${error.code})` : '';
      const errorDetails = error?.details ? ` - ${error.details}` : '';
      toast({
        title: 'Failed to save profile',
        description: `${errorMessage}${errorCode}${errorDetails}`,
        variant: 'destructive'
      });
    }
  };

  return (
    <AppLayout>
      <PageShell width="wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.ENTRANCE.DURATION }}
        >
          <PageHeader
            title="Your profile settings"
            description="Manage your identity, documents, and account"
          >
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !user}
              className="md:h-10 md:px-4"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Save />
                  <span>Save<span className="hidden sm:inline"> changes</span></span>
                </>
              )}
            </Button>
          </PageHeader>

          <PageTabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
            <PageTabsList>
              <PageTabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </PageTabsTrigger>
              <PageTabsTrigger value="documents" className="gap-2">
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </PageTabsTrigger>
              <PageTabsTrigger value="account" className="gap-2">
                <Settings className="w-4 h-4" />
                <span>Account</span>
              </PageTabsTrigger>
            </PageTabsList>

            <motion.div
              {...(isMobile ? {
                drag: "x" as const,
                dragConstraints: { left: 0, right: 0 },
                dragElastic: 0.2,
                onDragEnd: handleDragEnd,
                className: "touch-none",
              } : {})}
            >
              <PageTabsContent value="profile" className="space-y-6 mt-0">
                {/* Profile Completion - using custom styling as it's a dashboard card */}
                <motion.div
                  className="bg-card border border-border rounded-lg p-4 md:p-5 mb-4 md:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: MOTION.ENTRANCE.DURATION, delay: MOTION.ENTRANCE.STAGGER }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold">
                        {profile.displayName ? `Welcome, ${profile.displayName.split(' ')[0]}` : 'Profile completion'}
                      </h2>
                    </div>
                  </div>
                  <ProfileCompletionChecklist
                    profile={profile}
                    completionPercentage={profileComplete}
                    onEditSection={handleEditSection}
                  />
                </motion.div>

                {/* Section 1: Who You Are */}
                <div ref={whoYouAreRef}>
                  <ProfileSection
                    title="Who you are"
                    description="Basic information about yourself"
                    icon={User}
                    delay={MOTION.ENTRANCE.STAGGER * 2}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <DisplayNameField
                          value={profile.displayName}
                          onChange={(v) => updateField('displayName', v)}
                          error={errors.displayName}
                        />
                      </div>
                      <CareerStageField
                        value={profile.careerStage}
                        onChange={(v) => updateField('careerStage', v)}
                        error={errors.careerStage}
                      />
                      <CountryField
                        value={profile.currentCountry}
                        onChange={(v) => updateField('currentCountry', v)}
                        error={errors.currentCountry}
                      />
                    </div>
                  </ProfileSection>
                </div>

                {/* Section 2: Your Background */}
                <div ref={backgroundRef}>
                  <ProfileSection
                    title="Your background"
                    description="Education and experience details"
                    icon={FileText}
                    variant="success"
                    delay={0.4}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <GraduationYearField
                        value={profile.graduationYear}
                        onChange={(v) => updateField('graduationYear', v)}
                      />
                      <SpecialtyField
                        values={profile.specialties}
                        onToggle={(s) => toggleArrayItem('specialties', s)}
                        error={errors.specialties}
                      />
                      <ExperienceField
                        value={profile.yearsExperience}
                        onChange={(v) => updateField('yearsExperience', v)}
                      />
                      <WorkRhythmField
                        value={profile.workRhythm}
                        onChange={(v) => updateField('workRhythm', v)}
                      />
                    </div>
                  </ProfileSection>
                </div>

                {/* Section 3: Your Career Pathways */}
                <div ref={careerPathsRef}>
                  <ProfileSection
                    title="Career pathways"
                    description="Select your career pathways and share context"
                    icon={Map}
                    variant="warning"
                    delay={0.5}
                  >
                    <div className="space-y-6">
                      <CareerPathsField
                        values={profile.trainingPaths}
                        onToggle={(p, id) => toggleArrayItem('trainingPaths', p, id)}
                        pathsByCategory={pathsByCategory}
                        suggestedPaths={suggestedPaths}
                        disabled={profile.specialties.length === 0}
                      />

                      <AdditionalContextField
                        value={profile.additionalContext}
                        onChange={(v) => updateField('additionalContext', v)}
                      />
                    </div>
                  </ProfileSection>
                </div>


              </PageTabsContent>

              <PageTabsContent value="documents" className="space-y-6 mt-0">
                {/* Evidence Vault */}
                <motion.div
                  className="bg-card border border-border rounded-lg p-4 md:p-5 mb-4 md:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-semibold">Evidence Vault</h2>
                        <p className="text-sm text-muted-foreground">
                          Upload documents for personalized guidance
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{storageUsedMB} / 5 MB</p>
                      <Progress value={storagePercentage} className="h-1 w-20 mt-1" />
                    </div>
                  </div>

                  {/* Upload Zone */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or{' '}
                      <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
                        browse
                      </label>
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
                    {isUploading && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>

                  {/* Document List */}
                  <div className="mt-4 space-y-2">
                    {isLoadingDocs ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Loading documents...
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        No documents uploaded yet
                      </div>
                    ) : (
                      documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {doc.analysis_status === 'processing' ? (
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            ) : (
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{doc.file_name}</p>
                                {doc.document_type && doc.analysis_status === 'completed' && (
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs capitalize">
                                    {doc.document_type.replace('_', ' ')}
                                  </span>
                                )}
                                {doc.analysis_status === 'processing' && (
                                  <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                                    Analyzing...
                                  </span>
                                )}
                                {doc.analysis_status === 'failed' && (
                                  <span className="px-2 py-0.5 bg-destructive/10 text-destructive rounded-full text-xs">
                                    Analysis failed
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                                {doc.extracted_data && Object.keys(doc.extracted_data).length > 0 && (
                                  <>
                                    {doc.extracted_data.examName && ` • ${doc.extracted_data.examName}`}
                                    {doc.extracted_data.score && ` (${doc.extracted_data.score})`}
                                    {doc.extracted_data.date && ` • ${doc.extracted_data.date}`}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteDoc(doc)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </PageTabsContent>

              <PageTabsContent value="account" className="space-y-6 mt-0">
                {/* Subscription */}
                <SubscriptionSection />

                {/* Notifications */}
                <NotificationSettings />

                {/* Security */}
                <SecuritySettings />
              </PageTabsContent>
            </motion.div>
          </PageTabs>
        </motion.div>
      </PageShell>
    </AppLayout>
  );
};

export default ProfilePage;
