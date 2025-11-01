'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function LoginContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const title = role === 'admin' ? 'Admin Login' : 'Student Login';
  const description =
    role === 'admin'
      ? 'Access the dashboard to manage tests.'
      : 'Sign in to start your exam practice.';

  return (
    <LoginForm
      role={role as 'student' | 'admin'}
      title={title}
      description={description}
    />
  );
}

function LoginSkeleton() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center space-y-2">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <Skeleton className="h-10 w-full rounded-b-lg rounded-t-none" />
        </Card>
    )
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
