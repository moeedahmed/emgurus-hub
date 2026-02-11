import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthProvider';
import { supabase } from '@/core/auth/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, ArrowRight, Check, Stethoscope, Globe, GraduationCap,
  Calendar, Clock, Target, Briefcase 
} from 'lucide-react';

type Track = 'uk' | 'img' | 'global';
type Stage = 'student' | 'foundation' | 'core' | 'higher' | 'consultant' | 'img_pathway' | 'other';

const TRACKS = [
  { id: 'uk' as Track, label: 'UK Trainee', desc: 'Training in the UK system', icon: '🇬🇧' },
  { id: 'img' as Track, label: 'IMG', desc: 'International Medical Graduate moving to UK', icon: Globe },
  { id: 'global' as Track, label: 'Global', desc: 'Medical professional anywhere in the world', icon: GraduationCap },
];

const STAGES: Record<Track, { id: Stage; label: string }[]> = {
  uk: [
    { id: 'student', label: 'Medical Student' },
    { id: 'foundation', label: 'Foundation (FY1/FY2)' },
    { id: 'core', label: 'Core / IMT / CT' },
    { id: 'higher', label: 'Higher Specialty (ST3+)' },
    { id: 'consultant', label: 'Consultant / GP' },
  ],
  img: [
    { id: 'student', label: 'Medical Student' },
    { id: 'img_pathway', label: 'Planning to Move to UK' },
    { id: 'foundation', label: 'In Foundation / MTI' },
    { id: 'core', label: 'In Core Training' },
    { id: 'higher', label: 'In Higher Specialty Training' },
    { id: 'consultant', label: 'Consultant / Specialist' },
  ],
  global: [
    { id: 'student', label: 'Medical Student' },
    { id: 'foundation', label: 'Junior Doctor / Intern' },
    { id: 'core', label: 'Resident / Registrar' },
    { id: 'higher', label: 'Senior Registrar / Fellow' },
    { id: 'consultant', label: 'Consultant / Attending' },
    { id: 'other', label: 'Other' },
  ],
};

const SPECIALTIES = [
  'Emergency Medicine',
  'Internal Medicine',
  'Surgery (General)',
  'Paediatrics',
  'Obstetrics & Gynaecology',
  'Anaesthetics',
  'Psychiatry',
  'Radiology',
  'General Practice',
  'Cardiology',
  'Respiratory Medicine',
  'Neurology',
  'Orthopaedics',
  'ENT',
  'Ophthalmology',
  'Dermatology',
  'Haematology',
  'Oncology',
  'Intensive Care',
  'Public Health',
  'Pathology',
  'Undecided',
  'Other',
];

const GOALS = [
  { id: 'cct', label: 'UK CCT', desc: 'Certificate of Completion of Training' },
  { id: 'cesr', label: 'CESR / Portfolio', desc: 'Specialist Registration via Portfolio' },
  { id: 'frcem', label: 'FRCEM Only', desc: 'Exam completion' },
  { id: 'sas', label: 'SAS / Specialty Doctor', desc: 'Permanent Staff Grade' },
  { id: 'undecided', label: 'Undecided', desc: 'Exploring options' },
];

const RHYTHMS = [
  { id: 'full_time', label: 'Full Time (100%)' },
  { id: 'ltft_80', label: 'LTFT 80%' },
  { id: 'ltft_60', label: 'LTFT 60%' },
  { id: 'ltft_50', label: 'LTFT 50%' },
  { id: 'locum', label: 'Locum / Bank' },
];

const TIMELINES = [
  { id: 'asap', label: 'ASAP / This Year' },
  { id: '1_year', label: '1-2 Years' },
  { id: '3_years', label: '3-5 Years' },
  { id: 'flexible', label: 'Flexible / Long term' },
];

const TOTAL_STEPS = 5;

export function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name?.split(' ')[0] || ''
  );
  // Step 2 & 3
  const [track, setTrack] = useState<Track | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  // Step 4
  const [specialty, setSpecialty] = useState<string | null>(null);
  // Step 5
  const [gradYear, setGradYear] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [workRhythm, setWorkRhythm] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);

  const canNext =
    (step === 1 && displayName.trim().length >= 2) ||
    (step === 2 && track !== null) ||
    (step === 3 && stage !== null) ||
    (step === 4 && specialty !== null) ||
    (step === 5 && gradYear.length === 4 && primaryGoal && workRhythm && timeline);

  async function handleComplete() {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: displayName.trim(),
        track,
        career_stage: stage,
        specialty,
        graduation_year: parseInt(gradYear, 10),
        primary_goal: primaryGoal,
        work_rhythm: workRhythm,
        timeline_preference: timeline,
        hub_onboarding_completed: true,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) throw error;
      await refreshProfile();
      navigate('/hub', { replace: true });
    } catch (err) {
      console.error('Onboarding save failed:', err);
      setSaving(false);
    }
  }

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else handleComplete();
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress */}
      <div className="w-full px-4 pt-6 pb-2 max-w-md mx-auto">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-300',
                i < step ? 'bg-primary' : 'bg-border'
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-24 max-w-md mx-auto w-full">
        {step === 1 && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold font-[var(--font-display)]">Welcome to EMGurus</h1>
              </div>
              <p className="text-muted-foreground">Let's personalise your experience. What should we call you?</p>
            </div>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your first name"
              className="text-lg h-12"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && canNext && next()}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div>
              <h1 className="text-2xl font-bold font-[var(--font-display)]">Which track fits you?</h1>
              <p className="text-muted-foreground mt-1">This helps us show the right content and tools.</p>
            </div>
            <div className="space-y-3">
              {TRACKS.map((t) => {
                const isSelected = track === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setTrack(t.id); setStage(null); }}
                    className={cn(
                      'w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border hover:border-primary/30 hover:bg-card'
                    )}
                  >
                    <span className="text-2xl">
                      {typeof t.icon === 'string' ? t.icon : <t.icon className="h-6 w-6 text-primary" />}
                    </span>
                    <div>
                      <p className="font-semibold">{t.label}</p>
                      <p className="text-sm text-muted-foreground">{t.desc}</p>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && track && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div>
              <h1 className="text-2xl font-bold font-[var(--font-display)]">What's your stage?</h1>
              <p className="text-muted-foreground mt-1">Where are you in your career journey?</p>
            </div>
            <div className="space-y-2">
              {STAGES[track].map((s) => {
                const isSelected = stage === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStage(s.id)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border hover:border-primary/30 hover:bg-card'
                    )}
                  >
                    <span className="font-medium">{s.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div>
              <h1 className="text-2xl font-bold font-[var(--font-display)]">Your specialty</h1>
              <p className="text-muted-foreground mt-1">Pick the closest match — you can change this later.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
              {SPECIALTIES.map((s) => {
                const isSelected = specialty === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSpecialty(s)}
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-sm text-left transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30 font-medium'
                        : 'border-border hover:border-primary/30 hover:bg-card'
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
            <div>
              <h1 className="text-2xl font-bold font-[var(--font-display)]">Career Context</h1>
              <p className="text-muted-foreground mt-1">Help us tailor your roadmap and goals.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> Graduation Year
                </label>
                <Input
                  type="number"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  placeholder="YYYY (e.g. 2020)"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Primary Goal
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setPrimaryGoal(g.id)}
                      className={cn(
                        'text-left px-3 py-2 rounded-lg border text-sm transition-all',
                        primaryGoal === g.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-border hover:bg-card'
                      )}
                    >
                      <span className="font-medium">{g.label}</span>
                      <span className="text-muted-foreground ml-2 text-xs">- {g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Rhythm
                  </label>
                  <select 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={workRhythm || ''}
                    onChange={(e) => setWorkRhythm(e.target.value)}
                  >
                    <option value="" disabled>Select...</option>
                    {RHYTHMS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Timeline
                  </label>
                  <select 
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={timeline || ''}
                    onChange={(e) => setTimeline(e.target.value)}
                  >
                    <option value="" disabled>Select...</option>
                    {TIMELINES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={back}
            disabled={step === 1}
            className={step === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            onClick={next}
            disabled={!canNext || saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : step === TOTAL_STEPS ? (
              <>Finish <Check className="h-4 w-4 ml-1" /></>
            ) : (
              <>Next <ArrowRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}