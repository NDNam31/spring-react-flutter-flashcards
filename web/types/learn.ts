import { Card } from './card';

/**
 * Interface cho câu hỏi trắc nghiệm trong Learn Mode
 */
export interface MultipleChoiceQuestion {
  /** ID câu hỏi (dùng card.id) */
  id: number;
  
  /** Thuật ngữ - là câu hỏi */
  question: string;
  
  /** Đáp án đúng */
  correctAnswer: string;
  
  /** Mảng 4 đáp án (đã shuffle) */
  options: string[];
  
  /** Index của đáp án đúng trong mảng options */
  correctIndex: number;
  
  /** Ví dụ (nếu có) */
  example?: string;
  
  /** Card gốc (để hiển thị thêm thông tin nếu cần) */
  card: Card;
}

/**
 * Interface cho kết quả trả lời
 */
export interface AnswerResult {
  /** Có đúng không */
  isCorrect: boolean;
  
  /** Index đáp án người dùng chọn */
  selectedIndex: number;
  
  /** Index đáp án đúng */
  correctIndex: number;
  
  /** Câu hỏi tương ứng */
  question: MultipleChoiceQuestion;
}
