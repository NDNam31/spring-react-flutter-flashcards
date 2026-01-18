export interface Deck {
  id: string;
  folderId?: string | null;
  title: string;
  description: string | null;
  sourceType: string;
  sourceId: string | null;
  cardCount?: number;
  createdAt: string;
  updatedAt: string;
  lastViewedAt: string | null;
}

export interface CreateDeckRequest {
  title: string;
  description?: string;
}
