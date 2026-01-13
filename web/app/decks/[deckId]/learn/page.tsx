'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/types/card';
import { MultipleChoiceQuestion, AnswerResult } from '@/types/learn';
import { generateMultipleChoiceQuestions, checkAnswer, calculateScore } from '@/lib/learnUtils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ deckId: string }>;
}

export default function LearnModePage({ params }: PageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [deckId, setDeckId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      const resolvedParams = await params;
      setDeckId(resolvedParams.deckId);
    };

    initPage();
  }, [params, isAuthenticated, router]);

  useEffect(() => {
    if (deckId) {
      fetchCards();
    }
  }, [deckId]);

  const fetchCards = async () => {
    if (!deckId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/decks/${deckId}/cards`);
      const fetchedCards = response.data as Card[];

      if (fetchedCards.length === 0) {
        toast.error('Bộ thẻ này chưa có thẻ nào!');
        router.push(`/decks/${deckId}`);
        return;
      }

      setCards(fetchedCards);
      
      // Tạo câu hỏi trắc nghiệm
      const mcQuestions = generateMultipleChoiceQuestions(fetchedCards);
      setQuestions(mcQuestions);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể tải dữ liệu';
      toast.error(message);
      router.push(`/decks/${deckId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null) return; // Đã chọn rồi
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast.error('Vui lòng chọn đáp án!');
      return;
    }

    const currentQuestion = questions[currentIndex];
    const isCorrect = checkAnswer(currentQuestion, selectedOption);

    // Lưu kết quả
    const result: AnswerResult = {
      isCorrect,
      selectedIndex: selectedOption,
      correctIndex: currentQuestion.correctIndex,
      question: currentQuestion,
    };
    setAnswers([...answers, result]);

    // Toast feedback
    if (isCorrect) {
      toast.success('Chính xác! 🎉');
    } else {
      toast.error('Sai rồi! Đáp án đúng: ' + currentQuestion.correctAnswer);
    }

    // Chuyển câu tiếp theo
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // Hoàn thành
      setIsComplete(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleRestart = () => {
    // Reset tất cả
    const mcQuestions = generateMultipleChoiceQuestions(cards);
    setQuestions(mcQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsComplete(false);
  };

  if (!deckId || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
        </main>
      </div>
    );
  }

  if (isComplete) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = answers.length;
    const score = calculateScore(correctCount, totalCount);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/decks/${deckId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <UICard className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Trophy className="h-20 w-20 text-yellow-500" />
              </div>
              <CardTitle className="text-3xl">Hoàn thành!</CardTitle>
              <CardDescription className="text-lg">
                Bạn đã học xong {totalCount} thẻ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-primary">{score}%</div>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Đúng</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {correctCount}
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium">Sai</span>
                  </div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {totalCount - correctCount}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.push(`/decks/${deckId}`)}>
                Về trang chủ
              </Button>
              <Button onClick={handleRestart}>
                <BookOpen className="mr-2 h-4 w-4" />
                Học lại
              </Button>
            </CardFooter>
          </UICard>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/decks/${deckId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Chế độ học thuộc lòng</h1>
              <Badge variant="secondary">
                {currentIndex + 1} / {questions.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <UICard className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{currentQuestion.question}</CardTitle>
            {currentQuestion.example && (
              <CardDescription className="text-center italic">
                Ví dụ: {currentQuestion.example}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showResult = selectedOption !== null;

              let buttonClass = 'justify-start text-left h-auto py-4 px-6 text-base';
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass += ' bg-green-100 dark:bg-green-950 border-green-500 hover:bg-green-100 dark:hover:bg-green-950';
                } else if (isSelected) {
                  buttonClass += ' bg-red-100 dark:bg-red-950 border-red-500 hover:bg-red-100 dark:hover:bg-red-950';
                }
              } else if (isSelected) {
                buttonClass += ' border-primary bg-primary/5';
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleSelectOption(index)}
                  disabled={showResult}
                >
                  <span className="font-semibold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-red-600 ml-2" />
                  )}
                </Button>
              );
            })}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleNext}
              disabled={selectedOption === null}
            >
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
            </Button>
          </CardFooter>
        </UICard>
      </main>
    </div>
  );
}
