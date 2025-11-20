import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventDetailView from './EventDetailView';
import AddEventForm from './AddEventForm';

interface Event {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
  
  // Hardcoded events array as per requirements
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Team Meeting",
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(11, 0, 0, 0)),
      description: "Weekly team sync"
    },
    {
      id: 2,
      title: "Lunch with Client",
      startTime: new Date(new Date().setHours(13, 0, 0)),
      endTime: new Date(new Date().setHours(14, 0, 0, 0)),
      description: "Discuss project requirements"
    }
  ]);
  
  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
  };

  const handleCloseDetail = () => {
    setSelectedDay(null);
  };

  const handleAddEvent = () => {
    setIsAddEventFormOpen(true);
  };

  const handleAddEventFormClose = () => {
    setIsAddEventFormOpen(false);
  };

  const handleAddEventSubmit = (newEvent: Omit<Event, 'id'>) => {
    const eventWithId: Event = {
      ...newEvent,
      id: Date.now().toString() // Generate a simple ID for now
    };
    setEvents(prevEvents => [...prevEvents, eventWithId]);
    setIsAddEventFormOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      newDate.setDate(1); // Set to first day of the month
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1); // Set to first day of the month
      return newDate;
    });
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

 return (
    <div className="bg-[#353131] text-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto border border-[#FFD966]">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onGoToToday={handleGoToToday}
        onAddEvent={handleAddEvent}
      />
      <CalendarGrid currentDate={currentDate} events={events} onDayClick={handleDayClick} />
      {selectedDay && (
        <EventDetailView
          selectedDay={selectedDay}
          events={events}
          onClose={handleCloseDetail}
          onAddEvent={handleAddEvent}
        />
      )}
      <AddEventForm
        isOpen={isAddEventFormOpen}
        onClose={handleAddEventFormClose}
        onSave={handleAddEventSubmit}
        selectedDay={selectedDay || new Date()}
      />
    </div>
  );
};

export default Calendar;