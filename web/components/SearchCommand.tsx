"use client";

import * as React from "react";
import { Search, FileText, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SearchResult } from "@/types/search";
import { api } from "@/lib/axios";

/**
 * Global Search Command Dialog Component
 * Allows searching across decks and cards with keyboard shortcuts
 * 
 * Features:
 * - Hotkey: Ctrl+K / Cmd+K to open
 * - Debounced search (500ms)
 * - Keyboard navigation
 * - Click to navigate to deck/card
 */
export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = React.useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // Handle keyboard shortcut (Ctrl+K / Cmd+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Perform search when debounced query changes
  React.useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get<SearchResult>(`/search?q=${encodeURIComponent(debouncedQuery)}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Handle deck selection
  const handleDeckSelect = (deckId: number) => {
    setOpen(false);
    setQuery("");
    setResults(null);
    router.push(`/decks/${deckId}`);
  };

  // Handle card selection (navigate to deck containing the card)
  const handleCardSelect = (deckId: number) => {
    setOpen(false);
    setQuery("");
    setResults(null);
    router.push(`/decks/${deckId}`);
  };

  // Reset when dialog closes
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setQuery("");
      setResults(null);
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors w-full max-w-sm"
      >
        <Search className="w-4 h-4" />
        <span>Tìm kiếm...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput 
          placeholder="Tìm kiếm bộ thẻ hoặc thẻ..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && !results && query.trim() && (
            <CommandEmpty>Nhập từ khóa để tìm kiếm...</CommandEmpty>
          )}

          {!isLoading && results && !results.decks.length && !results.cards.length && (
            <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>
          )}

          {!isLoading && results && (results.decks.length > 0 || results.cards.length > 0) && (
            <>
              {/* Decks Results */}
              {results.decks.length > 0 && (
                <>
                  <CommandGroup heading="Bộ thẻ">
                    {results.decks.map((deck) => (
                      <CommandItem
                        key={`deck-${deck.id}`}
                        value={`deck-${deck.id}-${deck.title}`}
                        onSelect={() => handleDeckSelect(deck.id)}
                        className="cursor-pointer"
                      >
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">{deck.title}</span>
                          {deck.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {deck.description}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {deck.cardCount} thẻ
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {results.totalDecks > results.decks.length && (
                    <div className="px-4 py-2 text-xs text-muted-foreground">
                      Còn {results.totalDecks - results.decks.length} bộ thẻ khác...
                    </div>
                  )}
                </>
              )}

              {/* Separator if both results exist */}
              {results.decks.length > 0 && results.cards.length > 0 && (
                <CommandSeparator />
              )}

              {/* Cards Results */}
              {results.cards.length > 0 && (
                <>
                  <CommandGroup heading="Thẻ">
                    {results.cards.map((card) => (
                      <CommandItem
                        key={`card-${card.id}`}
                        value={`card-${card.id}-${card.term}`}
                        onSelect={() => handleCardSelect(card.deckId)}
                        className="cursor-pointer"
                      >
                        <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">{card.term}</span>
                          <span className="text-sm text-muted-foreground truncate max-w-md">
                            {card.definition}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {results.totalCards > results.cards.length && (
                    <div className="px-4 py-2 text-xs text-muted-foreground">
                      Còn {results.totalCards - results.cards.length} thẻ khác...
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
