'use client';

import React from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import ProfileDropDown from './ProfileDropDown';
import { ChevronLeft, ChevronRight, Bell, User } from 'lucide-react';

const Navbar = () => {
  const { calendarRef, setView, view, date, setDate } = useCalendar();

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      setDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      setDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      setDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setView(e.target.value);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(e.target.value);
    }
  };

  return (
    <nav className="bg-[#353131] text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#FFD966]">PJ pakjim planner</h1>
        <button onClick={handleToday} className="ml-4 bg-[#FFD966] text-black px-4 py-2 rounded">Today</button>
        <div className="ml-4 flex items-center">
          <button onClick={handlePrev}><ChevronLeft /></button>
          <h2 className="mx-4">{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h2>
          <button onClick={handleNext}><ChevronRight /></button>
        </div>
      </div>
      <div className="flex items-center">
        <select onChange={handleViewChange} value={view} className="bg-[#353131] text-white border border-white rounded px-2 py-1">
          <option value="dayGridMonth">Month</option>
          <option value="timeGridWeek">Week</option>
          <option value="timeGridDay">Day</option>
        </select>
        <button className="ml-4"><Bell /></button>
        <ProfileDropDown />
      </div>
    </nav>
  );
};

export default Navbar;