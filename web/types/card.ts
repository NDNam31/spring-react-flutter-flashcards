export interface Card {
  id: string;
  deckId: string;
  term: string;
  definition: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  position: number;
  tags: string[];
  isStarred?: boolean;
  learningState:
    | "NEW"
    | "LEARNING_MCQ"
    | "LEARNING_TYPING"
    | "REVIEWING"
    | "RELEARNING";
  nextReview?: string;
  createdAt: string;
}

export interface CreateCardRequest {
  deckId: string;
  term: string;
  definition: string;
  example?: string;
  imageUrl?: string;
}
