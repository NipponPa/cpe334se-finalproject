'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import Calendar from '@/components/calendar/Calendar';

export default function Home() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#353131] py-8 px-4">
        <div className="max-w-6xl mx-auto mt-8">
          <Calendar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
