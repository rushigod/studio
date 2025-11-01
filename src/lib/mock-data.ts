import type { Test, StudentAttempt } from './types';

export const tests: Test[] = [
  {
    id: 'mock-test-1',
    name: 'MHT CET Full Syllabus Mock Test 1',
    scheduledAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'Completed',
    questions: {
      physics: Array.from({ length: 50 }, (_, i) => ({
        id: `phy-${i + 1}`,
        question: `This is Physics question ${i + 1}. What is the correct option?`,
        options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
        correct_answer: i % 4 === 0 ? 'A' : i % 4 === 1 ? 'B' : i % 4 === 2 ? 'C' : 'D',
        solution: `This is the detailed solution for Physics question ${i + 1}.`,
      })),
      chemistry: Array.from({ length: 50 }, (_, i) => ({
        id: `chem-${i + 1}`,
        question: `This is Chemistry question ${i + 1}. What is the correct option?`,
        options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
        correct_answer: i % 4 === 0 ? 'B' : i % 4 === 1 ? 'C' : i % 4 === 2 ? 'D' : 'A',
        solution: `This is the detailed solution for Chemistry question ${i + 1}.`,
      })),
      mathematics: Array.from({ length: 50 }, (_, i) => ({
        id: `math-${i + 1}`,
        question: `This is Mathematics question ${i + 1}. What is the correct option?`,
        options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' },
        correct_answer: i % 4 === 0 ? 'C' : i % 4 === 1 ? 'D' : i % 4 === 2 ? 'A' : 'B',
        solution: `This is the detailed solution for Mathematics question ${i + 1}.`,
      })),
    },
  },
  {
    id: 'mock-test-2',
    name: 'MHT CET Practice Test - Mechanics',
    scheduledAt: new Date(new Date().getTime() + 60 * 60 * 1000), // In 1 hour
    status: 'Upcoming',
    questions: {
        physics: Array.from({ length: 50 }, (_, i) => ({
            id: `phy2-${i + 1}`,
            question: `This is Mechanics Physics question ${i + 1}.`,
            options: { A: 'A', B: 'B', C: 'C', D: 'D' },
            correct_answer: 'A',
            solution: `Solution for Mechanics Physics question ${i + 1}.`,
          })),
          chemistry: Array.from({ length: 50 }, (_, i) => ({
            id: `chem2-${i + 1}`,
            question: `This is Organic Chemistry question ${i + 1}.`,
            options: { A: 'A', B: 'B', C: 'C', D: 'D' },
            correct_answer: 'B',
            solution: `Solution for Organic Chemistry question ${i + 1}.`,
          })),
          mathematics: Array.from({ length: 50 }, (_, i) => ({
            id: `math2-${i + 1}`,
            question: `This is Calculus question ${i + 1}.`,
            options: { A: 'A', B: 'B', C: 'C', D: 'D' },
            correct_answer: 'C',
            solution: `Solution for Calculus question ${i + 1}.`,
          })),
    }
  },
];

export const studentAttempt: StudentAttempt = {
  id: 'attempt-1',
  testId: 'mock-test-1',
  studentId: 'student',
  score: 135,
  accuracy: 70,
  correctCount: 95,
  incorrectCount: 40,
  unattemptedCount: 15,
  subjectWiseScores: {
    physics: 35,
    chemistry: 40,
    mathematics: 60,
  },
  subjectWiseAccuracy: {
    physics: 70,
    chemistry: 80,
    mathematics: 60,
  },
  totalTimeSpent: {
    physics: 2700, // 45 mins
    chemistry: 2400, // 40 mins
    mathematics: 5100, // 85 mins
  },
  timeSpentPerQuestion: [
    ...tests[0].questions.physics.slice(0, 45).map((q, i) => ({ questionId: q.id, questionText: `Physics Q-${i+1}`, time: 50 + Math.floor(Math.random() * 40) })),
    ...tests[0].questions.chemistry.slice(0, 48).map((q, i) => ({ questionId: q.id, questionText: `Chemistry Q-${i+1}`, time: 40 + Math.floor(Math.random() * 30) })),
    ...tests[0].questions.mathematics.slice(0, 42).map((q, i) => ({ questionId: q.id, questionText: `Mathematics Q-${i+1}`, time: 90 + Math.floor(Math.random() * 80) })),
  ].sort((a,b) => b.time - a.time),
  answers: [
    ...tests[0].questions.physics.map((q, i) => ({
        questionId: q.id,
        selectedOption: i < 35 ? q.correct_answer : i < 45 ? 'A' : null
    })),
    ...tests[0].questions.chemistry.map((q, i) => ({
        questionId: q.id,
        selectedOption: i < 40 ? q.correct_answer : i < 48 ? 'B' : null
    })),
    ...tests[0].questions.mathematics.map((q, i) => ({
        questionId: q.id,
        selectedOption: i < 30 ? q.correct_answer : i < 42 ? 'C' : null
    }))
  ]
};
