import { Deck } from './deck';

export interface Folder {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  deckCount: number;
  decks?: Deck[];
  createdAt: string;
  updatedAt: string;
  lastViewedAt: string | null;
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
}

export interface UpdateFolderRequest {
  name: string;
  description?: string;
}
