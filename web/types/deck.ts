export interface Deck {
  id: number;
  title: string;
  description: string | null;
  sourceType: string;
  sourceId: string | null;
  cardCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckRequest {
  title: string;
  description?: string;
}
