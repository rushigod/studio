import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, User, UserCog } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          CET Prep Pro
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          A comprehensive web application that simulates the Maharashtra Common Entrance Test (MHT CET) for engineering aspirants.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl">
        <Link href="/login?role=student" className="group">
          <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-2xl">Student Login</CardTitle>
                    <CardDescription>Take tests and track your progress</CardDescription>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/login?role=admin" className="group">
          <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <UserCog className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                    <CardDescription>Manage tests and view results</CardDescription>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}
