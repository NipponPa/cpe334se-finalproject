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
      <h2 className="text-2xl font-semibold">{monthYearString}</h2>
      <button
        onClick={onAddEvent}
        className="bg-[#FFD966] hover:bg-yellow-50 text-[#353131] px-6 py-3 rounded-md font-bold text-lg"
      >
        Add Event
      </button>
    </div>
  );
};

export default CalendarHeader;