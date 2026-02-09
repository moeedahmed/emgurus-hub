import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    fullScreen?: boolean;
}

export function LoadingSpinner({ className, fullScreen = false, ...props }: LoadingSpinnerProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-background flex flex-col items-center justify-center" {...props}>
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[50vh]", className)} {...props}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
