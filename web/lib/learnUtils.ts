import { Card } from '@/types/card';
import { MultipleChoiceQuestion } from '@/types/learn';

/**
 * Shuffle mảng bằng Fisher-Yates algorithm
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
 * Tạo câu hỏi trắc nghiệm từ danh sách thẻ
 * 
 * Logic:
 * 1. Với mỗi thẻ, lấy definition của nó làm đáp án đúng
 * 2. Lấy random 3 definition khác từ các thẻ còn lại làm đáp án sai
 * 3. Shuffle 4 đáp án
 * 4. Lưu lại index của đáp án đúng
 * 
 * Edge Case: 
 * - Nếu deck có < 4 thẻ: Lấy tất cả thẻ còn lại làm đáp án sai (không đủ 4 options)
 * 
 * @param cards Danh sách thẻ trong deck
 * @returns Mảng câu hỏi trắc nghiệm đã shuffle
 */
export function generateMultipleChoiceQuestions(cards: Card[]): MultipleChoiceQuestion[] {
  if (cards.length === 0) {
    return [];
  }

  const questions: MultipleChoiceQuestion[] = cards.map((card, index) => {
    // 1. Đáp án đúng là definition của thẻ hiện tại
    const correctAnswer = card.definition;

    // 2. Lấy các thẻ khác (loại trừ thẻ hiện tại)
    const otherCards = cards.filter((_, i) => i !== index);

    // 3. Lấy random tối đa 3 đáp án sai
    const wrongAnswers = shuffle(otherCards)
      .slice(0, Math.min(3, otherCards.length))
      .map((c) => c.definition);

    // 4. Kết hợp đáp án đúng và sai
    const allOptions = [correctAnswer, ...wrongAnswers];

    // 5. Shuffle vị trí các đáp án
    const shuffledOptions = shuffle(allOptions);

    // 6. Tìm index của đáp án đúng sau khi shuffle
    const correctIndex = shuffledOptions.indexOf(correctAnswer);

    return {
      id: card.id,
      question: card.term,
      correctAnswer,
      options: shuffledOptions,
      correctIndex,
      example: card.example || undefined,
      card,
    };
  });

  // 7. Shuffle thứ tự câu hỏi
  return shuffle(questions);
}

/**
 * Kiểm tra đáp án có đúng không
 */
export function checkAnswer(
  question: MultipleChoiceQuestion,
  selectedIndex: number
): boolean {
  return selectedIndex === question.correctIndex;
}

/**
 * Tính điểm phần trăm
 */
export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}
