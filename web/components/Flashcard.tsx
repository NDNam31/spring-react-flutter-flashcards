'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/types/card';

interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <motion.div
        className="relative w-full h-96 cursor-pointer"
        onClick={onFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side - Term */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border-2 border-primary/20 flex flex-col items-center justify-center p-8">
            <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
              Thuật ngữ
            </div>
            
            {/* Image nếu có */}
            {card.imageUrl && (
              <div className="relative w-full max-w-sm h-32 mb-4">
                <Image
                  src={card.imageUrl}
                  alt={card.term}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}
            
            <div 
              className="text-4xl font-bold text-center break-words prose prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: card.term }}
            />
            <div className="absolute bottom-6 text-sm text-muted-foreground">
              Nhấn Space hoặc click để xem định nghĩa
            </div>
          </div>
        </div>

        {/* Back Side - Definition */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-purple-50 rounded-2xl shadow-2xl border-2 border-primary/30 flex flex-col items-center justify-center p-8">
            <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wide">
              Định nghĩa
            </div>
            <div 
              className="text-3xl font-semibold text-center mb-6 break-words prose prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: card.definition }}
            />
            {card.example && (
              <div className="mt-4 p-4 bg-white/50 rounded-lg border border-primary/20 max-w-md">
                <div className="text-xs text-muted-foreground mb-1 uppercase">
                  Ví dụ
                </div>
                <div 
                  className="text-base italic prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: card.example }}
                />
              </div>
            )}
            <div className="absolute bottom-6 text-sm text-muted-foreground">
              Đánh giá mức độ nhớ bên dưới
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
