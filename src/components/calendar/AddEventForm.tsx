import React, { useState, useEffect } from 'react';
import FriendSelection from './FriendSelection';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Friend {
  id: string;
  name: string;
 email: string;
 avatar?: string;
}

interface Invitation {
  recipientEmail: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface Event {
  id: string | number;
  title: string;
 startTime: Date;
 endTime: Date;
 description: string;
 invitees?: string[];
  invitations?: Invitation[];
  isAllDay?: boolean;
}

interface AddEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  selectedDay?: Date;
  editingEvent?: Event | null;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ isOpen, onClose, onSave, selectedDay, editingEvent }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isAllDay, setIsAllDay] = useState(false);
  const { user } = useAuth();

  // Initialize form when editing an event
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      
      // Set the start and end dates
      const start = new Date(editingEvent.startTime);
      const end = new Date(editingEvent.endTime);
      
      // Check if it's an all-day event based on the isAllDay property
      const isAllDayEvent = editingEvent.isAllDay;
      
      if (isAllDayEvent) {
        setIsAllDay(true);
        // For all-day events, use the date part only
        // Format date as YYYY-MM-DD to avoid timezone issues
        const startYear = start.getFullYear();
        const startMonth = String(start.getMonth() + 1).padStart(2, '0');
        const startDay = String(start.getDate()).padStart(2, '0');
        setStartDate(`${startYear}-${startMonth}-${startDay}`);
        
        const endYear = end.getFullYear();
        const endMonth = String(end.getMonth() + 1).padStart(2, '0');
        const endDay = String(end.getDate()).padStart(2, '0');
        setEndDate(`${endYear}-${endMonth}-${endDay}`);
      } else {
        setIsAllDay(false);
        // Format date as YYYY-MM-DD to avoid timezone issues
        const startYear = start.getFullYear();
        const startMonth = String(start.getMonth() + 1).padStart(2, '0');
        const startDay = String(start.getDate()).padStart(2, '0');
        setStartDate(`${startYear}-${startMonth}-${startDay}`);
        
        const endYear = end.getFullYear();
        const endMonth = String(end.getMonth() + 1).padStart(2, '0');
        const endDay = String(end.getDate()).padStart(2, '0');
        setEndDate(`${endYear}-${endMonth}-${endDay}`);
        
        setStartTime(formatTime(start));
        setEndTime(formatTime(end));
      }
      
      // Set invitees if they exist
      setInvitees(editingEvent.invitees || []);
    } else {
      // For new events, only initialize dates if selectedDay is provided
      // Otherwise, keep fields empty until user starts typing
      if (selectedDay) {
        // Set default dates if selectedDay is provided
        // Format date as YYYY-MM-DD to avoid timezone issues
        const year = selectedDay.getFullYear();
        const month = String(selectedDay.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDay.getDate()).padStart(2, '0');
        const defaultDate = `${year}-${month}-${day}`;
        setStartDate(defaultDate);
        setEndDate(defaultDate);
      } else {
        // If no selectedDay is provided, use today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayDate = `${year}-${month}-${day}`;
        setStartDate(todayDate);
        setEndDate(todayDate);
      }
      
      // Reset other fields for new events
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setInvitees([]);
      setIsAllDay(false);
    }
  }, [editingEvent, selectedDay]);

  // Helper function to format time as HH:MM
 const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Check if the session is still valid before fetching friends
  const checkSessionValidity = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.error('Session invalid or error:', error);
      return false;
    }
    
    // Check if session is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < currentTime) {
      console.log('Session expired, attempting refresh...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Failed to refresh session:', refreshError);
        return false;
      }
      
      // Update user context if refresh was successful
      if (refreshData.session?.user) {
        // We can't directly update the context here, but the AuthContext should handle this
        return true;
      }
      return false;
    }
    
    return true;
  };

  // Fetch friends/users from Supabase with retry logic and timeout
  useEffect(() => {
    if (isOpen && user) {
      setError(null); // Reset error state when opening the form
      fetchFriends();
    }
  }, [isOpen, user]);

  // Add event listener for visibility change to handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isOpen && user && !loading && !error) {
        // Check session validity when user returns to the tab
        // If session is valid, refetch friends to ensure they're current
        checkSessionValidity().then(isValid => {
          if (isValid) {
            fetchFriends();
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, user, loading, error]);

  const fetchFriends = async (retryCount = 0) => {
    try {
      // Check session validity before fetching
      const isValid = await checkSessionValidity();
      if (!isValid) {
        console.error('Session is not valid, cannot fetch friends');
        setFriends([]);
        setError('Authentication session expired. Please refresh the page or sign in again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Set a timeout for the fetch operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Fetch all users except the current user
      const { data, error, status } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .neq('id', user?.id || '')
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error fetching friends:', error);
        
        // If unauthorized (likely due to expired session), try to refresh session and retry
        if (status === 401 && retryCount < 2) {
          console.log(`Retrying fetchFriends, attempt ${retryCount + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          return fetchFriends(retryCount + 1);
        }
        
        // Fallback to empty array after retries
        setFriends([]);
      } else {
        // Transform the data to match the Friend interface
        const formattedFriends: Friend[] = data.map((user: { id: string; full_name: string; email: string; avatar_url: string }) => ({
          id: user.id,
          name: user.full_name || user.email.split('@')[0],
          email: user.email,
          avatar: user.avatar_url
        }));
        setFriends(formattedFriends);
      }
    } catch (error) {
      console.error('Error in fetchFriends:', error);
      
      // Type guard for the error object
      if (error instanceof Error) {
        // Handle timeout specifically
        if (error.name === 'AbortError') {
          console.error('Fetch friends operation timed out');
          setFriends([]);
          setError('Loading friends timed out. Please check your connection and try again.');
        } else {
          // Check if the error has a status property (for Supabase errors)
          // Use type assertion carefully here since we're checking for the property existence
          if ('status' in error && error.status === 401 && retryCount < 2) {
            // If unauthorized, try to refresh session and retry
            console.log(`Retrying fetchFriends due to auth error, attempt ${retryCount + 1}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return fetchFriends(retryCount + 1);
          } else {
            setFriends([]);
            setError('Failed to load friends. Please try again later.');
          }
        }
      } else {
        setFriends([]);
        setError('An unexpected error occurred while loading friends.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
 }

  if (loading && !error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#353131] text-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border-[#FFD966]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Event</h2>
          </div>
          <div className="text-center py-4">
            <p>Loading friends...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#353131] text-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border-[#FFD966]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Event</h2>
          </div>
          <div className="text-center py-4">
            <p className="text-red-400 mb-4">{error}</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => fetchFriends()}
                className="px-4 py-2 bg-[#FFD966] text-[#353131] rounded hover:bg-[#ffc827] focus:outline-none"
              >
                Retry Loading Friends
              </button>
              <button
                onClick={() => {
                  // Set friends to empty array and continue with the form
                  setFriends([]);
                  setLoading(false);
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
              >
                Continue Without Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('handleSubmit called');
    console.log('Form values:', { title, startTime, endTime, description, startDate, endDate, isAllDay, invitees });
    
    // Basic validation
    if (!title.trim()) {
      alert('Event title is required');
      return;
    }
    
    if (!isAllDay && (!startTime || !endTime)) {
      alert('Both start and end times are required for timed events');
      return;
    }
    
    if (!startDate || !endDate) {
      alert('Both start and end dates are required');
      return;
    }
    
    // Convert date strings to Date objects
    let startDateTime: Date;
    let endDateTime: Date;
    
    if (isAllDay) {
      // For all-day events, we need to handle timezone properly to avoid date shifting
      // Create the date in the user's local timezone but avoid conversion issues
      const startParts = startDate.split('-');
      const startYear = parseInt(startParts[0]);
      const startMonth = parseInt(startParts[1]) - 1;
      const startDay = parseInt(startParts[2]);
      
      // Create date objects at local midnight to avoid timezone shifts
      startDateTime = new Date(startYear, startMonth, startDay, 0, 0, 0, 0);
      
      const endParts = endDate.split('-');
      const endYear = parseInt(endParts[0]);
      const endMonth = parseInt(endParts[1]) - 1;
      const endDay = parseInt(endParts[2]);
      
      // For all-day events, we want the end date to be at the very end of that day (23:59)
      // Using local time to avoid timezone issues
      endDateTime = new Date(endYear, endMonth, endDay, 23, 59, 59);
    } else {
      // For timed events, combine date and time
      // Using the ISO string format to maintain proper timezone handling
      // Ensure proper formatting with leading zeros
      const formattedStartTime = `${startDate}T${startTime}:00`;
      const formattedEndTime = `${endDate}T${endTime}:00`;
      startDateTime = new Date(formattedStartTime);
      endDateTime = new Date(formattedEndTime);
    }
    
    // Validate that end date/time is after start date/time
    if (endDateTime < startDateTime) {
      alert('End date/time must be after start date/time');
      return;
    }
    
    // Log invitees for now as specified in the task
    console.log('Selected invitees:', invitees);
    
    try {
      // Prepare event details for the Edge Function
      const eventDetails = {
        title: title.trim(),
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        description: description.trim(),
      };
      
      // Call the Supabase Edge Function if there are invitees
      if (invitees && invitees.length > 0) {
        const response = await supabase.functions.invoke('send-invitations', {
          body: {
            eventDetails,
            invitees: invitees.map(email => ({ email }))
          }
        });
        
        if (response.error) {
          throw new Error(`Failed to send invitations: ${response.error.message}`);
        }
        
        console.log('Invitations sent successfully:', response.data);
      }
      
      // Create invitations array for the event
      const invitations = invitees.map(email => ({
        recipientEmail: email,
        status: 'pending' as const
      }));
      
      // Call the onSave function with the new event data
      console.log('Calling onSave with event data:', {
        title: title.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
        description: description.trim(),
        invitees: invitees,
        invitations: invitations,
        isAllDay
      });
      
      onSave({
        title: title.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
        description: description.trim(),
        invitees: invitees,
        invitations: invitations,
        isAllDay
      });
      
      // Close the form after successful save
      onClose();
      
      // Reset form fields after successful save
      setTitle('');
      setStartTime('');
      setEndTime('');
      setDescription('');
      setInvitees([]);
      setStartDate('');
      setEndDate('');
      setIsAllDay(false);
    } catch (error: unknown) {
      console.error('Error sending invitations:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error sending invitations: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset all form fields when canceling
    setTitle('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setInvitees([]);
    setStartDate('');
    setEndDate('');
    setIsAllDay(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#353131] text-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border-[#FFD966]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <p className="text-sm text-gray-300">
              {isAllDay ? (
                startDate === endDate ?
                `Date: ${new Date(startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}` :
                `Dates: ${new Date(startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })} - ${new Date(endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}`
              ) : (
                `Date: ${selectedDay ? selectedDay.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`
              )}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-[#4a4646] border-[#FFD966] rounded text-white"
              placeholder="Enter event title"
              required
            />
          </div>
          
          {/* All Day Toggle */}
          <div className="mb-4 flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="mr-2 h-4 w-4 text-[#FFD966] rounded focus:ring-[#FFD966]"
              />
              <span className="text-sm">All day event</span>
            </label>
          </div>
          
          {/* Date/Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-[#4a4646] border-[#FFD966] rounded text-white"
                required
              />
            </div>
            
            {!isAllDay && (
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 bg-[#4a4646] border-[#FFD966] rounded text-white"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                End Date *
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-[#4a4646] border-[#FFD966] rounded text-white"
                required
              />
            </div>
            
            {!isAllDay && (
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 bg-[#4a4646] border border-[#FFD966] rounded text-white"
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-[#4a4646] border-[#FFD966] rounded text-white"
              placeholder="Enter event description"
              rows={3}
            />
          </div>
          
          {/* Friend Selection Section */}
          <div className="mb-6">
            <FriendSelection
              friends={friends}
              selectedInvitees={invitees}
              onSelectionChange={setInvitees}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FFD966] text-[#353131] rounded hover:bg-[#ffc827] focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;