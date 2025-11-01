import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvailableTests } from '@/components/student/AvailableTests';
import { TestHistory } from '@/components/student/TestHistory';
import { AnalyticsSummary } from '@/components/student/AnalyticsSummary';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Ready for your next challenge?</p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Tests</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <AvailableTests />
        </TabsContent>
        <TabsContent value="history">
          <TestHistory />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
