/**
 * AI Generation Request
 */
export interface AiGenerateRequest {
  topic: string;
  quantity: number;
  language: string;
}

/**
 * AI-generated Card Response
 */
export interface AiCard {
  term: string;
  definition: string;
  example: string;
}

/**
 * Extended AI Card with UI state
 */
export interface AiCardWithState extends AiCard {
  selected: boolean;
  editing: boolean;
}
