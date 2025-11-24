'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();

  // If user is already logged in, redirect to home
  if (user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#353131] p-4">
      <div className="w-full max-w-2xl bg-[#353131] p-8 rounded-lg shadow-md flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-[#FFD966]">Welcome to PakjimPlanner</h1>
          <p className="text-lg text-[#FFD966] mb-6">
            Your personal calendar and event management solution
          </p>
          <p className="text-[#FFD966]">
            Manage your schedule, plan events, and stay organized with our intuitive calendar application.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/login" className="w-full">
            <Button
              type="button"
              className="w-full py-3 bg-transparent border border-[#FFD966] text-[#FFD966] rounded hover:bg-[#FFD966] hover:text-[#353131] font-bold text-lg"
            >
              Log In
            </Button>
          </Link>
          
          <Link href="/signup" className="w-full">
            <Button
              type="button"
              className="w-full py-3 bg-transparent border border-[#FFD966] text-[#FFD966] rounded hover:bg-[#FFD966] hover:text-[#353131] font-bold text-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#FFD966]">
            Experience seamless calendar management with Google integration and secure authentication.
          </p>
        </div>
      </div>
    </div>
  );
}