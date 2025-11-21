import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
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

interface SupabaseEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
 created_by?: string;
}

interface CalendarProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  
  const { user } = useAuth();
  
  // Fetch events from Supabase database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events for user:', user?.id || 'not authenticated');
        
        // Build the query - for now, let's fetch all events to see if they exist
        // Later we can filter by user if needed
        let query = supabase
          .from('events')
          .select('*');
        
        // If user exists, filter by created_by
        if (user?.id) {
          console.log('Filtering events by user:', user.id);
          query = query.eq('created_by', user.id);
        } else {
          console.log('No user authenticated, fetching all events');
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching events:', error);
        } else if (data) {
          console.log('Raw events data from database:', data);
          
          // Convert date strings to Date objects
          const formattedEvents = data.map((event: SupabaseEvent) => ({
            id: event.id,
            title: event.title,
            startTime: new Date(event.start_time),
            endTime: new Date(event.end_time),
            description: event.description || ''
          }));
          
          console.log('Formatted events:', formattedEvents);
          setEvents(formattedEvents);
        } else {
          console.log('No events found in database');
          setEvents([]);
        }
      } catch (error) {
        console.error('Unexpected error fetching events:', error);
      }
    };
    
    fetchEvents();
  }, [user?.id]);
  
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

  const handleAddEventSubmit = async (newEvent: Omit<Event, 'id'>) => {
    try {
      console.log('Saving new event:', newEvent, 'for user:', user?.id);
      
      // Save event to Supabase database
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          start_time: newEvent.startTime.toISOString(),
          end_time: newEvent.endTime.toISOString(),
          description: newEvent.description,
          created_by: user?.id // Associate event with current user
        }])
        .select();

      if (error) {
        console.error('Error saving event:', error);
        alert('Failed to save event to database: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        console.log('Event saved successfully:', data[0]);
        
        // Add the new event to the local state with proper ID from database
        const newEventWithId: Event = {
          id: data[0].id,
          title: data[0].title,
          startTime: new Date(data[0].start_time),
          endTime: new Date(data[0].end_time),
          description: data[0].description || ''
        };
        setEvents(prevEvents => [...prevEvents, newEventWithId]);
      }
    } catch (error) {
      console.error('Unexpected error saving event:', error);
      alert('An unexpected error occurred while saving the event');
    } finally {
      setIsAddEventFormOpen(false);
    }
  };


 return (
    <div className="bg-[#353131] text-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto border border-[#FFD966]">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onGoToToday={onGoToToday}
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