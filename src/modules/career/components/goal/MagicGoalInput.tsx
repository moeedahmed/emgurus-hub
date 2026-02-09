import { useState } from 'react';
import { Sparkles, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceRecording } from '@/modules/career/hooks/useVoiceRecording';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { handleError } from '@/modules/career/lib/handleError';
import { toast } from 'sonner';
import { GoalConstraints as GoalConstraintsType } from '@/modules/career/hooks/useGoals';
import type { GoalType } from './GoalWizard';

interface AnalysisResult {
  goalType: GoalType;
  constraints: GoalConstraintsType;
  narrative: string;
  confidence: 'high' | 'medium' | 'low';
}

interface MagicGoalInputProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const MagicGoalInput = ({ onAnalysisComplete }: MagicGoalInputProps) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: profile } = useProfile();

  const { isRecording, isTranscribing, toggleRecording } = useVoiceRecording({
    onTranscription: (text) => {
      setInput((prev) => prev ? `${prev} ${text}` : text);
    },
  });

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setError(null);
    setIsAnalyzing(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-goal-intent', {
        body: {
          text: input.trim(),
          userProfile: profile ? {
            career_stage: profile.career_stage,
            specialty: profile.specialty,
            years_experience: profile.years_experience,
            current_country: profile.current_country,
          } : undefined,
        },
      });

      if (fnError) {
        // Supabase puts non-2xx response bodies in fnError.context
        let errorCode: string | undefined;
        let errorMessage: string | undefined;

        try {
          const ctx = (fnError as any).context;
          if (ctx) {
            const body = typeof ctx.json === 'function' ? await ctx.json() : ctx;
            errorCode = body?.code;
            errorMessage = body?.error;
          }
        } catch {
          // Extraction failed, fall through to generic handling
        }

        if (errorCode === 'USAGE_LIMIT_EXCEEDED') {
          toast.error('You\'ve reached your usage limit. Please select a goal type manually.');
          return;
        }
        if (errorCode === 'AUTH_REQUIRED' || errorCode === 'AUTH_INVALID') {
          toast.error(errorMessage || 'Please log in to use this feature.');
          return;
        }

        handleError(fnError, { context: 'MagicGoalInput', userMessage: 'Failed to analyze your goal' });
        setError(errorMessage || 'Failed to analyze your goal. Please try selecting a type manually.');
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (!data?.goalType) {
        setError('Could not determine your goal type. Please try again or select manually.');
        return;
      }

      onAnalysisComplete({
        goalType: data.goalType as GoalType,
        constraints: data.constraints || {},
        narrative: data.narrative || input.trim(),
        confidence: data.confidence || 'medium',
      });
    } catch (err) {
      handleError(err, { context: 'MagicGoalInput', userMessage: 'Failed to analyze goal' });
      setError('Something went wrong. Please try selecting a type manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isDisabled = isAnalyzing || isRecording || isTranscribing;

  return (
    <div className="mb-6">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm font-medium">Describe your goal</p>
        <span className="text-xs text-muted-foreground">(or choose below)</span>
      </div>

      {/* Input area */}
      <div className="relative">
        <Textarea
          placeholder="e.g., I want to move to the UK and pass PLAB, or I need to become a consultant in 2 years..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
          className={`min-h-[120px] resize-none pb-12 transition-all ${isAnalyzing ? 'border-primary/50 animate-pulse' : ''
            }`}
          maxLength={2000}
          disabled={isAnalyzing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && input.trim() && !isDisabled) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
        />

        {/* Mic button inside textarea */}
        <div className="absolute bottom-3 right-3">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            className={`h-8 w-8 shrink-0 rounded-full transition-all ${isRecording ? 'animate-pulse' : 'hover:bg-muted'}`}
            onClick={toggleRecording}
            disabled={isAnalyzing || isTranscribing}
          >
            {isTranscribing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Analyze button below */}
      <div className="flex justify-end mt-2">
        <Button
          size="sm"
          className="shadow-sm"
          onClick={handleAnalyze}
          disabled={!input.trim() || isDisabled}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Start with AI
            </>
          )}
        </Button>
      </div>
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Recording...</span>
        </div>
      )}
      {isTranscribing && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Transcribing...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <p className="text-xs text-destructive mt-1.5">{error}</p>
      )}

      {/* Divider */}
      <div className="relative mt-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or choose a type
          </span>
        </div>
      </div>
    </div>
  );
};
