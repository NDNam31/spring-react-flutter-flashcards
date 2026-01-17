import useSWR from 'swr';
import { api } from '@/lib/axios';
import { Folder } from '@/types/folder';
import { Deck } from '@/types/deck';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useFolders() {
  const { data, error, isLoading, mutate } = useSWR<Folder[]>('/folders', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  return {
    folders: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useUncategorizedDecks() {
  const { data, error, isLoading, mutate } = useSWR<Deck[]>('/folders/uncategorized', fetcher, {
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
