-- Add is_starred column to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS is_starred BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster filtering by starred cards
CREATE INDEX IF NOT EXISTS idx_cards_is_starred ON cards(is_starred) WHERE is_starred = TRUE;

-- Add comment
COMMENT ON COLUMN cards.is_starred IS 'Indicates if the card is starred/favorited by the user';
