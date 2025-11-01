import { studentAttempt, tests } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage({ params }: { params: { testId: string } }) {
  const test = tests.find(t => t.id === params.testId);

  if (!test) {
    return <div>Test not found</div>;
  }
  
  const timeData = studentAttempt.timeSpentPerQuestion
  .slice(0, 20) // show top 20 for brevity
  .map(item => ({
    name: item.questionText,
    time: item.time,
  })).reverse();
  
  const topTimeConsuming = studentAttempt.timeSpentPerQuestion.slice(0, 5);

  const subjectData = [
    { subject: 'Physics', score: studentAttempt.subjectWiseScores.physics, accuracy: studentAttempt.subjectWiseAccuracy.physics, total: 50 },
    { subject: 'Chemistry', score: studentAttempt.subjectWiseScores.chemistry, accuracy: studentAttempt.subjectWiseAccuracy.chemistry, total: 50 },
    { subject: 'Mathematics', score: studentAttempt.subjectWiseScores.mathematics, accuracy: studentAttempt.subjectWiseAccuracy.mathematics, total: 100 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground">{test.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Score</div>
            <div className="text-3xl font-bold">{studentAttempt.score}<span className="text-lg text-muted-foreground">/200</span></div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Correct</div>
              <div className="text-2xl font-bold">{studentAttempt.correctCount}</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Incorrect</div>
              <div className="text-2xl font-bold">{studentAttempt.incorrectCount}</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Unattempted</div>
              <div className="text-2xl font-bold">{studentAttempt.unattemptedCount}</div>
            </div>
          </Card>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectData.map(s => (
                  <TableRow key={s.subject}>
                    <TableCell className="font-medium">{s.subject}</TableCell>
                    <TableCell>{s.score} / {s.total}</TableCell>
                    <TableCell>{s.accuracy}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Time Sinks</CardTitle>
            <CardDescription>Questions where you spent the most time.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead className="text-right">Time Spent (s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTimeConsuming.map(q => (
                  <TableRow key={q.questionId}>
                    <TableCell><Link href={`/student/review/${params.testId}#${q.questionId}`} className="hover:underline text-primary">{q.questionText}</Link></TableCell>
                    <TableCell className="text-right font-mono">{q.time}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Management Analysis</CardTitle>
          <CardDescription>Time spent on each question (Top 20 shown).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="s" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }}/>
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                <Bar dataKey="time" fill="hsl(var(--primary))" barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
