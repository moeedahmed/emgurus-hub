import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Loader2 } from 'lucide-react';

// ... interface update
interface AddStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: {
    title: string;
    timeframe: '30d' | '6mo' | '12mo' | '18mo+' | null;
    why: string | null;
    how: string[];
  }) => Promise<void>;
  isAdding: boolean;
}

export function AddStepDialog({ open, onOpenChange, onAdd, isAdding }: AddStepDialogProps) {
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState<string>('');
  const [why, setWhy] = useState('');
  const [howSteps, setHowSteps] = useState<string[]>([]);
  const [newHowStep, setNewHowStep] = useState('');

  const handleAddHowStep = () => {
    if (newHowStep.trim()) {
      setHowSteps([...howSteps, newHowStep.trim()]);
      setNewHowStep('');
    }
  };

  const handleRemoveHowStep = (index: number) => {
    setHowSteps(howSteps.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle('');
    setTimeframe('');
    setWhy('');
    setHowSteps([]);
    setNewHowStep('');
  };

  const handleAdd = async () => {
    await onAdd({
      title: title.trim(),
      timeframe: (timeframe as '30d' | '6mo' | '12mo' | '18mo+') || null,
      why: why.trim() || null,
      how: howSteps,
    });
    resetForm();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Step</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="add-title">Title *</Label>
            <Input
              id="add-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Step title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="6mo">6 months</SelectItem>
                <SelectItem value="12mo">12 months</SelectItem>
                <SelectItem value="18mo+">18+ months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-why">Why this matters</Label>
            <Textarea
              id="add-why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Explain why this step is important..."
              rows={2}
            />
          </div>

          {/* ... existing how-to section ... */}

          <div className="space-y-2">
            <Label>How to complete</Label>
            <div className="space-y-2">
              {howSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm">{step}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveHowStep(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newHowStep}
                  onChange={(e) => setNewHowStep(e.target.value)}
                  placeholder="Add a step..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHowStep())}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddHowStep}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isAdding}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!title.trim() || isAdding}>
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Step
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
