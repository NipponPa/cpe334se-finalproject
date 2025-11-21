import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onGoToToday?: () => void;
  onAddEvent?: () => void;
  selectedDay?: Date | null;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onAddEvent,
  selectedDay
}) => {
  // Format the date to display month and year (e.g., "November 2025")
  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Format the selected day for display
  const selectedDayString = selectedDay ? selectedDay.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }) : '';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <h2 className="text-2xl font-semibold">{monthYearString}</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        {selectedDay && (
          <div className="bg-[#FFD966] text-[#353131] px-3 py-1 rounded-md text-sm font-medium">
            Selected: {selectedDayString}
          </div>
        )}
        <button
          onClick={onAddEvent}
          className="bg-[#FFD966] hover:bg-yellow-50 text-[#353131] px-6 py-3 rounded-md font-bold text-lg w-full sm:w-auto"
        >
          Add Event
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;