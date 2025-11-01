'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tests } from '@/lib/mock-data';
import type { Question } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Section = 'physics-chemistry' | 'mathematics';

export default function TestPage({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { toast } = useToast();

  const [test, setTest] = useState(tests.find(t => t.id === params.testId));
  const [currentSection, setCurrentSection] = useState<Section>('physics-chemistry');
  const [sectionTime, setSectionTime] = useState(isPreview ? 10 * 60 : 90 * 60);
  const [totalTime, setTotalTime] = useState(isPreview ? 20 * 60 : 180 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [questions, setQuestions] = useState<(Question & { subject: string })[]>([]);

  useEffect(() => {
    const pcmQuestions = [
      ...(test?.questions.physics.map(q => ({ ...q, subject: 'Physics' })) || []),
      ...(test?.questions.chemistry.map(q => ({ ...q, subject: 'Chemistry' })) || []),
    ];
    const mathQuestions = test?.questions.mathematics.map(q => ({ ...q, subject: 'Mathematics' })) || [];
    
    setQuestions(currentSection === 'physics-chemistry' ? pcmQuestions : mathQuestions);
    setCurrentQuestionIndex(0);
  }, [currentSection, test]);
  
  const finishTest = useCallback(() => {
    toast({
        title: isPreview ? "Preview Finished" : "Test Submitted!",
        description: isPreview ? "You have completed the test preview." : "Your responses have been saved. Redirecting to dashboard...",
    });
    localStorage.removeItem(`test-progress-${params.testId}`);
    if (isPreview) {
      router.push('/admin/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  }, [router, params.testId, toast, isPreview]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`test-progress-${params.testId}`);
    if (savedProgress && !isPreview) {
        const { savedAnswers, savedSection, savedSectionTime, savedTotalTime } = JSON.parse(savedProgress);
        setAnswers(savedAnswers);
        setCurrentSection(savedSection);
        setSectionTime(savedSectionTime);
        setTotalTime(savedTotalTime);
    }
  }, [params.testId, isPreview]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSectionTime(prev => prev - 1);
      setTotalTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
      if (!isPreview) {
        const saveInterval = setInterval(() => {
            localStorage.setItem(`test-progress-${params.testId}`, JSON.stringify({
                savedAnswers: answers,
                savedSection: currentSection,
                savedSectionTime: sectionTime,
                savedTotalTime: totalTime,
            }));
            toast({ title: 'Progress Saved', description: 'Your answers are automatically saved.' });
        }, 2 * 60 * 1000); // 2 minutes
    
        return () => clearInterval(saveInterval);
      }
  }, [answers, currentSection, sectionTime, totalTime, params.testId, toast, isPreview]);

  useEffect(() => {
    if (totalTime <= 0) {
      finishTest();
    } else if (sectionTime <= 0 && currentSection === 'physics-chemistry') {
      setCurrentSection('mathematics');
      setSectionTime(isPreview ? 10 * 60 : 90 * 60);
      toast({ title: "Section Changed", description: "Time's up for Physics & Chemistry. Now starting Mathematics."});
    }
  }, [sectionTime, totalTime, currentSection, finishTest, isPreview, toast]);

  if (!test || questions.length === 0) return <div>Loading test...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-headline font-bold">{test.name}{isPreview && " (Preview)"}</h1>
        <div className="flex items-center gap-6">
            <div className="text-center">
                <div className="text-sm text-muted-foreground">Section Time</div>
                <div className="font-mono text-lg font-bold flex items-center"><Clock className="mr-2 h-4 w-4"/>{formatTime(sectionTime)}</div>
            </div>
            <div className="text-center">
                <div className="text-sm text-muted-foreground">Total Time Left</div>
                <div className="font-mono text-lg font-bold flex items-center"><Clock className="mr-2 h-4 w-4"/>{formatTime(totalTime)}</div>
            </div>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-4 gap-6 p-4 overflow-hidden">
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1">
            <CardContent className="p-6 h-full flex flex-col">
              <p className="mb-2 text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length} | Subject: {currentQuestion.subject}
              </p>
              <p className="font-semibold text-lg mb-6 flex-shrink-0">{currentQuestion.question}</p>
              <div className="flex-1 overflow-y-auto">
                <RadioGroup value={answers[currentQuestion.id]} onValueChange={handleAnswerChange} className="space-y-4">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <Label key={key} className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                      <RadioGroupItem value={key} id={`q${currentQuestion.id}-opt-${key}`} />
                      <span>{value}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0}>Previous</Button>
            <div>
                <Button variant="outline" onClick={() => setAnswers(prev => { const newAnswers = {...prev}; delete newAnswers[currentQuestion.id]; return newAnswers; })}>Clear Response</Button>
            </div>
            <Button onClick={() => setCurrentQuestionIndex(i => i + 1)} disabled={currentQuestionIndex === questions.length - 1}>Next</Button>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <Card className="flex-1">
            <CardContent className="p-4 h-full">
              <h3 className="font-bold mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2 overflow-y-auto h-[calc(100%-60px)] pr-2">
                {questions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={currentQuestionIndex === index ? 'default' : answers[q.id] ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-9 w-9"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >{index + 1}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
           <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full mt-4" variant="destructive"><AlertTriangle className="mr-2 h-4 w-4"/> Finish Test</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You cannot change your answers after submitting. Your test will be graded based on your current responses.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={finishTest}>Yes, Submit Test</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>
    </div>
  );
}
