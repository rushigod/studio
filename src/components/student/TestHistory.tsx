import { tests, studentAttempt } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export function TestHistory() {
  const completedTests = tests.filter(test => test.status === 'Completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test History</CardTitle>
        <CardDescription>Review your past performances and analyze your results.</CardDescription>
      </CardHeader>
      <CardContent>
        {completedTests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Test Name</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedTests.map(test => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{format(new Date(test.scheduledAt.getTime() + 180 * 60 * 1000), 'PPP')}</TableCell>
                  <TableCell>
                    <span className="font-bold">{studentAttempt.score}</span> / 200
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/student/review/${test.id}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        Review
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="ml-2">
                      <Link href={`/student/analytics/${test.id}`}>
                        <BarChart2 className="mr-2 h-3 w-3" />
                        Analytics
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>You haven't completed any tests yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
