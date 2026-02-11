import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ className, fullPage = true }: LoadingSpinnerProps) {
  return (
    <div className={cn(fullPage ? 'flex items-center justify-center py-20' : 'flex items-center justify-center', className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
