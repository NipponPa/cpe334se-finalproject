'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Calendar from '@/components/Calendar';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#353131]">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mt-8">
            <Calendar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
