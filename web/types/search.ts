import { Deck } from './deck';
import { Card } from './card';

/**
 * Search Result Response from API
 */
export interface SearchResult {
  decks: Deck[];
  cards: Card[];
  totalDecks: number;
  totalCards: number;
}
