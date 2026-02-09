import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
}

export const PullToRefresh = ({ onRefresh, children, className }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const threshold = 80;

  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const rotate = useTransform(y, [0, threshold], [0, 180]);

  const handleDragEnd = useCallback(async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
  }, [isRefreshing, onRefresh, y]);

  // Only allow pull when at top of scroll
  const handleDragStart = useCallback(() => {
    if (containerRef.current && containerRef.current.scrollTop > 0) {
      return false;
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Refresh indicator */}
      <motion.div 
        className="absolute left-0 right-0 flex justify-center py-4 z-10 pointer-events-none"
        style={{ 
          top: -60,
          y,
          opacity 
        }}
      >
        <motion.div
          style={{ rotate: isRefreshing ? undefined : rotate }}
          className={isRefreshing ? 'animate-spin' : ''}
        >
          <RefreshCw className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>
      
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-x"
      >
        {children}
      </motion.div>
    </div>
  );
};
