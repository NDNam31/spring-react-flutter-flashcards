package com.flashcards.enums;

/**
 * Enum đại diện cho mức độ nhớ khi review thẻ
 * Sử dụng trong thuật toán SM-2 (Super Memo 2)
 */
public enum ReviewGrade {
    /**
     * Quên hoàn toàn - Cần học lại từ đầu
     * Interval = 1 ngày, giảm ease factor
     */
    AGAIN,
    
    /**
     * Khó nhớ - Cần xem lại sớm hơn
     * Interval tăng chậm, giảm nhẹ ease factor
     */
    HARD,
    
    /**
     * Nhớ tốt - Tiến trình bình thường
     * Interval tăng theo SM-2 standard
     */
    GOOD,
    
    /**
     * Nhớ rất tốt - Có thể chờ lâu hơn
     * Interval tăng nhanh, tăng ease factor
     */
    EASY
}
