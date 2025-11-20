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
  
  // Check if any events fall on this date
  const hasEvents = events.some(event =>
    event.startTime.toDateString() === date.toDateString()
  );

  const handleClick = () => {
    onDayClick(date);
  };

  return (
    <div
      className="border-r border-b border-[#FFD966] h-16 p-1 last:border-r-0 cursor-pointer hover:bg-[#4a4646]"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center flex-col">
        <span className={`
          ${isToday ? 'bg-[#FFD966] text-[#353131] rounded-full w-7 h-7 flex items-center justify-center' : ''}
          ${isCurrentMonth ? 'text-[#FFD966]' : 'text-gray-500'}
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