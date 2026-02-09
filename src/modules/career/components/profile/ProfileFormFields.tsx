import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X, ChevronDown, MessageSquare, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CommandCustomEmpty } from '@/components/ui/command-custom-empty';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  careerStageOptions,
  experienceOptions,
  allCountries,
  specialtyOptions,
  workRhythmOptions,
} from '@/modules/career/data/mockData';
import { useVoiceRecording } from '@/modules/career/hooks/useVoiceRecording';
import { type CareerPath, type Milestone } from '@/modules/career/data/careerPathMappings';

// Generate years array
const currentYears = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i));

// ============ Display Name Field ============
interface DisplayNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  showDescription?: boolean;
  error?: string;
}

export function DisplayNameField({ value, onChange, showDescription = true, error }: DisplayNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">What should we call you?</Label>
      <Input
        placeholder="e.g., Dr. Sarah, John"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-11", error && "border-destructive focus-visible:ring-destructive")}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : showDescription ? (
        <p className="text-xs text-muted-foreground">
          This name will be used to personalize your experience
        </p>
      ) : null}
    </div>
  );
}

// ============ Career Stage Field ============
interface CareerStageFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CareerStageField({ value, onChange, error }: CareerStageFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm">Current career stage</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between h-11 font-normal",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <span className="truncate">{value || "Select your stage"}</span>
              <div className="flex items-center gap-2">
                {value && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange("");
                    }}
                    className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                    title="Clear"
                  >
                    <X className="h-4 w-4" />
                  </div>
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search stage..." />
            <CommandList className="max-h-60">
              <CommandCustomEmpty
                itemType="career stage"
                onAddCustom={(val) => {
                  onChange(val);
                  setOpen(false);
                }}
              />
              <CommandGroup>
                {careerStageOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    {option}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ============ Country Field ============
interface CountryFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export function CountryField({ value, onChange, label = "Current country", error }: CountryFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-11 font-normal",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <span className="truncate">{value || "Select your country"}</span>
            <div className="flex items-center gap-2">
              {value && (
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList className="max-h-60">
              <CommandCustomEmpty
                itemType="country"
                onAddCustom={(value) => {
                  onChange(value);
                  setOpen(false);
                }}
              />
              {[...allCountries].sort((a, b) => a.localeCompare(b)).map((country) => (
                <CommandItem
                  key={country}
                  value={country}
                  onSelect={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                >
                  {country}
                  {value === country && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ============ Graduation Year Field ============
interface GraduationYearFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function GraduationYearField({ value, onChange }: GraduationYearFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm">Graduation year</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-11 font-normal">
            <span className="truncate">{value || "Select year"}</span>
            <div className="flex items-center gap-2">
              {value && (
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Type a year..." />
            <CommandList className="max-h-60">
              <CommandCustomEmpty
                itemType="year"
                onAddCustom={(value) => {
                  onChange(value);
                  setOpen(false);
                }}
              />
              <CommandGroup>
                {currentYears.map((year) => (
                  <CommandItem
                    key={year}
                    value={year}
                    onSelect={() => {
                      onChange(year);
                      setOpen(false);
                    }}
                  >
                    {year}
                    {value === year && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============ Specialty Field ============
interface SpecialtyFieldProps {
  values: string[];
  onToggle: (specialty: string) => void;
  error?: string;
}

export function SpecialtyField({ values, onToggle, error }: SpecialtyFieldProps) {
  const [open, setOpen] = useState(false);

  // Track custom specialties (not in standard options)
  const customSpecialties = values.filter(s => !specialtyOptions.includes(s));

  return (
    <div className="space-y-2">
      <Label className="text-sm">Specialties</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-auto min-h-11 text-left font-normal",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <span className="flex-1 truncate">
              {values.length > 0
                ? `${values.length} selected`
                : "Select your specialties"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search specialty..." />
            <CommandList className="max-h-60">
              <CommandCustomEmpty
                itemType="specialty"
                onAddCustom={(value) => {
                  onToggle(value);
                  setOpen(false);
                }}
              />
              {[...specialtyOptions].sort((a, b) => a.localeCompare(b)).map((specialty) => (
                <CommandItem
                  key={specialty}
                  value={specialty}
                  onSelect={() => {
                    onToggle(specialty);
                    setOpen(false);
                  }}
                >
                  {specialty}
                  {values.includes(specialty) && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}

              {customSpecialties.length > 0 && (
                <CommandGroup heading="Your Custom Specialties">
                  {customSpecialties.map((specialty) => (
                    <CommandItem
                      key={specialty}
                      value={specialty}
                      onSelect={() => {
                        onToggle(specialty);
                        setOpen(false);
                      }}
                    >
                      <span>{specialty}</span>
                      <Check className="ml-auto h-4 w-4" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected specialties as removable chips */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
            >
              {specialty}
              <button
                type="button"
                onClick={() => onToggle(specialty)}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ============ Experience Field ============
interface ExperienceFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExperienceField({ value, onChange }: ExperienceFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <Label className="text-sm">Years of experience</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-11 font-normal"
          >
            <span className="truncate">
              {value || "Select experience"}
            </span>
            <div className="flex items-center gap-2">
              {value && (
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search experience..." />
            <CommandList>
              <CommandGroup>
                {experienceOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      // Ensure we set the exact option value, not just the search value
                      const exactValue = experienceOptions.find(o => o.toLowerCase() === currentValue.toLowerCase()) || currentValue;
                      onChange(exactValue);
                      setOpen(false);
                    }}
                  >
                    {option}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============ Work Rhythm Field ============
interface WorkRhythmFieldProps {
  value: string;
  onChange: (value: string) => void;
  showDescription?: boolean;
}

export function WorkRhythmField({ value, onChange, showDescription = true }: WorkRhythmFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm">Working pattern</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-11 font-normal"
          >
            <span className="truncate">
              {value ? (workRhythmOptions.find(o => o.value === value)?.label ||
                // Handle legacy values
                (value === 'full_time' ? 'Full Time (100%)' :
                  value === '80_percent' ? 'Less Than Full Time (80%)' :
                    value === '60_percent' ? 'Less Than Full Time (60%)' :
                      value)
              ) : "Select working pattern"}
            </span>
            <div className="flex items-center gap-2">
              {value && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search or type custom pattern..." />
            <CommandList className="max-h-60">
              <CommandCustomEmpty
                itemType="pattern"
                onAddCustom={(val) => {
                  onChange(val);
                  setOpen(false);
                }}
              />
              <CommandGroup>
                {workRhythmOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      // Because command might lowercase the value, we find the original case from options
                      // or if not found (custom), use as is. But for preset options, use the label/value from source.
                      // Actually CommandItem value matches the search.
                      // Let's use the option.value directly.
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Helper text removed as per user request */}
    </div>
  );
}

// ============ Career Paths Field ============
interface CareerPathsFieldProps {
  values: string[];
  onToggle: (pathName: string, pathwayId?: string) => void;
  pathsByCategory: Record<string, CareerPath[]>;
  suggestedPaths: CareerPath[];
  disabled?: boolean;
  disabledMessage?: string;
}

export function CareerPathsField({
  values,
  onToggle,
  pathsByCategory,
  suggestedPaths,
  disabled = false,
  disabledMessage = "Select specialty first"
}: CareerPathsFieldProps) {
  const [open, setOpen] = useState(false);

  const suggestedPathNames = suggestedPaths.map(p => p.name);
  const customPaths = values.filter(path => !suggestedPathNames.includes(path));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Current career pathways</Label>
      </div>
      <p className="text-xs text-muted-foreground">Select all that apply</p>

      <Popover open={open} onOpenChange={(o) => {
        if (disabled && o) return;
        setOpen(o);
      }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between h-auto min-h-11 text-left font-normal ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <span className="flex-1 truncate">
              {values.length > 0 ? (
                `${values.length} selected`
              ) : disabled ? (
                disabledMessage
              ) : (
                "Select career pathways..."
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search career pathways..." />
            <CommandList className="max-h-60">
              <CommandCustomEmpty
                itemType="career pathway"
                onAddCustom={(value) => {
                  onToggle(value);
                  setOpen(false);
                }}
              />

              {Object.entries(pathsByCategory).map(([category, paths]) => (
                <CommandGroup key={category} heading={category}>
                  {paths.map((path) => (
                    <CommandItem
                      key={path.name}
                      value={path.name}
                      onSelect={() => {
                        onToggle(path.name, path.pathwayId);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col flex-1">
                        <span>{path.name}</span>
                        {path.description && (
                          <span className="text-xs text-muted-foreground">{path.description}</span>
                        )}
                      </div>
                      {values.includes(path.name) && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}

              {customPaths.length > 0 && (
                <CommandGroup heading="Your Custom Paths">
                  {customPaths.map((path) => (
                    <CommandItem
                      key={path}
                      value={path}
                      onSelect={() => {
                        onToggle(path);
                        setOpen(false);
                      }}
                    >
                      <span>{path}</span>
                      <Check className="ml-auto h-4 w-4" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((path) => (
            <span
              key={path}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
            >
              {path}
              <button
                type="button"
                onClick={() => onToggle(path)}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


// ============ Additional Context Field ============
interface AdditionalContextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showIcon?: boolean; // Deprecated but kept for compatibility
  label?: string;
}

export function AdditionalContextField({
  value,
  onChange,
  placeholder = "E.g., I'm a parent balancing work and family, I prefer online learning, I have a visa deadline in 6 months, I have limited budget for courses...",
  label = "Additional context"
}: AdditionalContextFieldProps) {
  const { isRecording, isTranscribing, toggleRecording } = useVoiceRecording({
    onTranscription: (text) => {
      onChange(value ? `${value} ${text}` : text);
    },
  });

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <p className="text-xs text-muted-foreground mb-2">Share anything else that helps personalize your roadmaps</p>

      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] resize-none pr-14"
        />
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          className="absolute right-2 bottom-2"
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

      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-destructive px-1">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          Recording... Click to stop
        </div>
      )}
      {isTranscribing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Transcribing...
        </div>
      )}
    </div>
  );
}
