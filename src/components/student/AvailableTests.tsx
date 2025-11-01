'use client';

import { useState, useEffect } from 'react';
import { tests } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function AvailableTests() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const upcomingTests = tests.filter(test => test.status === 'Upcoming');

  if (!isMounted || !currentTime) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Available & Upcoming Tests</CardTitle>
                <CardDescription>Start any available test or see what's scheduled.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available & Upcoming Tests</CardTitle>
        <CardDescription>Start any available test or see what's scheduled.</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingTests.length > 0 ? (
          <div className="space-y-4">
            {upcomingTests.map(test => {
              const isLive = test.scheduledAt <= currentTime;
              return (
                <Card key={test.id} className="flex flex-col sm:flex-row items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold">{test.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{format(test.scheduledAt, 'PPP p')}</span>
                    </div>
                  </div>
                  <Button asChild disabled={!isLive} className="mt-4 sm:mt-0 w-full sm:w-auto bg-accent hover:bg-accent/80">
                    <Link href={`/student/test/${test.id}`}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {isLive ? 'Start Test' : 'Upcoming'}
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No new tests scheduled at the moment. Check back later!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
