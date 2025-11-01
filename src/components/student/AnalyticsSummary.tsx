import { studentAttempt } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart2, CheckCircle, Target } from 'lucide-react';

export function AnalyticsSummary() {
  const avgScore = 135;
  const avgAccuracy = 70;

  const subjects = [
    { name: 'Physics', accuracy: studentAttempt.subjectWiseAccuracy.physics, score: studentAttempt.subjectWiseScores.physics, total: 50 },
    { name: 'Chemistry', accuracy: studentAttempt.subjectWiseAccuracy.chemistry, score: studentAttempt.subjectWiseScores.chemistry, total: 50 },
    { name: 'Mathematics', accuracy: studentAttempt.subjectWiseAccuracy.mathematics, score: studentAttempt.subjectWiseScores.mathematics, total: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Analytics Summary</CardTitle>
        <CardDescription>A quick look at your average performance across all tests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore} / 200</div>
              <p className="text-xs text-muted-foreground">Based on all attempted tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAccuracy}%</div>
              <p className="text-xs text-muted-foreground">Average correct answers</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
          <div className="space-y-4">
            {subjects.map(subject => (
              <div key={subject.name}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">{subject.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: <span className="font-bold text-foreground">{subject.score}/{subject.total}</span> | Accuracy: <span className="font-bold text-foreground">{subject.accuracy}%</span>
                  </p>
                </div>
                <Progress value={subject.accuracy} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
