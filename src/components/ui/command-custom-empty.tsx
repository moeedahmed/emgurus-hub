import { useCommandState } from 'cmdk';
import { Plus, SearchX } from 'lucide-react';
import { CommandItem, CommandEmpty } from './command';

interface CommandCustomEmptyProps {
  onAddCustom: (value: string) => void;
  itemType: string; // e.g., "exam", "specialty", "country"
  minChars?: number;
}

/**
 * A smart empty state for Command dropdowns that offers to use the typed text as a custom value.
 * Uses cmdk's useCommandState to access the current search value.
 */
export function CommandCustomEmpty({ onAddCustom, itemType, minChars = 2 }: CommandCustomEmptyProps) {
  const search = useCommandState((state) => state.search);

  // If we have a valid search term, show the "Add Custom" button
  // This behaves as a CommandItem, so it will prevent CommandEmpty from showing
  if (search && search.trim().length >= minChars) {
    return (
      <CommandItem
        onSelect={() => onAddCustom(search.trim())}
        className="justify-center text-primary cursor-pointer font-medium"
        value={`__custom__${search}`} // Unique value to prevent filtering issues
      >
        <Plus className="w-4 h-4 mr-2" />
        Use "{search.trim()}" as custom {itemType}
      </CommandItem>
    );
  }

  // Otherwise, fallback to the standard Empty state
  // This will ONLY render if no other items match the search (and we aren't showing the button above)
  return (
    <CommandEmpty>
      <div className="flex flex-col items-center justify-center text-center px-4 py-2">
        <div className="bg-muted/50 p-2 rounded-full mb-2">
          <SearchX className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No {itemType} found
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {search && search.length > 0 && search.length < minChars
            ? `Type at least ${minChars} characters to add custom`
            : "Type to add a new one"}
        </p>
      </div>
    </CommandEmpty>
  );
}
