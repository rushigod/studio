'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LoginFormProps {
  role: 'student' | 'admin';
  title: string;
  description: string;
}

export function LoginForm({ role, title, description }: LoginFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  };
  
  if (role === 'student') {
    return (
       <Card className="w-full max-w-sm border-2 shadow-xl hover:border-primary transition-all duration-300">
        <form onSubmit={handleSubmit}>
            <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                    Ready to test your knowledge? Jump right into your dashboard.
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
            </CardFooter>
        </form>
       </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm border-2 shadow-xl">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              defaultValue="admin@test.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" defaultValue="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Login
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
