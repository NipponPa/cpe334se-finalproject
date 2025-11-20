import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onGoToToday?: () => void;
  onAddEvent?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onAddEvent
}) => {
 // Format the date to display month and year (e.g., "November 2025")
  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevMonth}
          className="bg-[#FFD966] hover:bg-yellow-500 text-[#353131] rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          {'<'}
        </button>
        <h2 className="text-xl font-semibold">{monthYearString}</h2>
        <button
          onClick={onNextMonth}
          className="bg-[#FFD966] hover:bg-yellow-500 text-[#353131] rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          {'>'}
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onAddEvent}
          className="bg-[#FFD966] hover:bg-yellow-500 text-[#353131] px-4 py-2 rounded-md font-bold"
        >
          Add Event
        </button>
        <button
          onClick={onGoToToday}
          className="bg-[#FFD966] hover:bg-yellow-500 text-[#353131] px-4 py-2 rounded-md font-bold"
        >
          Today
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;