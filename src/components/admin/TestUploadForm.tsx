'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, UploadCloud, CheckCircle2, AlertTriangle, Loader2, FileJson, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { validateTestQuestions, ValidateTestQuestionsOutput, ValidateTestQuestionsInput } from '@/ai/flows/validate-test-questions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FileState = {
  name: string | null;
  content: any | null;
};

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export function TestUploadForm() {
  const { toast } = useToast();
  const [testName, setTestName] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  
  const [physicsFile, setPhysicsFile] = useState<FileState>({ name: null, content: null });
  const [chemistryFile, setChemistryFile] = useState<FileState>({ name: null, content: null });
  const [mathFile, setMathFile] = useState<FileState>({ name: null, content: null });

  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [validationErrors, setValidationErrors] = useState<ValidateTestQuestionsOutput['errors']>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, subject: 'physics' | 'chemistry' | 'mathematics') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid JSON file.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonContent = JSON.parse(event.target?.result as string);
          const fileState = { name: file.name, content: jsonContent };
          if (subject === 'physics') setPhysicsFile(fileState);
          else if (subject === 'chemistry') setChemistryFile(fileState);
          else setMathFile(fileState);
          setValidationStatus('idle'); // Reset validation on file change
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'JSON Parsing Error',
            description: 'Could not parse the JSON file. Please check its format.',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = async () => {
    if (!physicsFile.content || !chemistryFile.content || !mathFile.content) {
      toast({
        variant: 'destructive',
        title: 'Missing Files',
        description: 'Please upload JSON files for all three subjects.',
      });
      return;
    }

    setValidationStatus('validating');
    setValidationErrors([]);

    const validationInput: ValidateTestQuestionsInput = {
      physics: physicsFile.content,
      chemistry: chemistryFile.content,
      mathematics: mathFile.content,
    };

    try {
      const result = await validateTestQuestions(validationInput);
      if (result.is_valid) {
        setValidationStatus('valid');
      } else {
        setValidationStatus('invalid');
        setValidationErrors(result.errors);
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationStatus('invalid');
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'An unexpected error occurred during validation.',
      });
    }
  };

  const handlePublish = () => {
    if (validationStatus !== 'valid' || !testName || !scheduleDate) {
      toast({
        variant: 'destructive',
        title: 'Cannot Publish',
        description: 'Please fill all details and ensure the test passes validation.',
      });
      return;
    }
    toast({
      title: 'Test Published!',
      description: `"${testName}" is now available for students.`,
    });
  };

  const FileInput = ({ subject, fileState, onChange }: { subject: string, fileState: FileState, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="space-y-2">
      <Label htmlFor={`${subject}-file`} className="capitalize">{subject}</Label>
      <div className="relative">
        <Input id={`${subject}-file`} type="file" accept=".json" onChange={onChange} className="pl-10" />
        <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      {fileState.name && (
        <div className="text-sm text-muted-foreground flex items-center gap-2 pt-1">
          <FileJson className="h-4 w-4" />
          <span>{fileState.name}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
            <CardDescription>Set the name and schedule for the test.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input id="test-name" placeholder="e.g., MHT CET Full Syllabus Mock Test 1" value={testName} onChange={(e) => setTestName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Schedule Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !scheduleDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(scheduleDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Uploader</CardTitle>
            <CardDescription>Upload JSON files for each subject.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-3">
            <FileInput subject="physics" fileState={physicsFile} onChange={(e) => handleFileChange(e, 'physics')} />
            <FileInput subject="chemistry" fileState={chemistryFile} onChange={(e) => handleFileChange(e, 'chemistry')} />
            <FileInput subject="mathematics" fileState={mathFile} onChange={(e) => handleFileChange(e, 'mathematics')} />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions & Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleValidate} className="w-full" disabled={validationStatus === 'validating'}>
              {validationStatus === 'validating' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Validate Test
            </Button>

            {validationStatus === 'validating' && (
              <div className="flex items-center justify-center text-sm text-muted-foreground p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validating with AI...
              </div>
            )}
            {validationStatus === 'valid' && (
              <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Validation Successful</AlertTitle>
                <AlertDescription>All questions are correctly formatted.</AlertDescription>
              </Alert>
            )}
            {validationStatus === 'invalid' && validationErrors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Validation Failed</AlertTitle>
                <AlertDescription>
                  <Accordion type="single" collapsible className="w-full mt-2">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="p-0 hover:no-underline">Found {validationErrors.length} error(s). View details.</AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          {validationErrors.map((error, index) => (
                            <li key={index}>
                              <strong>{error.subject.toUpperCase()} Q-{error.question_index + 1}:</strong> {error.error_message}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AlertDescription>
              </Alert>
            )}
            
            <hr />

            <Button variant="outline" className="w-full" disabled={validationStatus !== 'valid'}>Preview Test</Button>
            <Button onClick={handlePublish} className="w-full bg-accent hover:bg-accent/90" disabled={validationStatus !== 'valid'}>Publish Test</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
