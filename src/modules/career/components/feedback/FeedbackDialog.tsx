import { useState, useRef } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Not used in design but good to have import if needed
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Camera, X, MessageSquarePlus, Bug, Lightbulb, Heart } from 'lucide-react';
import { useScreenshot } from '@/modules/career/hooks/useScreenshot';
import { toast } from 'sonner';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { cn } from '@/lib/utils';

// Helper to calculate file size string
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

interface FeedbackDialogProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultType?: 'bug' | 'feature' | 'praise' | 'other';
}

export function FeedbackDialog({ trigger, open: controlledOpen, onOpenChange: setControlledOpen, defaultType = 'other' }: FeedbackDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? setControlledOpen : setInternalOpen;

    const [contactEmail, setContactEmail] = useState(''); // Not strictly needed if auth used, but good for follow up? Auth context handles user usually.
    const [message, setMessage] = useState('');
    const [type, setType] = useState(defaultType);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { captureScreen, isCapturing } = useScreenshot();

    // Reset form on open
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Optional: Delay reset or reset immediately
            // setMessage('');
            // setScreenshot(null);
        }
        setOpen?.(newOpen);
    };

    const handleCapture = async () => {
        // 1. Hide Dialog
        setOpen?.(false);

        // 2. Capture (800ms delay to clear backdrop/animation)
        // No toast here to prevent it from being captured
        const shot = await captureScreen(800);

        // 3. Show Result
        if (shot) {
            setScreenshot(shot);
            toast.success('Screen captured');
            setOpen?.(true);
        } else {
            toast.error('Failed to capture screen');
            setOpen?.(true);
        }
    };

    const handleSubmit = async () => {
        if (!message.trim()) {
            toast.error('Please describe your feedback');
            return;
        }

        setIsSubmitting(true);
        try {
            let screenshotPath = null;

            // 1. Upload Screenshot if exists
            if (screenshot) {
                // Convert base64 to blob
                const res = await fetch(screenshot);
                const blob = await res.blob();
                const fileExt = 'png';
                const fileName = `${crypto.randomUUID()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('feedback-attachments')
                    .upload(filePath, blob, {
                        contentType: 'image/png',
                        upsert: false
                    });

                if (uploadError) throw uploadError;
                screenshotPath = filePath;
            }

            // 2. Submit Data via Edge Function
            const { data: { session } } = await supabase.auth.getSession();

            const { error: fnError } = await supabase.functions.invoke('submit-feedback', {
                body: {
                    type,
                    message,
                    screenshot_path: screenshotPath,
                    metadata: {
                        url: window.location.href,
                        userAgent: navigator.userAgent,
                        screenSize: `${window.screen.width}x${window.screen.height}`
                    }
                },
            });

            if (fnError) {
                let debugInfo = fnError.message;

                // Try to extract additional context from the error
                try {
                    const errWithContext = fnError as { context?: { text?: () => Promise<string> } };
                    if (errWithContext.context && typeof errWithContext.context.text === 'function') {
                        const rawBody = await errWithContext.context.text();
                        debugInfo += ` | Body: ${rawBody}`;
                    }
                } catch (e) {
                    debugInfo += ` | Parse Error: ${e}`;
                }

                throw new Error(debugInfo);
            }

            toast.success('Feedback sent! Thank you.');
            setOpen?.(false);
            setMessage('');
            setScreenshot(null);
            setType('other');

        } catch (error: unknown) {
            console.error('Submit error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px]" data-screenshot-ignore>
                <DialogHeader>
                    <DialogTitle>Send Feedback</DialogTitle>
                    <DialogDescription>
                        Help us improve Career Guru. Spot a bug or have an idea?
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    {/* Type Selector */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'bug', label: 'Bug', icon: Bug },
                            { id: 'feature', label: 'Idea', icon: Lightbulb },
                            { id: 'praise', label: 'Praise', icon: Heart },
                            { id: 'other', label: 'Other', icon: MessageSquarePlus },
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setType(item.id as typeof defaultType)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-sm gap-2",
                                    type === item.id
                                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                        : "border-border hover:bg-muted text-muted-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                            placeholder={type === 'bug' ? "What happened? Steps to reproduce..." : "Tell us what you think..."}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex justify-between items-end">
                            <span>Screenshot</span>
                            {screenshot && (
                                <button
                                    onClick={() => setScreenshot(null)}
                                    className="text-xs text-destructive hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </Label>

                        {!screenshot ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-20 border-dashed flex flex-col gap-1 text-muted-foreground hover:text-foreground hover:border-primary/50"
                                onClick={handleCapture}
                                disabled={isCapturing}
                            >
                                {isCapturing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Capturing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-5 h-5" />
                                        <span>Attach Screenshot of current screen</span>
                                    </>
                                )}
                            </Button>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-border group">
                                <img src={screenshot} alt="Preview" className="w-full h-32 object-cover object-top" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm" onClick={() => setScreenshot(null)}>
                                        <X className="w-4 h-4 mr-2" /> Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen?.(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !message.trim()}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit Feedback
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
