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
}

interface AddEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  selectedDay?: Date;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ isOpen, onClose, onSave, selectedDay }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
 const { user } = useAuth();

  // Fetch friends/users from Supabase
  useEffect(() => {
    if (isOpen && user) {
      fetchFriends();
    }
  }, [isOpen, user]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      // Fetch all users except the current user
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .neq('id', user?.id || '');

      if (error) {
        console.error('Error fetching friends:', error);
        // Fallback to empty array
        setFriends([]);
      } else {
        // Transform the data to match the Friend interface
        const formattedFriends: Friend[] = data.map((user: any) => ({
          id: user.id,
          name: user.full_name || user.email.split('@')[0],
          email: user.email,
          avatar: user.avatar_url
        }));
        setFriends(formattedFriends);
      }
    } catch (error) {
      console.error('Unexpected error fetching friends:', error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

 if (loading) {
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

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim()) {
      alert('Event title is required');
      return;
    }
    
    if (!startTime || !endTime) {
      alert('Both start and end times are required');
      return;
    }
    
    // Convert time strings to Date objects
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(selectedDay || new Date());
    startDateTime.setHours(startHours, startMinutes, 0, 0);
    
    const endDateTime = new Date(selectedDay || new Date());
    endDateTime.setHours(endHours, endMinutes, 0, 0);
    
    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      alert('End time must be after start time');
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
      onSave({
        title: title.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
        description: description.trim(),
        invitees: invitees,
        invitations: invitations
      });
    } catch (error: any) {
      console.error('Error sending invitations:', error);
      alert(`Error sending invitations: ${error.message || 'An unknown error occurred'}`);
    }
    
    // Reset form
    setTitle('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setInvitees([]);
  };

  const handleCancel = () => {
    onClose();
    // Reset form fields when canceling
    setTitle('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setInvitees([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#353131] text-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-[#FFD966]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Event</h2>
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
              className="w-full p-2 bg-[#4a4646] border border-[#FFD966] rounded text-white"
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                Start Time *
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 bg-[#4a4646] border border-[#FFD966] rounded text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                End Time *
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 bg-[#4a4646] border border-[#FFD966] rounded text-white"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-[#4a4646] border border-[#FFD966] rounded text-white"
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