--✅ DDL SQL – FINAL VERSION (CHỐT)
--1️⃣ USERS

--Dùng cho 1 người trước, mở rộng multi-user không cần sửa schema

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--2️⃣ DECKS (BỘ THẺ)

--Có updated_at để mobile sync, có source_type để import/export

CREATE TABLE decks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    source_type VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    -- LOCAL | ANKI | QUIZLET

    source_id VARCHAR(255),
    -- id gốc từ anki / quizlet (nếu import)

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deck_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

--3️⃣ CARDS (NỘI DUNG – BẤT BIẾN)

-- KHÔNG CHỨA LOGIC HỌC – KHÔNG BAO GIỜ RESET

CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    deck_id BIGINT NOT NULL,

    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    example TEXT,

    image_url TEXT,
    audio_url TEXT,

    position INT NOT NULL DEFAULT 0,
    -- thứ tự hiển thị trong deck (1, 2, 3...)

    tags TEXT[],
    -- ví dụ: {'verb', 'ielts', 'unit1'}

    source_card_id VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_card_deck
        FOREIGN KEY (deck_id)
        REFERENCES decks(id)
        ON DELETE CASCADE
);

--4️⃣ CARD_PROGRESS (TRÁI TIM CỦA ANKI + QUIZLET)

--Có thể reset / clone / cram mà không phá dữ liệu gốc

CREATE TABLE card_progress (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    card_id BIGINT NOT NULL,

    learning_state VARCHAR(30) NOT NULL DEFAULT 'NEW',
    -- NEW
    -- LEARNING_MCQ
    -- LEARNING_TYPING
    -- REVIEWING
    -- RELEARNING

    next_review TIMESTAMP,
    interval INT NOT NULL DEFAULT 0,
    ease_factor FLOAT NOT NULL DEFAULT 2.5,
    repetitions INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_progress_card
        FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_user_card UNIQUE (user_id, card_id)
);

--5️⃣ STUDY_LOG (THỐNG KÊ – HEATMAP – AI SAU NÀY)

--Phục vụ dashboard, biểu đồ, phân tích “từ hay quên”

CREATE TABLE study_log (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    card_id BIGINT NOT NULL,

    grade VARCHAR(10) NOT NULL,
    -- AGAIN | HARD | GOOD | EASY

    time_taken_ms INT,
    reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_log_card
        FOREIGN KEY (card_id)
        REFERENCES cards(id)
        ON DELETE CASCADE
);

--6️⃣ INDEXES (HIỆU NĂNG – BẮT BUỘC)
-- Lấy thẻ cần ôn hôm nay
CREATE INDEX idx_card_progress_due
ON card_progress (user_id, next_review);

-- Load thẻ trong deck theo thứ tự
CREATE INDEX idx_cards_deck_position
ON cards (deck_id, position);

-- Sync mobile
CREATE INDEX idx_cards_updated
ON cards (updated_at);

CREATE INDEX idx_decks_updated
ON decks (updated_at);



-- thêm thể delete
ALTER TABLE decks
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE cards
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
-- delete
SELECT *
FROM cards
WHERE deck_id = :deckId
  AND is_deleted = FALSE
ORDER BY position;
-- mobile
SELECT *
FROM cards
WHERE updated_at > :last_sync_time;