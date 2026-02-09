import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus } from 'lucide-react';
import { CATEGORY_ORDER, CATEGORY_CONFIG, type MilestoneCategory } from '@/modules/career/data/categoryConfig';

/** Categories available in the "Add Custom Milestone" dialog (excludes 'Custom') */
const SELECTABLE_CATEGORIES = CATEGORY_ORDER.filter(c => c !== 'Custom');

interface AddMilestoneDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (data: {
        name: string;
        pathway_id: string | null;
        completed: boolean;
        category: MilestoneCategory;
    }) => Promise<void>;
    isAdding: boolean;
    availablePathways: { id: string; name: string }[];
    defaultPathwayId?: string;
}

export function AddMilestoneDialog({
    open,
    onOpenChange,
    onAdd,
    isAdding,
    availablePathways,
    defaultPathwayId
}: AddMilestoneDialogProps) {
    const [name, setName] = useState('');
    const [pathwayId, setPathwayId] = useState<string>(defaultPathwayId || (availablePathways.length > 0 ? availablePathways[0].id : ''));
    const [completed, setCompleted] = useState(false);
    const [category, setCategory] = useState<MilestoneCategory>('Training');

    // Sync pathwayId when dialog opens with a default or if it's empty
    useEffect(() => {
        if (open) {
            if (defaultPathwayId) {
                setPathwayId(defaultPathwayId);
            } else if (!pathwayId && availablePathways.length > 0) {
                setPathwayId(availablePathways[0].id);
            }
        }
    }, [open, defaultPathwayId, availablePathways]);

    const resetForm = () => {
        setName('');
        setPathwayId(defaultPathwayId || (availablePathways.length > 0 ? availablePathways[0].id : ''));
        setCompleted(false);
        setCategory('Training');
    };

    const handleAdd = async () => {
        await onAdd({
            name: name.trim(),
            pathway_id: pathwayId || null,
            completed,
            category,
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Custom Milestone</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="milestone-name">Milestone Name *</Label>
                        <Input
                            id="milestone-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Research Publication, Conference Presentation..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="milestone-pathway">Associate with Pathway</Label>
                        <Select value={pathwayId} onValueChange={setPathwayId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a pathway" />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePathways.map((pathway) => (
                                    <SelectItem key={pathway.id} value={pathway.id}>
                                        {pathway.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Link this milestone to a specific training pathway
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="milestone-category">Category</Label>
                        <Select value={category} onValueChange={(v) => setCategory(v as MilestoneCategory)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {SELECTABLE_CATEGORIES.map((cat) => {
                                    const meta = CATEGORY_CONFIG[cat];
                                    return (
                                        <SelectItem key={cat} value={cat}>
                                            {meta.label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Group this milestone under a category
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="milestone-completed">Already Completed</Label>
                            <p className="text-xs text-muted-foreground">
                                Mark if you've already achieved this
                            </p>
                        </div>
                        <Switch
                            id="milestone-completed"
                            checked={completed}
                            onCheckedChange={setCompleted}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isAdding}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={!name.trim() || isAdding}>
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Milestone
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
