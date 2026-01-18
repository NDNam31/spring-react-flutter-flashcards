import useSWR from 'swr';
import { api } from '@/lib/axios';
import { Card } from '@/types/card';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useCards(deckId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Card[]>(
    deckId ? `/decks/${deckId}/cards` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    cards: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useDifficultCount(deckId: string | null) {
  const { data, error, isLoading } = useSWR<number>(
    deckId ? `/decks/${deckId}/cards/difficult/count` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    count: data ?? 0,
    isLoading,
    isError: error,
  };
}

export function useMasteryStats(deckId: string | null) {
  const { data, error, isLoading } = useSWR(
    deckId ? `/statistics/summary/enhanced?deckId=${deckId}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    stats: data?.masteryLevels ? {
      newCards: data.masteryLevels.newCards || 0,
      stillLearning: data.masteryLevels.stillLearning || 0,
      almostDone: data.masteryLevels.almostDone || 0,
      mastered: data.masteryLevels.mastered || 0,
    } : null,
    isLoading,
    isError: error,
  };
}
