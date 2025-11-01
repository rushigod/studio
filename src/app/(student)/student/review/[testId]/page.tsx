'use client';

import { useState } from 'react';
import { tests } from '@/lib/mock-data';
import { studentAttempt } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function ReviewPage({ params }: { params: { testId: string } }) {
  const test = tests.find(t => t.id === params.testId);

  const allQuestions = [
    ...test?.questions.physics.map(q => ({ ...q, subject: 'Physics' })) || [],
    ...test?.questions.chemistry.map(q => ({ ...q, subject: 'Chemistry' })) || [],
    ...test?.questions.mathematics.map(q => ({ ...q, subject: 'Mathematics' })) || [],
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const studentAnswerObj = studentAttempt.answers.find(a => a.questionId === currentQuestion.id);
  const studentAnswer = studentAnswerObj?.selectedOption;
  const isCorrect = studentAnswer === currentQuestion.correct_answer;
  const isUnattempted = !studentAnswer;

  if (!test) {
    return <div>Test not found</div>;
  }
  
  const QuestionPalette = () => {
    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="font-bold mb-4">Question Palette</h3>
                <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="grid grid-cols-5 gap-2">
                    {allQuestions.map((q, index) => {
                        const ans = studentAttempt.answers.find(a => a.questionId === q.id);
                        const status = !ans?.selectedOption ? 'unattempted' : ans.selectedOption === q.correct_answer ? 'correct' : 'incorrect';
                        
                        return (
                        <Button
                            key={q.id}
                            variant={currentQuestionIndex === index ? 'default' : 'outline'}
                            size="sm"
                            className={cn("h-8 w-8", {
                                'bg-green-500 hover:bg-green-600 text-white': status === 'correct' && currentQuestionIndex !== index,
                                'bg-red-500 hover:bg-red-600 text-white': status === 'incorrect' && currentQuestionIndex !== index,
                                'border-primary': currentQuestionIndex === index,
                            })}
                            onClick={() => setCurrentQuestionIndex(index)}
                        >
                            {index + 1}
                        </Button>
                        );
                    })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-2xl font-headline font-bold">Review: {test.name}</h1>
        <Card id={currentQuestion.id}>
          <CardContent className="p-6">
            <p className="mb-4 text-muted-foreground">
              Question {currentQuestionIndex + 1} of {allQuestions.length} | Subject: {currentQuestion.subject}
            </p>
            <p className="font-semibold text-lg mb-6">{currentQuestion.question}</p>

            <RadioGroup value={studentAnswer || undefined} disabled className="space-y-4">
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const isUserAnswer = studentAnswer === key;
                const isCorrectAnswer = currentQuestion.correct_answer === key;
                return (
                  <Label
                    key={key}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 cursor-not-allowed",
                      isUserAnswer && !isCorrect && "bg-red-100/50 border-red-400",
                      isCorrectAnswer && "bg-green-100/50 border-green-400",
                    )}
                  >
                    <RadioGroupItem value={key} id={`q${currentQuestion.id}-opt-${key}`} />
                    <span>{value}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Solution & Explanation</h3>
                <div className="flex items-start gap-4 mb-4">
                    {isUnattempted ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-1"/>
                    ) : isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1"/>
                    ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1"/>
                    )}
                    <div>
                        <p className="font-semibold">
                            Correct Answer: {currentQuestion.correct_answer}
                            {!isUnattempted && ` | Your Answer: ${studentAnswer}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {isUnattempted ? "You did not attempt this question." : isCorrect ? "Your answer was correct." : "Your answer was incorrect."}
                        </p>
                    </div>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground border-t pt-4">
                    <p>{currentQuestion.solution}</p>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQuestionIndex(i => i - 1)}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentQuestionIndex(i => i + 1)}
            disabled={currentQuestionIndex === allQuestions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="lg:col-span-1">
        <QuestionPalette />
      </div>
    </div>
  );
}
