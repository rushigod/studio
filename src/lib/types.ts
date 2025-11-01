export type Question = {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: 'A' | 'B' | 'C' | 'D';
  solution: string;
};

export type Test = {
  id: string;
  name: string;
  scheduledAt: Date;
  status: 'Upcoming' | 'Live' | 'Completed';
  questions: {
    physics: Question[];
    chemistry: Question[];
    mathematics: Question[];
  };
};

export type StudentAttempt = {
  id: string;
  testId: string;
  studentId: string; // just 'student' for now
  score: number;
  accuracy: number;
  subjectWiseScores: {
    physics: number;
    chemistry: number;
    mathematics: number;
  };
  subjectWiseAccuracy: {
    physics: number;
    chemistry: number;
    mathematics: number;
  };
  timeSpentPerQuestion: { questionId: string; time: number, questionText: string }[];
  totalTimeSpent: {
    physics: number;
    chemistry: number;
    mathematics: number;
  };
  answers: { questionId: string, selectedOption: string | null }[];
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
};
