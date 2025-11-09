'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CalendarContextType = {
  calendarRef: React.RefObject<any>;
  view: string;
  setView: (view: string) => void;
  date: Date;
  setDate: (date: Date) => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const calendarRef = React.useRef<any>(null);
  const [view, setView] = useState('dayGridMonth');
  const [date, setDate] = useState(new Date());

  return (
    <CalendarContext.Provider value={{ calendarRef, view, setView, date, setDate }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};