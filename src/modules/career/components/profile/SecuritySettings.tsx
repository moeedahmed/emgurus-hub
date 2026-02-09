import { useState } from "react";
import { Shield, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSection } from "@/modules/career/components/profile/ProfileSection";
import { supabase } from "@/modules/career/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SecuritySettings() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdatePassword = async () => {
        setError(null);

        // Validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsUpdating(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            toast.success("Password updated successfully");
            setPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            console.error("Password update error:", err);
            toast.error(err instanceof Error ? err.message : "Failed to update password");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <ProfileSection
            title="Security"
            description="Update your password and manage account security"
            icon={Shield}
            variant="accent"
            delay={0.3}
            className="mt-6"
        >
            <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "h-11 pl-10",
                                error && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cn(
                                "h-11 pl-10",
                                error && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                {error && <p className="text-xs text-destructive mt-1">{error}</p>}

                <Button
                    onClick={handleUpdatePassword}
                    disabled={isUpdating || !password || !confirmPassword}
                    className="w-full sm:w-auto mt-2"
                >
                    {isUpdating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Update Password
                        </>
                    )}
                </Button>
            </div>
        </ProfileSection>
    );
}
