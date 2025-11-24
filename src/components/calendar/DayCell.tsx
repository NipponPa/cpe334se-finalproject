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
        border-r border-b border-[#FFD966] h-20 p-1 last:border-r-0 cursor-pointer
        ${isToday ? 'bg-[#FFD966]/20' : ''}
        ${isSelected ? 'bg-[#FFD966] bg-opacity-30' : 'hover:bg-[#4a4646]'}
      `}
      onClick={handleClick}
    >
      <div className="w-full h-full flex flex-col">
        <span className={`
          self-start px-1 py-0.5 rounded
          ${isSelected ? 'text-[#FFD966] font-bold' : ''}
          ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
        `}>
          {day}
        </span>
        
        <div className="flex-grow overflow-y-auto mt-1 space-y-1">
          {dayEvents.slice(0, 3).map((event, index) => {
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
            
            let eventClass = "text-xs bg-[#FFD966] text-[#353131] p-1 rounded truncate cursor-pointer hover:opacity-90";
            
            // Add special styling for multi-day events
            if (isMultiDay) {
              if (isStartDay && isEndDay) {
                // Single day event within a multi-day range (shouldn't happen but just in case)
                eventClass += " border-l-4 border-l-[#4a4646]";
              } else if (isStartDay) {
                // First day of multi-day event
                eventClass += " border-l-4 border-l-[#4a4646] border-r-4 border-r-[#4a4646]";
              } else if (isEndDay) {
                // Last day of multi-day event
                eventClass += " border-r-4 border-r-[#4a4646]";
              } else {
                // Middle day of multi-day event
                eventClass += " border-l-4 border-l-[#4a4646] border-r-4 border-r-[#4a4646]";
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
                <div className="truncate font-medium">{event.title}</div>
                {timeString && (
                  <div className="text-[0.6rem] opacity-80">{timeString}</div>
                )}
              </div>
            );
          })}
          {dayEvents.length > 3 && (
            <div className="text-xs text-[#FFD966]">+{dayEvents.length - 3} more</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayCell;