import useSWR from 'swr';
import { api } from '@/lib/axios';
import { Deck } from '@/types/deck';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useDecks(folderId?: string | null) {
  const url = folderId 
    ? `/folders/${folderId}/decks` 
    : '/decks';
  
  const { data, error, isLoading, mutate } = useSWR<Deck[]>(url, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  return {
    decks: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useDeck(deckId: string) {
  const { data, error, isLoading, mutate } = useSWR<Deck>(
    deckId ? `/decks/${deckId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    deck: data,
    isLoading,
    isError: error,
    mutate,
  };
}
