import React, { useRef, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PageTabs = Tabs;
export const PageTabsTrigger = TabsTrigger;
export const PageTabsContent = TabsContent;

// A specialized TabsList that handles responsiveness, scrolling, and consistent styling
export const PageTabsList = React.forwardRef<
    React.ElementRef<typeof TabsList>,
    React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, children, ...props }, ref) => {
    return (
        <div className="relative group">
            {/* 
        Container for the scrollable list.
        We apply the standard layout:
        - justify-start: Keeps tabs left-aligned (compact).
        - overflow-x-auto: Allows scrolling on small screens.
        - flex-nowrap: Prevents wrapping.
        - scrollbar-hide: Clean look.
       */}

            {/* Mobile Fade Indicators (visible only on small screens) */}
            <div className="sm:hidden absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="sm:hidden absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <TabsList
                ref={ref}
                className={cn(
                    "justify-start overflow-x-auto flex-nowrap scrollbar-hide w-full sm:w-auto bg-muted/50 p-1",
                    className
                )}
                {...props}
            >
                {children}
            </TabsList>
        </div>
    );
});

PageTabsList.displayName = "PageTabsList";
