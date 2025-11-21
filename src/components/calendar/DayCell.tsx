import React from 'react';

interface Event {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

interface DayCellProps {
  date: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({ date, events, onDayClick }) => {
  const day = date.getDate();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();
  const isToday = date.toDateString() === new Date().toDateString();
  
  // Check if any events fall on this date (including multi-day events)
  const hasEvents = events.some(event => {
    // Convert dates to just the date part (without time) for comparison
    const eventStartDate = new Date(event.startTime.toDateString());
    const eventEndDate = new Date(event.endTime.toDateString());
    const currentDate = new Date(date.toDateString());
    
    // Check if the current date falls within the event's date range
    return currentDate >= eventStartDate && currentDate <= eventEndDate;
  });

  const handleClick = () => {
    onDayClick(date);
  };

  return (
    <div
      className="border-r border-b border-[#FFD966] h-20 p-2 last:border-r-0 cursor-pointer hover:bg-[#4a4646]"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center flex-col">
        <span className={`
          ${isToday ? 'border-2 border-[#FFD966] rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold' : ''}
          ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
        `}>
          {day}
        </span>
        {hasEvents && (
          <div className="w-2 h-2 bg-[#FFD966] rounded-full mt-1"></div>
        )}
      </div>
    </div>
  );
};

export default DayCell;