'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Calendar from '@/components/calendar/Calendar';
import NavigationBar from '@/components/layout/NavigationBar';

export default function Home() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      newDate.setDate(1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1);
      return newDate;
    });
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <ProtectedRoute>
      <NavigationBar
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onGoToToday={handleGoToToday}
      />
      <div className="min-h-screen bg-[#353131] py-8 px-4">
        <div className="max-w-6xl mx-auto mt-8">
          <Calendar
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onGoToToday={handleGoToToday}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
