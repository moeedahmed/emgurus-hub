import { useState } from 'react';
import { Sparkles, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVoiceRecording } from '@/modules/career/hooks/useVoiceRecording';
import { useProfile } from '@/modules/career/hooks/useProfile';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { toast } from 'sonner';

interface PathwayAnalysisResult {
  country: string;
  specialty?: string;
  suggestedPathwayCode?: string;
  suggestedPathwayName?: string;
  confidence: 'high' | 'medium' | 'low';
}

interface MagicPathwayInputProps {
  onAnalysisComplete: (result: PathwayAnalysisResult) => void;
  disabled?: boolean;
}

export const MagicPathwayInput = ({ onAnalysisComplete, disabled }: MagicPathwayInputProps) => {
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
      const { data, error: fnError } = await supabase.functions.invoke('analyze-pathway-intent', {
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
        // Handle Supabase function errors
        let errorMessage: string | undefined;

        try {
          const ctx = (fnError as any).context;
          if (ctx) {
            const body = typeof ctx.json === 'function' ? await ctx.json() : ctx;
            errorMessage = body?.error;
          }
        } catch {
          // Extraction failed
        }

        console.error('Pathway analysis error:', fnError);
        setError(errorMessage || 'Failed to analyze. Please select manually.');
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      if (!data?.country) {
        setError('Could not determine your location. Please select manually.');
        return;
      }

      onAnalysisComplete({
        country: data.country,
        specialty: data.specialty,
        suggestedPathwayCode: data.suggestedPathwayCode,
        suggestedPathwayName: data.suggestedPathwayName,
        confidence: data.confidence || 'medium',
      });

      // Clear input after successful analysis
      setInput('');
      toast.success(`Detected: ${data.country}${data.specialty ? ` / ${data.specialty}` : ''}`);
    } catch (err) {
      console.error('Pathway analysis error:', err);
      setError('Something went wrong. Please select manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isDisabled = disabled || isAnalyzing || isRecording || isTranscribing;

  return (
    <div className="mb-6">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm font-medium">Describe your situation</p>
        <span className="text-xs text-muted-foreground">(or select below)</span>
      </div>

      {/* Input area */}
      <div className="relative">
        <Textarea
          placeholder="e.g., I'm a surgical trainee in the UK, or I'm a Pakistani doctor wanting to work in Ireland..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
          className={`min-h-[100px] resize-none pb-12 transition-all ${isAnalyzing ? 'border-primary/50 animate-pulse' : ''}`}
          maxLength={1000}
          disabled={isDisabled}
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
            disabled={isDisabled}
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
              Find My Pathway
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
            or select manually
          </span>
        </div>
      </div>
    </div>
  );
};
