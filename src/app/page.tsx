'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Calendar from '@/components/Calendar';

export default function Home() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#353131]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#FFD966]">
            Welcome, {user?.email || 'User'}!
          </h1>
          
          <div className="mt-8">
            <Calendar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
