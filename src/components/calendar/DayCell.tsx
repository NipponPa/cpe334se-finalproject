import React from 'react';

interface Event {
  id: string | number;
  title: string;
  startTime: Date;
 endTime: Date;
 description: string;
 isAllDay?: boolean;
}

interface DayCellProps {
  date: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
  onEventClick?: (event: Event) => void;
 isSelected?: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ date, events, onDayClick, onEventClick, isSelected }) => {
  const day = date.getDate();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();
  const isToday = date.toDateString() === new Date().toDateString();
  
  // Filter events that fall on this specific date
  const dayEvents = events.filter(event => {
    // Convert dates to just the date part (without time) for comparison
    // For all-day events, we only need to compare the date part
    const eventStartDate = new Date(event.startTime.getFullYear(), event.startTime.getMonth(), event.startTime.getDate());
    const eventEndDate = new Date(event.endTime.getFullYear(), event.endTime.getMonth(), event.endTime.getDate());
    const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Check if the current date falls within the event's date range
    return currentDate >= eventStartDate && currentDate <= eventEndDate;
  });

  const handleClick = () => {
    onDayClick(date);
  };

  // Format time for display (only for timed events)
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`
        relative h-24 p-2 cursor-pointer transition-colors duration-150
        border-l border-r border-gray-700
        ${isToday ? 'bg-[#FFD966]/10 ring-1 ring-[#FFD966]/60' : 'bg-transparent'}
        ${isSelected ? 'ring-2 ring-[#FFD966]/60 bg-[#FFD966]/10' : 'hover:bg-white/3'}
      `}
      onClick={handleClick}
    >
      <div className="w-full h-full flex flex-col">
        <span className={`
          inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold
          ${isCurrentMonth ? 'bg-white/5 text-white' : 'bg-transparent text-gray-400'}
          ${isSelected ? 'bg-[#FFD966] text-[#353131]' : ''}
        `}>
          {day}
        </span>

        <div className="flex-grow overflow-y-auto mt-2 space-y-2 pr-1">
          {dayEvents.slice(0, 4).map((event, index) => {
            const timeString = event.isAllDay ? 'All day' : formatTime(event.startTime);
            
            // Determine if this day is the start, middle, or end of a multi-day event
            let eventStart, eventEnd;
            if (event.isAllDay) {
              // For all-day events, use the date part only
              eventStart = new Date(event.startTime.getFullYear(), event.startTime.getMonth(), event.startTime.getDate());
              eventEnd = new Date(event.endTime.getFullYear(), event.endTime.getMonth(), event.endTime.getDate());
            } else {
              eventStart = new Date(event.startTime);
              eventEnd = new Date(event.endTime);
            }
            
            const isMultiDay = eventStart.toDateString() !== eventEnd.toDateString();
            const isStartDay = date.toDateString() === eventStart.toDateString();
            const isEndDay = date.toDateString() === eventEnd.toDateString();
            
            // New compact, modern event pill design
            let eventClass = "flex items-center gap-2 text-sm p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-opacity truncate cursor-pointer";
            
            // Add small accent bar for multi-day/colored event marker
            const accentClass = event.isAllDay ? "bg-[#FFD966]" : "bg-[#FFD966]";

            // Add special styling for multi-day events (keeps existing logic, but simplified visuals)
            if (isMultiDay) {
              if (isStartDay && isEndDay) {
                // Keep accent both sides visually - simplified by ring
                eventClass += " ring-1 ring-[#4a4646]/30";
              } else if (isStartDay) {
                eventClass += " rounded-l-md";
              } else if (isEndDay) {
                eventClass += " rounded-r-md";
              } else {
                eventClass += " opacity-95";
              }
            }

            return (
              <div
                key={event.id}
                className={eventClass}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent day click when clicking event
                  if (onEventClick) onEventClick(event);
                }}
              >
                <div className={`w-1 h-5 rounded-sm ${accentClass} flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-sm">{event.title}</div>
                  {timeString && (
                    <div className="text-[0.65rem] text-gray-300 leading-none">{timeString}</div>
                  )}
                </div>
              </div>
            );
          })}
          {dayEvents.length > 4 && (
            <div className="text-sm text-[#FFD966]">+{dayEvents.length - 4} more</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayCell;