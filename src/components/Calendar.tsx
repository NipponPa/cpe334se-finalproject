'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '@/contexts/AuthContext';
import { useCalendar } from '@/contexts/CalendarContext';
import { supabase } from '@/lib/supabase';
import EmptyDayView from './EmptyDayView';

// Define the event type based on the database schema
type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO date string
  end?: string; // ISO date string
  allDay?: boolean;
  description?: string;
};

// Define the type for the Supabase event row (based on selected fields)
type SupabaseEvent = {
  id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  description: string | null;
  is_all_day: boolean;
};

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { calendarRef, view, setView } = useCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEmptyView, setShowEmptyView] = useState(false);

  // Fetch events for the authenticated user from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_time, end_time, description, is_all_day')
        .eq('created_by', user.id);

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      // Transform the data to match FullCalendar's expected format
      const calendarEvents: CalendarEvent[] = data.map((event: SupabaseEvent) => ({
        id: event.id,
        title: event.title,
        start: event.start_time,
        end: event.end_time || undefined,
        allDay: event.is_all_day,
        description: event.description || undefined,
      }));

      setEvents(calendarEvents);
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    // When the calendar is re-rendered (e.g., after closing the empty day view),
    // ensure its internal view is synchronized with the state.
    if (!showEmptyView && calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  }, [showEmptyView, view]);

  // Handle event creation/update in Supabase
  const handleEventChange = async (info: any) => {
    // Update the event in the database
    const { error } = await supabase
      .from('events')
      .update({
        start_time: info.event.start.toISOString(),
        end_time: info.event.end ? info.event.end.toISOString() : null,
      })
      .eq('id', info.event.id);

    if (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDateClick = (arg: any) => {
    const clickedDate = arg.date;
    const eventsOnDate = events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      );
    });

    if (eventsOnDate.length === 0) {
      setSelectedDate(clickedDate);
      setShowEmptyView(true);
    } else {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView('timeGridDay', clickedDate);
      setView('timeGridDay');
    }
  };

  // Calendar options
  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: view,
    headerToolbar: false as const,
    events: events,
    editable: true,
    eventStartEditable: true,
    eventResizableFromStart: true,
    eventDurationEditable: true,
    selectMirror: true,
    dayMaxEvents: true,
    selectable: true,
    dateClick: handleDateClick,
    eventClick: (info: any) => {
      // Handle event click, e.g., open a modal to view/edit details
      alert(`Event: ${info.event.title}\nStart: ${info.event.startStr}\nEnd: ${info.event.endStr}`);
    },
    eventChange: handleEventChange, // Handle drag/drop and resize
    // Additional styling options
    themeSystem: 'standard',
    height: 'auto',
    contentHeight: 'auto',
    aspectRatio: 1.8, // Adjust for better appearance
    // Custom styling classes
    dayCellClassNames: ['calendar-day'],
    // Styling for dark mode
    dayHeaderClassNames: ['calendar-header'],
    eventClassNames: ['calendar-event'],
  };

  const handleBackToMonth = () => {
    setShowEmptyView(false);
    setView('dayGridMonth');
  };

  const handleAddEvent = () => {
    // Logic to add a new event, e.g., open a modal
    alert('Add event functionality to be implemented');
  };

  return (
    <div className="bg-[#353131] p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
      {showEmptyView && selectedDate ? (
        <EmptyDayView
          selectedDate={selectedDate}
          onBack={handleBackToMonth}
          onAddEvent={handleAddEvent}
        />
      ) : (
        <>
          <style jsx global>{`
            .fc table {
              border-color: #444;
              background-color: #22;
              color: #FFD966;
            }
            
            .fc .fc-button {
              background-color: #FFD966 !important;
              border-color: #FFD966 !important;
              color: #353131 !important;
              font-weight: bold;
            }
            
            .fc .fc-button:hover {
              background-color: #e6c555 !important;
              border-color: #e6c555 !important;
            }
            
            .fc .fc-button-primary:not(:disabled).fc-button-active {
              background-color: #e6c555 !important;
              border-color: #e6c555 !important;
            }
            
            .fc .fc-button-primary:focus {
              box-shadow: 0 0 0 0.2rem rgba(255, 217, 102, 0.5) !important;
            }
            
            .fc .fc-toolbar-title {
              color: #FFD966;
            }
            
            .fc .fc-col-header-cell {
              background-color: #444;
              border-color: #55;
              color: #FFD966;
            }
            
            .fc .fc-daygrid-day {
              background-color: #333;
              border-color: #444;
            }
            
            .fc .fc-daygrid-day.fc-day-today {
              background-color: #444 !important;
            }
            
            .fc .fc-daygrid-event {
              background-color: #FFD966 !important;
              border-color: #FFD966 !important;
              color: #353131 !important;
              font-weight: bold;
            }
            
            .fc-daygrid-event:hover {
              background-color: #e6c555 !important;
            }
            
            .fc .fc-list-event:hover td {
              background-color: #44;
            }
            
            .fc-theme-standard .fc-scrollgrid {
              border-color: #555;
            }
            
            .calendar-day {
              background-color: #33;
            }
            
            .calendar-header {
              background-color: #444;
              color: #FFD966;
            }
            
            .calendar-event {
              background-color: #FFD966;
              color: #353131;
              border: 1px solid #FFD966;
              border-radius: 4px;
              padding: 2px 4px;
              font-weight: bold;
            }
          `}</style>
          <FullCalendar
            {...calendarOptions}
            ref={calendarRef}
          />
        </>
      )}
    </div>
  );
};

export default Calendar;