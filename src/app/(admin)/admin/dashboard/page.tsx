import { tests } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor all CET mock tests.</p>
        </div>
        <Button asChild>
          <Link href="/admin/upload">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Test Name</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map(test => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{format(test.scheduledAt, 'PPP p')}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={test.status === 'Live' ? 'destructive' : test.status === 'Completed' ? 'secondary' : 'default'}
                      className={`${test.status === 'Upcoming' && 'bg-blue-500/20 text-blue-700 border-blue-500/30'}`}
                    >
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild disabled={test.status !== 'Upcoming'}>
                        <Link href="#">
                            <Edit className="mr-2 h-3 w-3"/> Edit
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="ml-2">
                        <Link href="/student/test/mock-test-1?preview=true">
                            <Eye className="mr-2 h-3 w-3"/> Preview
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
