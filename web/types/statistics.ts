export enum StudyMode {
  LEARN = "LEARN",
  TEST = "TEST",
  MATCH = "MATCH",
  REVIEW = "REVIEW",
  SRS = "SRS",
}

export interface StudySession {
  id: string;
  userId: string;
  deckId?: string;
  mode: StudyMode;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  cardsStudied?: number;
  createdAt: string;
}

export interface ModeStatisticsDetail {
  mode: string;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  cardsSeen: number;
  lastActive: string | null;
  lastActiveFormatted: string;
  isCompleted: boolean;
  averageGrade?: number;
  testHistory?: number;
  lastSubmission?: string;
  lastSubmissionFormatted?: string;
}

export interface CreateStudySessionRequest {
  deckId?: string;
  mode: StudyMode;
  startTime: string;
  endTime: string;
  cardsStudied?: number;
}

export interface StudyTimeStatistics {
  totalSeconds: number;
  timeByMode: {
    total: number;
    learn: number;
    test: number;
    match: number;
    review: number;
    srs: number;
  };
  totalFormatted: string;
  timeByModeFormatted: {
    total: string;
    learn: string;
    test: string;
    match: string;
    review: string;
    srs: string;
  };
  modeDetails?: {
    learn?: ModeStatisticsDetail;
    test?: ModeStatisticsDetail;
    match?: ModeStatisticsDetail;
    srs?: ModeStatisticsDetail;
    review?: ModeStatisticsDetail;
  };
}

export interface MasteryLevelStatistics {
  newCards: number;
  stillLearning: number;
  almostDone: number;
  mastered: number;
  total: number;
  newCardsPercentage: number;
  stillLearningPercentage: number;
  almostDonePercentage: number;
  masteredPercentage: number;
}

export interface StatisticsSummary {
  totalDecks?: number;
  totalCards: number;
  cardsDueToday?: number;
  masteryLevels: MasteryLevelStatistics;
  studyTime: StudyTimeStatistics;
}
