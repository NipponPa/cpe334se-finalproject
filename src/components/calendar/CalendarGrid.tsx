import React from 'react';
import DayCell from './DayCell';

interface Event {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  isAllDay?: boolean;
}


interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  selectedDay?: Date | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onDayClick, onEventClick, selectedDay }) => {
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate the days to display in the grid
  const getCalendarDays = () => {
    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    // Get the number of days in the month
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Calculate the start date (first day to show, including leading days from previous month)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfWeek); // Adjust to the first Sunday of the grid
    
    // Generate the 42 days (6 weeks x 7 days) for the calendar grid
    const days = [];
    for (let i = 0; i < 42; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
      days.push(dayDate);
    }
    
    return days;
  };

  const days = getCalendarDays();

  return (
    <div className="bg-[#353131] rounded-lg overflow-hidden border border-[#FFD966]">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 bg-[#FFD966]">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="py-3 text-center font-medium text-[#353131] border-r border-[#353131] last:border-r-0 text-lg"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => (
          <DayCell
            key={index}
            date={date}
            events={events}
            onDayClick={onDayClick}
            onEventClick={onEventClick}
            isSelected={selectedDay ? date.toDateString() === selectedDay.toDateString() : false}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;