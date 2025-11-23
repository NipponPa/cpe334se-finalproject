import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
 type: 'event_reminder' | 'task_deadline' | 'invitation' | 'collaboration' | 'general';
 related_entity_type: 'event' | 'task' | 'invitation' | null;
 related_entity_id: string | null;
 created_at: string;
 is_read: boolean;
 event_id?: string;
 inviter_id?: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
 onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications for the current user
  useEffect(() => {
    if (!user || !isOpen) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, title, message, type, related_entity_type, related_entity_id, created_at, is_read')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        setNotifications(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, isOpen]);

  // Mark notifications as read when dropdown is opened
  useEffect(() => {
    if (isOpen && notifications.length > 0 && user) {
      const unreadNotificationIds = notifications
        .filter(notification => !notification.is_read)
        .map(notification => notification.id);

      if (unreadNotificationIds.length > 0) {
        markNotificationsAsRead(unreadNotificationIds);
      }
    }
  }, [isOpen, notifications, user]);

  // Mark notifications as read
  const markNotificationsAsRead = async (notificationIds: string[]) => {
    if (notificationIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', notificationIds);

    if (error) {
      console.error('Error marking notifications as read:', error);
    } else {
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle invitation response (accept/decline)
  const handleInvitationResponse = async (notificationId: string, eventId: string, response: 'accepted' | 'declined') => {
    if (!user) return;

    try {
      // Update the event_participants table with the response
      const { error: participantError } = await supabase
        .from('event_participants')
        .update({ status: response })
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (participantError) {
        console.error('Error updating event participant:', participantError);
        return;
      }

      // Remove the notification after response
      const { error: notificationError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (notificationError) {
        console.error('Error deleting notification:', notificationError);
      } else {
        // Update local state to remove the notification
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error handling invitation response:', error);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border" ref={dropdownRef}>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-b hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{notification.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(notification.created_at)}</p>
                </div>
              </div>
              
              {/* Show accept/decline buttons for event invitation notifications */}
              {notification.type === 'invitation' && notification.related_entity_id && notification.related_entity_type === 'event' && (
                <div className="flex space-x-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleInvitationResponse(notification.id, notification.related_entity_id!, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleInvitationResponse(notification.id, notification.related_entity_id!, 'declined')}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;