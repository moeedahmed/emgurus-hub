import { Check, AlertCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { ProfileFormData } from '@/modules/career/hooks/useProfileForm';

interface ChecklistItem {
  id: string;
  label: string;
  isComplete: boolean;
  section: 'who-you-are' | 'background' | 'career-paths';
  importance: 'required' | 'recommended' | 'optional';
}

interface ProfileCompletionChecklistProps {
  profile: ProfileFormData;
  completionPercentage: number;
  onEditSection: (section: 'who-you-are' | 'background' | 'career-paths') => void;
}

export function ProfileCompletionChecklist({
  profile,
  completionPercentage,
  onEditSection
}: ProfileCompletionChecklistProps) {
  const items: ChecklistItem[] = [
    {
      id: 'displayName',
      label: 'Display name',
      isComplete: !!profile.displayName,
      section: 'who-you-are',
      importance: 'required'
    },
    {
      id: 'careerStage',
      label: 'Career stage',
      isComplete: !!profile.careerStage,
      section: 'who-you-are',
      importance: 'required'
    },
    {
      id: 'currentCountry',
      label: 'Current country',
      isComplete: !!profile.currentCountry,
      section: 'who-you-are',
      importance: 'required'
    },
    {
      id: 'specialties',
      label: 'Specialty',
      isComplete: profile.specialties.length > 0,
      section: 'background',
      importance: 'required'
    },
    {
      id: 'graduationYear',
      label: 'Graduation year',
      isComplete: !!profile.graduationYear,
      section: 'background',
      importance: 'recommended'
    },
    {
      id: 'yearsExperience',
      label: 'Years of experience',
      isComplete: !!profile.yearsExperience,
      section: 'background',
      importance: 'recommended'
    },
    {
      id: 'trainingPaths',
      label: 'Career pathways',
      isComplete: profile.trainingPaths.length > 0,
      section: 'career-paths',
      importance: 'recommended'
    },
    {
      id: 'workRhythm',
      label: 'Working pattern',
      isComplete: !!profile.workRhythm,
      section: 'background',
      importance: 'recommended'
    },
    {
      id: 'additionalContext',
      label: 'Additional context',
      isComplete: !!profile.additionalContext,
      section: 'career-paths',
      importance: 'recommended'
    },
  ];

  const groupedItems = {
    required: items.filter(i => i.importance === 'required'),
    recommended: items.filter(i => i.importance === 'recommended'),
    optional: items.filter(i => i.importance === 'optional'),
  };

  const importanceLabels = {
    required: 'Required',
    recommended: 'Recommended',
    optional: 'Optional',
  };

  return (
    <Collapsible>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Progress value={completionPercentage} className="h-1.5" />
          <p className="text-sm text-muted-foreground mt-1">{completionPercentage}% complete</p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            View details
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="pt-4 mt-4 border-t border-border">
        <div className="space-y-4">
          {(['required', 'recommended', 'optional'] as const).map((importance) => {
            const groupItems = groupedItems[importance];
            if (groupItems.length === 0) return null;

            return (
              <div key={importance}>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  {importanceLabels[importance]}
                </p>
                <div className="space-y-1">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {item.isComplete ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-warning" />
                        )}
                        <span className={item.isComplete ? 'text-muted-foreground' : 'font-medium'}>
                          {item.label}
                        </span>
                      </div>
                      {!item.isComplete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditSection(item.section)}
                          className="h-7 text-xs"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
