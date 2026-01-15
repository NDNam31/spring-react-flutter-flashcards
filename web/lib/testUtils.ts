import { Card } from "@/types/card";

export type QuestionType = "MCQ" | "WRITTEN" | "TRUE_FALSE";
export type AnswerMode = "TERM" | "DEFINITION" | "MIXED";

export interface TestQuestion {
  id: string;
  type: QuestionType;
  cardId: number;
  question: string;
  correctAnswer: string;
  options?: string[]; // For MCQ
  correctIndex?: number; // For MCQ
  isTrue?: boolean; // For TRUE_FALSE
  userAnswer?: string | number | boolean;
  questionMode?: "TERM" | "DEFINITION"; // Track which direction for this specific question
}

export interface TestConfig {
  numberOfQuestions: number;
  includeTypes: {
    mcq: boolean;
    written: boolean;
    trueFalse: boolean;
  };
  answerMode: AnswerMode; // TERM, DEFINITION, or MIXED
  onlyStarred: boolean; // Only include starred cards
  enableSmartGrading: boolean; // Smart grading for written answers
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number; // Percentage
  questions: TestQuestion[];
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate Multiple Choice Question
 * @param card The flashcard
 * @param allCards All cards in deck (for wrong options)
 * @param answerMode Direction of question (TERM, DEFINITION, or specific for MIXED)
 */
function generateMCQ(
  card: Card,
  allCards: Card[],
  answerMode: "TERM" | "DEFINITION"
): TestQuestion {
  let question: string;
  let correctAnswer: string;
  let wrongAnswers: string[];

  if (answerMode === "TERM") {
    // Show definition → answer with term
    question = card.definition;
    correctAnswer = card.term;
    wrongAnswers = shuffle(allCards.filter((c) => c.id !== card.id))
      .slice(0, Math.min(3, allCards.length - 1))
      .map((c) => c.term);
  } else {
    // Show term → answer with definition
    question = card.term;
    correctAnswer = card.definition;
    wrongAnswers = shuffle(allCards.filter((c) => c.id !== card.id))
      .slice(0, Math.min(3, allCards.length - 1))
      .map((c) => c.definition);
  }

  // Combine and shuffle options
  const options = shuffle([correctAnswer, ...wrongAnswers]);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    id: `mcq-${card.id}`,
    type: "MCQ",
    cardId: card.id,
    question,
    correctAnswer,
    options,
    correctIndex,
    questionMode: answerMode,
  };
}

/**
 * Generate Written Question
 * @param card The flashcard
 * @param answerMode Direction of question
 */
function generateWritten(
  card: Card,
  answerMode: "TERM" | "DEFINITION"
): TestQuestion {
  let question: string;
  let correctAnswer: string;

  if (answerMode === "TERM") {
    // Show definition → answer with term
    question = card.definition;
    correctAnswer = card.term;
  } else {
    // Show term → answer with definition
    question = card.term;
    correctAnswer = card.definition;
  }

  return {
    id: `written-${card.id}`,
    type: "WRITTEN",
    cardId: card.id,
    question,
    correctAnswer,
    questionMode: answerMode,
  };
}

/**
 * Generate True/False Question
 * @param card The flashcard
 * @param allCards All cards in deck (for false pairs)
 * @param answerMode Direction of question
 */
function generateTrueFalse(
  card: Card,
  allCards: Card[],
  answerMode: "TERM" | "DEFINITION"
): TestQuestion {
  const isTrue = Math.random() < 0.5;
  let question: string;
  let correctAnswer: string;

  if (isTrue) {
    // Correct pair
    if (answerMode === "TERM") {
      question = `Định nghĩa: "${card.definition}" → Thuật ngữ: "${card.term}"`;
      correctAnswer = "true";
    } else {
      question = `Thuật ngữ: "${card.term}" → Định nghĩa: "${card.definition}"`;
      correctAnswer = "true";
    }

    return {
      id: `tf-${card.id}`,
      type: "TRUE_FALSE",
      cardId: card.id,
      question,
      correctAnswer,
      isTrue: true,
      questionMode: answerMode,
    };
  } else {
    // Incorrect pair - get wrong term/definition from another card
    const otherCards = allCards.filter((c) => c.id !== card.id);
    if (otherCards.length === 0) {
      // Fallback to true if no other cards
      if (answerMode === "TERM") {
        question = `Định nghĩa: "${card.definition}" → Thuật ngữ: "${card.term}"`;
      } else {
        question = `Thuật ngữ: "${card.term}" → Định nghĩa: "${card.definition}"`;
      }
      return {
        id: `tf-${card.id}`,
        type: "TRUE_FALSE",
        cardId: card.id,
        question,
        correctAnswer: "true",
        isTrue: true,
        questionMode: answerMode,
      };
    }

    const wrongCard = otherCards[Math.floor(Math.random() * otherCards.length)];

    if (answerMode === "TERM") {
      question = `Định nghĩa: "${card.definition}" → Thuật ngữ: "${wrongCard.term}"`;
      correctAnswer = "false";
    } else {
      question = `Thuật ngữ: "${card.term}" → Định nghĩa: "${wrongCard.definition}"`;
      correctAnswer = "false";
    }

    return {
      id: `tf-${card.id}`,
      type: "TRUE_FALSE",
      cardId: card.id,
      question,
      correctAnswer,
      isTrue: false,
      questionMode: answerMode,
    };
  }
}

/**
 * Generate test questions based on config
 */
export function generateTestQuestions(
  cards: Card[],
  config: TestConfig
): TestQuestion[] {
  if (cards.length === 0) return [];

  // Filter cards based on config
  let filteredCards = cards;
  if (config.onlyStarred) {
    filteredCards = cards.filter((card) => card.isStarred);
    if (filteredCards.length === 0) {
      console.warn("No starred cards found, using all cards");
      filteredCards = cards;
    }
  }

  // Determine enabled question types
  const enabledTypes: QuestionType[] = [];
  if (config.includeTypes.mcq) enabledTypes.push("MCQ");
  if (config.includeTypes.written) enabledTypes.push("WRITTEN");
  if (config.includeTypes.trueFalse) enabledTypes.push("TRUE_FALSE");

  if (enabledTypes.length === 0) return [];

  // Determine number of questions
  const maxQuestions = Math.min(
    config.numberOfQuestions,
    filteredCards.length
  );

  // Shuffle cards and select subset
  const selectedCards = shuffle(filteredCards).slice(0, maxQuestions);

  // Generate questions
  const questions: TestQuestion[] = selectedCards.map((card) => {
    // Determine answer mode for this question
    let questionAnswerMode: "TERM" | "DEFINITION";
    if (config.answerMode === "MIXED") {
      // Randomly choose for each question
      questionAnswerMode = Math.random() < 0.5 ? "TERM" : "DEFINITION";
    } else {
      questionAnswerMode = config.answerMode;
    }

    // Randomly select question type from enabled types
    const randomType =
      enabledTypes[Math.floor(Math.random() * enabledTypes.length)];

    switch (randomType) {
      case "MCQ":
        return generateMCQ(card, filteredCards, questionAnswerMode);
      case "WRITTEN":
        return generateWritten(card, questionAnswerMode);
      case "TRUE_FALSE":
        return generateTrueFalse(card, filteredCards, questionAnswerMode);
      default:
        return generateMCQ(card, filteredCards, questionAnswerMode);
    }
  });

  return shuffle(questions);
}

/**
 * Check if written answer is correct
 * Strips HTML and normalizes text
 * @param userAnswer User's typed answer
 * @param correctAnswer The correct answer
 * @param enableSmartGrading If true, uses relaxed comparison
 */
function checkWrittenAnswer(
  userAnswer: string,
  correctAnswer: string,
  enableSmartGrading: boolean = false
): boolean {
  // Strip HTML tags
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  if (enableSmartGrading) {
    // Smart grading: relaxed comparison
    const normalize = (text: string) => {
      let normalized = stripHtml(text);
      normalized = normalized.toLowerCase(); // Lowercase
      normalized = normalized.replace(/[.,;:!?'"()]/g, ""); // Remove punctuation
      normalized = normalized.replace(/\s+/g, " "); // Normalize whitespace
      normalized = normalized.trim();
      return normalized;
    };

    const userNormalized = normalize(userAnswer);
    const correctNormalized = normalize(correctAnswer);

    // Exact match after normalization
    if (userNormalized === correctNormalized) return true;

    // Check if user answer contains correct answer (for longer answers)
    if (
      userNormalized.includes(correctNormalized) &&
      correctNormalized.length > 3
    ) {
      return true;
    }

    // Simple Levenshtein distance check for small typos
    // Allow 1-2 character difference for words longer than 5 chars
    if (correctNormalized.length > 5) {
      const distance = levenshteinDistance(userNormalized, correctNormalized);
      const threshold = Math.floor(correctNormalized.length * 0.15); // 15% tolerance
      return distance <= Math.max(1, threshold);
    }

    return false;
  } else {
    // Strict grading: exact match (case-insensitive, HTML stripped)
    const normalize = (text: string) => stripHtml(text).toLowerCase().trim();
    return normalize(userAnswer) === normalize(correctAnswer);
  }
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for smart grading to detect small typos
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Grade test and calculate results
 * @param questions Test questions with user answers
 * @param enableSmartGrading Whether to use smart grading for written answers
 */
export function gradeTest(
  questions: TestQuestion[],
  enableSmartGrading: boolean = false
): TestResult {
  let correctCount = 0;

  const gradedQuestions = questions.map((question) => {
    let isCorrect = false;

    switch (question.type) {
      case "MCQ":
        isCorrect = question.userAnswer === question.correctIndex;
        break;

      case "WRITTEN":
        if (typeof question.userAnswer === "string") {
          isCorrect = checkWrittenAnswer(
            question.userAnswer,
            question.correctAnswer,
            enableSmartGrading
          );
        }
        break;

      case "TRUE_FALSE":
        isCorrect = question.userAnswer === question.isTrue;
        break;
    }

    if (isCorrect) correctCount++;

    return question;
  });

  const score =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  return {
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    score,
    questions: gradedQuestions,
  };
}

/**
 * Check if a specific answer is correct
 * @param question Test question with user answer
 * @param enableSmartGrading Whether to use smart grading for written answers
 */
export function isAnswerCorrect(
  question: TestQuestion,
  enableSmartGrading: boolean = false
): boolean {
  switch (question.type) {
    case "MCQ":
      return question.userAnswer === question.correctIndex;

    case "WRITTEN":
      if (typeof question.userAnswer === "string") {
        return checkWrittenAnswer(
          question.userAnswer,
          question.correctAnswer,
          enableSmartGrading
        );
      }
      return false;

    case "TRUE_FALSE":
      return question.userAnswer === question.isTrue;

    default:
      return false;
  }
}
