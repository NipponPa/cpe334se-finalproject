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
 isAllDay?: boolean;
  reminder_minutes?: number | null;
}

interface SupabaseEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  created_by?: string;
  is_all_day?: boolean;
  reminder_minutes?: number | null;
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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const { user } = useAuth();
  
  // Function to process due notifications
  const processDueNotifications = async () => {
    if (!user) return;

    try {
      // Get current time
      const now = new Date().toISOString();

      // Fetch notifications that are scheduled for the past and not yet sent
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'event_reminder')
        .is('sent_at', null) // Not yet sent
        .lte('scheduled_at', now) // Scheduled time is in the past
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error('Error fetching due notifications:', error);
        return;
      }

      if (notifications && notifications.length > 0) {
        console.log(`Found ${notifications.length} due notifications to process`);

        for (const notification of notifications) {
          // Update the notification as sent
          const { error: updateError } = await supabase
            .from('notifications')
            .update({ sent_at: now, is_read: false })
            .eq('id', notification.id);

          if (updateError) {
            console.error('Error updating notification as sent:', updateError);
            continue;
          }

          // Show browser notification if supported
          if ('Notification' in window) {
            // Request notification permission if not already granted
            if (Notification.permission === 'granted') {
              new Notification(notification.title, {
                body: notification.message,
                icon: '/calender.svg' // Using the available calendar icon
              });
            } else if (Notification.permission !== 'denied') {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: '/calender.svg'
                });
              }
            }
          }

          console.log('Notification processed:', notification.title);
        }
      }
    } catch (error) {
      console.error('Error in processDueNotifications:', error);
    }
  };

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
          const formattedEvents = data.map((event: SupabaseEvent) => {
            // For all events, create Date objects from the ISO string
            const startTime = new Date(event.start_time);
            const endTime = new Date(event.end_time);
            
            return {
              id: event.id,
              title: event.title,
              startTime: startTime,
              endTime: endTime,
              description: event.description || '',
              isAllDay: event.is_all_day,
              reminder_minutes: event.reminder_minutes
            };
          });
          
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
    processDueNotifications(); // Process any due notifications when events are fetched
  }, [user?.id]);
  
  // Set up a periodic check for due notifications
 useEffect(() => {
    if (!user) return;

    // Check for due notifications every minute
    const intervalId = setInterval(() => {
      processDueNotifications();
    }, 60000); // 6000 ms = 1 minute

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [user?.id]);

  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
  };

  const handleCloseDetail = () => {
    setSelectedDay(null);
  };

  const handleAddEvent = () => {
    setEditingEvent(null); // Clear any editing event when adding a new event
    setIsAddEventFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsAddEventFormOpen(true);
    // Set the selected day to the event's start date to show the context
    setSelectedDay(new Date(event.startTime));
  };

  const handleDeleteEvent = async (event: Event) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', event.id);
        
        if (error) {
          console.error('Error deleting event:', error);
          alert('Failed to delete event: ' + error.message);
          return;
        }
        
        // Remove the event from the local state
        setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
        console.log('Event deleted successfully');
      } catch (error) {
        console.error('Unexpected error deleting event:', error);
        alert('An unexpected error occurred while deleting the event');
      }
    }
  };

  const handleAddEventFormClose = () => {
    setIsAddEventFormOpen(false);
    setEditingEvent(null); // Clear editing event when closing form
 };

  const handleAddEventSubmit = async (newEvent: Omit<Event, 'id'>) => {
    try {
      console.log('Handling event submission:', newEvent, 'for user:', user?.id);
      console.log('Editing event state:', editingEvent);
      
      if (editingEvent) {
        // Update existing event
        console.log('Updating existing event with ID:', editingEvent.id);
        const { data, error } = await supabase
          .from('events')
          .update({
            title: newEvent.title,
            start_time: newEvent.startTime.toISOString(),
            end_time: newEvent.endTime.toISOString(),
            description: newEvent.description,
            is_all_day: newEvent.isAllDay,
            reminder_minutes: newEvent.reminder_minutes
          })
          .eq('id', editingEvent.id)
          .select();

        if (error) {
          console.error('Error updating event:', error);
          alert('Failed to update event in database: ' + error.message);
          return;
        }

        if (data && data.length > 0) {
          console.log('Event updated successfully:', data[0]);
          
          // Update the event in the local state
          setEvents(prevEvents =>
            prevEvents.map(event =>
              event.id === editingEvent.id
                ? {
                    id: data[0].id,
                    title: data[0].title,
                    startTime: new Date(data[0].start_time),
                    endTime: new Date(data[0].end_time),
                    description: data[0].description || '',
                    isAllDay: newEvent.isAllDay,
                    reminder_minutes: newEvent.reminder_minutes
                  }
                : event
            )
          );
        }
      } else {
        // For new events, the event is already created in AddEventForm, so we just need to refresh the list
        // Fetch all events again to update the local state
        console.log('Event already created in AddEventForm, refreshing event list');
        
        let eventsData;
        
        // If user exists, filter by created_by
        if (user?.id) {
          console.log('Filtering events by user:', user.id);
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('created_by', user.id);
          
          if (error) {
            console.error('Error fetching user events:', error);
            alert('Failed to refresh events: ' + error.message);
            return;
          }
          
          eventsData = data;
        } else {
          console.log('No user authenticated, fetching all events');
          const { data, error } = await supabase
            .from('events')
            .select('*');
          
          if (error) {
            console.error('Error fetching events after creation:', error);
            alert('Failed to refresh events: ' + error.message);
            return;
          }
          
          eventsData = data;
        }
        
        if (eventsData) {
          // Convert date strings to Date objects
          const formattedEvents = eventsData.map((event: SupabaseEvent) => {
            const startTime = new Date(event.start_time);
            const endTime = new Date(event.end_time);
            
            return {
              id: event.id,
              title: event.title,
              startTime: startTime,
              endTime: endTime,
              description: event.description || '',
              isAllDay: event.is_all_day,
              reminder_minutes: event.reminder_minutes
            };
          });
          
          setEvents(formattedEvents);
          console.log('Events refreshed successfully');
        }
      }
      
      // Success message
      console.log('Event submission handled successfully');
    } catch (error) {
      console.error('Unexpected error handling event submission:', error);
      alert('An unexpected error occurred while handling the event submission');
    } finally {
      setIsAddEventFormOpen(false);
      setEditingEvent(null); // Clear editing event after saving
      console.log('Form closed and state reset');
    }
 };


 return (
    <div className="bg-gradient-to-br from-[#292828] to-[#353131] text-white rounded-lg shadow-2xl p-6 max-w-6xl mx-auto">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onGoToToday={onGoToToday}
        onAddEvent={handleAddEvent}
        selectedDay={selectedDay}
      />
      <CalendarGrid currentDate={currentDate} events={events} onDayClick={handleDayClick} onEventClick={handleEditEvent} selectedDay={selectedDay} />
      {selectedDay && (
        <EventDetailView
          selectedDay={selectedDay}
          events={events}
          onClose={handleCloseDetail}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
      <AddEventForm
        isOpen={isAddEventFormOpen}
        onClose={handleAddEventFormClose}
        onSave={handleAddEventSubmit}
        selectedDay={selectedDay || new Date()}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Calendar;