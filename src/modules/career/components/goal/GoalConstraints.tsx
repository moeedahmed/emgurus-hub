import { useState } from 'react';
import { GoalConstraints as GoalConstraintsType } from '@/modules/career/hooks/useGoals';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronsUpDown, Check, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CommandCustomEmpty } from '@/components/ui/command-custom-empty';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { allCountries, popularDestinationCountries } from '@/modules/career/data/mockData';
import { getExamsForSpecialty, groupExamsByCategory, getAllExams } from '@/modules/career/data/examsBySpecialty';
import { targetAreaOptions, getSmartOrderedCategories, getTargetAreaOption, getOrderedTargetAreas } from '@/modules/career/data/targetAreaOptions';
import { getOrderedTargetRoles } from '@/modules/career/data/targetRoleOptions';
import React from 'react';

type GoalType = 'migrate' | 'advance' | 'expertise' | 'exam';

interface GoalConstraintsProps {
  goalType: GoalType;
  constraints: GoalConstraintsType;
  onChange: (constraints: GoalConstraintsType) => void;
  specialty?: string;
  careerStage?: string;
}

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const OptionButton = React.forwardRef<HTMLButtonElement, OptionButtonProps>(
  ({ selected, onClick, children }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm rounded-full border transition-colors",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
      )}
    >
      {children}
    </button>
  )
);

interface ConstraintSectionProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const ConstraintSection = ({ label, required, children }: ConstraintSectionProps) => (
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground uppercase tracking-wide">
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export function GoalConstraints({ goalType, constraints, onChange, specialty = '', careerStage = '' }: GoalConstraintsProps) {
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [examSearch, setExamSearch] = useState('');

  // Reset exam search when dropdown closes
  const handleExamOpenChange = (open: boolean) => {
    setExamOpen(open);
    if (!open) setExamSearch('');
  };

  // Get exams for the user's specialty by default
  const specialtyExams = getExamsForSpecialty(specialty || '');

  // Get all exams for global search if user is searching
  const allExams = getAllExams();

  const examSearchTerm = examSearch.trim().toLowerCase();
  const filteredExams = examSearchTerm.length > 0
    ? allExams.filter(e =>
      e.name.toLowerCase().includes(examSearchTerm) ||
      e.description?.toLowerCase().includes(examSearchTerm) ||
      e.category.toLowerCase().includes(examSearchTerm)
    )
    : allExams;

  // Show specialty exams by default (if available), otherwise show all.
  // Search always performs a global search across all exams.
  const displayExams = examSearchTerm.length > 0
    ? filteredExams
    : (specialtyExams.length > 0 ? specialtyExams : allExams);
  const examsByCategory = groupExamsByCategory(displayExams);

  // Career role options for advance goal
  const commonRoles = [
    'Consultant',
    'Department Head',
    'Clinical Director',
    'Private Practice',
    'Academic Lead',
    'Training Director',
  ];

  const allRoles = [
    ...commonRoles,
    'Chief Medical Officer',
    'Medical Director',
    'Professor',
    'Research Lead',
    'Unit Lead',
    'Fellowship Director',
    'Associate Director',
    'Senior Clinician',
  ];

  // Toggle behavior: if already selected, unselect by setting to undefined
  const updateConstraint = <K extends keyof GoalConstraintsType>(
    key: K,
    value: GoalConstraintsType[K]
  ) => {
    if (constraints[key] === value) {
      onChange({ ...constraints, [key]: undefined });
    } else {
      onChange({ ...constraints, [key]: value });
    }
  };

  const updateMultiConstraint = (
    key: 'primary_driver' | 'family_situation' | 'study_style',
    value: string
  ) => {
    const current = (constraints[key] || []) as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({
      ...constraints,
      [key]: updated.length > 0 ? updated : undefined,
    } as GoalConstraintsType);
  };

  // Common Timeline Rendering Logic
  const timelineConfig = {
    '3m': { label: '< 3 months' },
    '6m': { label: '3-6 months' },
    '12m': { label: '6-12 months' },
    '2y': { label: '1-2 years' },
    '5y': { label: '2-5 years' },
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      // Clear generic timeline preference when specific date is selected
      const newConstraints = { ...constraints, exam_date: dateStr };
      delete newConstraints.timeline_preference;
      onChange(newConstraints);
    }
  };

  const renderTimelineOptions = (
    key: 'timeline_preference' | 'exam_date',
    allowedKeys: ('3m' | '6m' | '12m' | '2y' | '5y')[],
    sectionLabel: string = "Timeline"
  ) => (
    <ConstraintSection label={sectionLabel}>
      {allowedKeys.map((value) => (
        <OptionButton
          key={value}
          selected={constraints[key] === value}
          onClick={() => {
            // Check if we need to clear specific date (only for exam timeline)
            if (key === 'timeline_preference' && constraints.exam_date) {
              const newConstraints = { ...constraints, [key]: value };
              delete newConstraints.exam_date;
              onChange(newConstraints);
            } else {
              updateConstraint(key, value);
            }
          }}
        >
          {value === '3m' && allowedKeys.includes('5y') ? '< 3 months' :
            value === '3m' ? 'Within 3 months' :
              value === '6m' && allowedKeys.includes('3m') ? '3-6 months' :
                value === '6m' ? 'Within 6 months' :
                  value === '12m' && allowedKeys.includes('3m') ? '6-12 months' :
                    value === '12m' ? 'Within 12 months' :
                      value === '2y' ? '1-2 years' :
                        value === '5y' ? '2-5 years+' : ''}
        </OptionButton>
      ))}
    </ConstraintSection>
  );

  // Get remaining countries (alphabetical, excluding popular ones)
  const remainingCountries = [...allCountries]
    .filter(c => !popularDestinationCountries.includes(c))
    .sort((a, b) => a.localeCompare(b));

  const renderMigrateConstraints = () => (
    <>
      {/* Target Country Dropdown */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Target Destination<span className="text-destructive ml-1">*</span>
        </p>
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-11 font-normal">
              {constraints.target_country || "Select your destination country"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[100]" align="start">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList className="max-h-[225px]">
                <CommandCustomEmpty
                  itemType="country"
                  onAddCustom={(value) => {
                    onChange({ ...constraints, target_country: value });
                    setCountryOpen(false);
                  }}
                />
                <CommandGroup heading="Popular Destinations">
                  {popularDestinationCountries.map((country) => (
                    <CommandItem
                      key={country}
                      value={country}
                      onSelect={() => {
                        onChange({ ...constraints, target_country: country });
                        setCountryOpen(false);
                      }}
                    >
                      {country}
                      {constraints.target_country === country && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="All Countries">
                  {remainingCountries.map((country) => (
                    <CommandItem
                      key={country}
                      value={country}
                      onSelect={() => {
                        onChange({ ...constraints, target_country: country });
                        setCountryOpen(false);
                      }}
                    >
                      {country}
                      {constraints.target_country === country && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <ConstraintSection label="Primary Motivation">
        {(['income', 'training', 'lifestyle', 'safety', 'family'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={(constraints.primary_driver || []).includes(value)}
            onClick={() => updateMultiConstraint('primary_driver', value)}
          >
            {value === 'income' ? 'Better pay' :
              value === 'training' ? 'Training quality' :
                value === 'lifestyle' ? 'Better lifestyle' :
                  value === 'safety' ? 'Personal safety' : 'Family needs'}
          </OptionButton>
        ))}
      </ConstraintSection>

      <ConstraintSection label="Visa Status">
        {(['needs_sponsorship', 'has_work_rights', 'unsure'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.visa_needs === value}
            onClick={() => updateConstraint('visa_needs', value)}
          >
            {value === 'needs_sponsorship' ? 'Needs sponsorship' :
              value === 'has_work_rights' ? 'Has work rights' : 'Unsure'}
          </OptionButton>
        ))}
      </ConstraintSection>

      <ConstraintSection label="Family Situation">
        {(['solo', 'partner', 'children'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={(constraints.family_situation || []).includes(value)}
            onClick={() => {
              const current = constraints.family_situation || [];
              if (value === 'solo') {
                // If selecting solo, clear everything else
                onChange({ ...constraints, family_situation: current.includes('solo') ? undefined : ['solo'] });
              } else {
                // If selecting partner/children, remove solo first
                const base = current.filter(v => v !== 'solo');
                if (base.includes(value)) {
                  const updated = base.filter(v => v !== value);
                  onChange({ ...constraints, family_situation: updated.length > 0 ? updated : undefined });
                } else {
                  onChange({ ...constraints, family_situation: [...base, value] });
                }
              }
            }}
          >
            {value === 'solo' ? 'Solo' :
              value === 'partner' ? 'With partner' : 'With children'}
          </OptionButton>
        ))}
      </ConstraintSection>

      {renderTimelineOptions('timeline_preference', ['3m', '6m', '12m', '2y'])}
    </>
  );

  // Get remaining roles (alphabetical, excluding common ones)
  const remainingRoles = allRoles
    .filter(r => !commonRoles.includes(r))
    .sort((a, b) => a.localeCompare(b));

  // Get smart-ordered flattened roles based on career stage
  const orderedTargetRoles = getOrderedTargetRoles(careerStage);

  const renderAdvanceConstraints = () => (
    <>
      {/* Target Role Dropdown */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Target Role<span className="text-destructive ml-1">*</span>
        </p>
        <Popover open={roleOpen} onOpenChange={setRoleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-11 font-normal">
              {constraints.target_role || "Select your target role"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[100]" align="start">
            <Command>
              <CommandInput placeholder="Search role..." />
              <CommandList className="max-h-[225px]">
                <CommandCustomEmpty
                  itemType="role"
                  onAddCustom={(value) => {
                    onChange({ ...constraints, target_role: value });
                    setRoleOpen(false);
                  }}
                />
                <CommandGroup>
                  {orderedTargetRoles.map((role) => (
                    <CommandItem
                      key={role.value}
                      value={role.label}
                      onSelect={() => {
                        onChange({ ...constraints, target_role: role.value });
                        setRoleOpen(false);
                      }}
                    >
                      {role.label}
                      {constraints.target_role === role.value && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <ConstraintSection label="Current System">
        {(['nhs', 'private', 'academic', 'military'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.current_system === value}
            onClick={() => updateConstraint('current_system', value)}
          >
            {value === 'nhs' ? 'Public' : value.charAt(0).toUpperCase() + value.slice(1)}
          </OptionButton>
        ))}
      </ConstraintSection>

      <ConstraintSection label="Preferred pathway">
        {(['formal', 'independent', 'internal', 'unsure'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.pathway_preference === value}
            onClick={() => updateConstraint('pathway_preference', value)}
          >
            {value === 'formal' ? 'Formal training' :
              value === 'independent' ? 'Independent portfolio' :
                value === 'internal' ? 'Internal promotion' : 'Unsure'}
          </OptionButton>
        ))}
      </ConstraintSection>

      {renderTimelineOptions('timeline_preference', ['6m', '12m', '2y', '5y'])}
    </>
  );

  // Get current target area
  const currentTargetArea = constraints.target_area;

  // Target area dropdown state
  const [targetAreaOpen, setTargetAreaOpen] = useState(false);

  // Get smart-ordered flattened options based on career stage
  const orderedTargetAreas = getOrderedTargetAreas(careerStage);

  const renderExpertiseConstraints = () => (
    <>
      {/* Target Area Dropdown */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Target Area<span className="text-destructive ml-1">*</span>
        </p>
        <Popover open={targetAreaOpen} onOpenChange={setTargetAreaOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-11 font-normal">
              {targetAreaOptions.find(o => o.value === currentTargetArea)?.label || currentTargetArea || "Select your target area"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[100]" align="start">
            <Command>
              <CommandInput placeholder="Search area..." />
              <CommandList className="max-h-[225px]">
                <CommandCustomEmpty
                  itemType="area"
                  onAddCustom={(value) => {
                    onChange({ ...constraints, target_area: value as GoalConstraintsType['target_area'], target_area_other: undefined });
                    setTargetAreaOpen(false);
                  }}
                />
                <CommandGroup>
                  {orderedTargetAreas.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange({ ...constraints, target_area: option.value as GoalConstraintsType['target_area'], target_area_other: undefined });
                        setTargetAreaOpen(false);
                      }}
                    >
                      {option.label}
                      {currentTargetArea === option.value && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Specification input for options that require it (subspecialty, procedural, specialized) */}
      {currentTargetArea && (() => {
        const selectedOption = getTargetAreaOption(currentTargetArea);
        if (!selectedOption?.requiresSpecification) return null;

        return (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Specify {selectedOption.label}
            </p>
            <Input
              placeholder={selectedOption.specificationPlaceholder || 'Please specify...'}
              value={constraints.target_area_other || ''}
              onChange={(e) => onChange({
                ...constraints,
                target_area_other: e.target.value,
              })}
              className="max-w-sm"
            />
          </div>
        );
      })()}

      <ConstraintSection label="Current Proficiency">
        {(['novice', 'intermediate', 'advanced'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.current_proficiency === value}
            onClick={() => updateConstraint('current_proficiency', value)}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </OptionButton>
        ))}
      </ConstraintSection>

      <ConstraintSection label="Desired Outcome">
        {(['qualification', 'fellowship', 'specialist', 'certification'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.certification_goal === value}
            onClick={() => updateConstraint('certification_goal', value)}
          >
            {value === 'qualification' ? 'Formal qualification' :
              value === 'fellowship' ? 'Clinical fellowship' :
                value === 'specialist' ? 'Specialist recognition' : 'Skills certification'}
          </OptionButton>
        ))}
      </ConstraintSection>

      <ConstraintSection label="Training Format">
        {(['fulltime', 'parttime', 'selfstudy'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.training_format === value}
            onClick={() => updateConstraint('training_format', value)}
          >
            {value === 'fulltime' ? 'Full-time' :
              value === 'parttime' ? 'Part-time' : 'Self-study'}
          </OptionButton>
        ))}
      </ConstraintSection>

      {renderTimelineOptions('timeline_preference', ['6m', '12m', '2y', '5y'])}
    </>
  );

  const renderExamConstraints = () => (
    <>
      {/* Target Exam Dropdown */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Target Exam<span className="text-destructive ml-1">*</span>
        </p>
        <Popover open={examOpen} onOpenChange={handleExamOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between h-11 font-normal">
              {constraints.exam_target || "Select your target exam"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[100]" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search exam..."
                value={examSearch}
                onValueChange={setExamSearch}
              />
              <CommandList className="max-h-[225px]">
                <CommandCustomEmpty
                  itemType="exam"
                  onAddCustom={(value) => {
                    onChange({ ...constraints, exam_target: value });
                    setExamOpen(false);
                  }}
                />
                {Object.entries(examsByCategory).map(([category, exams]) => (
                  <CommandGroup key={category} heading={category}>
                    {exams.map((exam) => (
                      <CommandItem
                        key={exam.name}
                        value={exam.name}
                        onSelect={() => {
                          onChange({ ...constraints, exam_target: exam.name });
                          setExamOpen(false);
                        }}
                      >
                        <div className="flex flex-col flex-1">
                          <span>{exam.name}</span>
                          {exam.description && (
                            <span className="text-xs text-muted-foreground">{exam.description}</span>
                          )}
                        </div>
                        {constraints.exam_target === exam.name && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <ConstraintSection label="Attempt Status">
        {(['first', 'retake'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.attempt_status === value}
            onClick={() => updateConstraint('attempt_status', value)}
          >
            {value === 'first' ? 'First attempt' : 'Retaking'}
          </OptionButton>
        ))}
      </ConstraintSection>

      {constraints.attempt_status === 'retake' && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Previous Score</p>
          <Input
            placeholder="e.g., 235, or 'Close Call'..."
            value={constraints.previous_score || ''}
            onChange={(e) => onChange({ ...constraints, previous_score: e.target.value })}
            className="max-w-sm"
          />
        </div>
      )}

      <ConstraintSection label="Study Availability">
        {(['fulltime', 'parttime', 'minimal'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={constraints.study_capacity === value}
            onClick={() => updateConstraint('study_capacity', value)}
          >
            {value === 'fulltime' ? 'Full-time study' :
              value === 'parttime' ? 'Evenings & weekends' : 'Spare moments only'}
          </OptionButton>
        ))}
      </ConstraintSection>

      <ConstraintSection label="Study Style">
        {(['selfstudy', 'course', 'group'] as const).map((value) => (
          <OptionButton
            key={value}
            selected={(constraints.study_style || []).includes(value)}
            onClick={() => updateMultiConstraint('study_style', value)}
          >
            {value === 'selfstudy' ? 'Self-study' :
              value === 'course' ? 'Prep course' : 'Study group'}
          </OptionButton>
        ))}
      </ConstraintSection>

      {renderTimelineOptions('timeline_preference', ['3m', '6m', '12m'], "Timeline")}

      <div className="space-y-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-11 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all",
                !constraints.exam_date?.includes('-') && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {constraints.exam_date && constraints.exam_date.includes('-') ? (
                format(new Date(constraints.exam_date), "PPP")
              ) : (
                <span>Pick a specific exam date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={constraints.exam_date && constraints.exam_date.includes('-') ? new Date(constraints.exam_date) : undefined}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
        <p className="text-[10px] text-muted-foreground italic">
          Selecting a specific date will override generic timeline choices.
        </p>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">Customize your guidance</p>

      <div className="space-y-4">
        {goalType === 'migrate' && renderMigrateConstraints()}
        {goalType === 'advance' && renderAdvanceConstraints()}
        {goalType === 'expertise' && renderExpertiseConstraints()}
        {goalType === 'exam' && renderExamConstraints()}
      </div>
    </div>
  );
}
