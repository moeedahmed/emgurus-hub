import { useState, useRef, useEffect } from 'react';
import { useAuth, type Profile as ProfileType } from '@/core/auth/AuthProvider';
import { supabase } from '@/core/auth/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Track = 'uk' | 'img' | 'global';

const TRACKS: { id: Track; label: string }[] = [
  { id: 'uk', label: 'UK Trainee' },
  { id: 'img', label: 'IMG' },
  { id: 'global', label: 'Global' },
];

const STAGES: Record<Track, { id: string; label: string }[]> = {
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
  'Emergency Medicine', 'Internal Medicine', 'Surgery (General)', 'Paediatrics',
  'Obstetrics & Gynaecology', 'Anaesthetics', 'Psychiatry', 'Radiology',
  'General Practice', 'Cardiology', 'Respiratory Medicine', 'Neurology',
  'Orthopaedics', 'ENT', 'Ophthalmology', 'Dermatology', 'Haematology',
  'Oncology', 'Intensive Care', 'Public Health', 'Pathology', 'Undecided', 'Other',
];

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [track, setTrack] = useState<Track | ''>('');
  const [careerStage, setCareerStage] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Hydrate form from profile
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name || '');
    setTrack((profile.track as Track) || '');
    setCareerStage(profile.career_stage || '');
    setSpecialty(profile.specialty || '');
    setBio(profile.bio || '');
    setAvatarUrl(profile.avatar_url || null);
  }, [profile]);

  const stages = track ? STAGES[track] : [];

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(url);

      // Save avatar URL to profile immediately
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);
      await refreshProfile();
      toast.success('Avatar updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    if (displayName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({
        display_name: displayName.trim(),
        track: track || null,
        career_stage: careerStage || null,
        specialty: specialty || null,
        bio: bio.trim() || null,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success('Profile saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  const initials = (displayName || user?.email || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-[var(--font-display)]">Your Profile</h1>

      {/* Avatar */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={cn(
                  'absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity',
                  uploading && 'opacity-100'
                )}
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-lg">{displayName || 'Your Name'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primary hover:underline mt-1"
              >
                Change photo
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details form */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Full Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Track */}
          <div className="space-y-1.5">
            <Label>Track</Label>
            <Select
              value={track || '__none__'}
              onValueChange={(v) => {
                setTrack(v === '__none__' ? '' : v as Track);
                setCareerStage('');
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select track" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Not set</SelectItem>
                {TRACKS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Career Stage */}
          {stages.length > 0 && (
            <div className="space-y-1.5">
              <Label>Career Stage</Label>
              <Select
                value={careerStage || '__none__'}
                onValueChange={(v) => setCareerStage(v === '__none__' ? '' : v)}
              >
                <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Not set</SelectItem>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Specialty */}
          <div className="space-y-1.5">
            <Label>Specialty</Label>
            <Select
              value={specialty || '__none__'}
              onValueChange={(v) => setSpecialty(v === '__none__' ? '' : v)}
            >
              <SelectTrigger><SelectValue placeholder="Select specialty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Not set</SelectItem>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Save Changes</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
