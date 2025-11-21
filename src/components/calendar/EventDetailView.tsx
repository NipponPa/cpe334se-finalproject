import React from 'react';

interface Event {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

interface EventDetailViewProps {
  selectedDay: Date | null;
  events: Event[];
  onClose: () => void;
  onAddEvent: () => void;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ 
  selectedDay, 
  events, 
  onClose, 
  onAddEvent 
}) => {
  if (!selectedDay) {
    return null;
  }

  // Filter events for the selected day (including multi-day events)
  const dayEvents = events.filter(event => {
    // Convert dates to just the date part (without time) for comparison
    const eventStartDate = new Date(event.startTime.toDateString());
    const eventEndDate = new Date(event.endTime.toDateString());
    const selectedDate = new Date(selectedDay.toDateString());
    
    // Check if the selected date falls within the event's date range
    return selectedDate >= eventStartDate && selectedDate <= eventEndDate;
  });

  // Sort events by start time
  const sortedEvents = dayEvents.sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );

  // Format the date as "Saturday, August 17, 2024"
  const formattedDate = selectedDay.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#353131] text-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-[#FFD966]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{formattedDate}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <div className="mb-6">
          {sortedEvents.length > 0 ? (
            <div className="space-y-3">
              {sortedEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-3 bg-[#4a4646] rounded border border-[#FFD966]"
                >
                  <h3 className="font-semibold text-[#FFD966]">{event.title}</h3>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-400">No events scheduled</p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onAddEvent}
            className="px-4 py-2 bg-[#FFD966] text-[#353131] rounded hover:bg-[#ffc827] focus:outline-none"
          >
            Add Event
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailView;