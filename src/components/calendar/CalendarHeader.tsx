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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition"
            title="Previous month"
          >
            {/* Left chevron */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 6L9 12l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h2 className="text-2xl font-semibold text-white">{monthYearString}</h2>

          <button
            onClick={onNextMonth}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition"
            title="Next month"
          >
            {/* Right chevron */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <button
          onClick={onGoToToday}
          className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-sm text-white transition"
          title="Go to today"
        >
          Today
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        {selectedDay && (
          <div className="bg-[#FFD966] text-[#353131] px-3 py-1 rounded-md text-sm font-medium">
            Selected: {selectedDayString}
          </div>
        )}
        <button
          onClick={onAddEvent}
          className="bg-[#FFD966] hover:bg-[#FFD966]/90 text-[#353131] px-4 py-2 rounded-md font-semibold text-sm w-full sm:w-auto flex items-center gap-2 justify-center shadow-sm"
        >
          {/* Plus icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="inline">
            <path d="M12 5v14M5 12h14" stroke="#353131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Event
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;