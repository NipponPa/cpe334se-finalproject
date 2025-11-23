import { supabase } from './supabase';

// TypeScript interfaces for notifications
export interface Notification {
 id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'event_reminder' | 'task_deadline' | 'invitation' | 'collaboration' | 'general';
  related_entity_type: 'event' | 'task' | 'invitation' | null;
  related_entity_id: string | null;
  is_read: boolean;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface CreateNotificationParams {
  user_id: string;
  title: string;
  message: string;
  type?: 'event_reminder' | 'task_deadline' | 'invitation' | 'collaboration' | 'general';
  related_entity_type?: 'event' | 'task' | 'invitation';
  related_entity_id?: string;
  scheduled_at?: string | null;
}

/**
 * Creates a notification for event invitations or other types
 */
export const createNotification = async (params: CreateNotificationParams): Promise<{ data?: Notification; error?: Error | null }> => {
  try {
    const {
      user_id,
      title,
      message,
      type = 'invitation',
      related_entity_type = 'event',
      related_entity_id,
      scheduled_at = null
    } = params;

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id,
        title,
        message,
        type,
        related_entity_type,
        related_entity_id,
        scheduled_at
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return { error: new Error(error.message) };
    }

    return { data };
  } catch (error: unknown) {
    console.error('Unexpected error creating notification:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

/**
 * Creates a notification specifically for event invitations
 */
export const createEventInvitationNotification = async (
  userId: string,
  eventId: string,
  eventTitle: string,
  inviterName: string
): Promise<{ data?: Notification; error?: Error | null }> => {
  const title = 'Event Invitation';
  const message = `${inviterName} has invited you to join "${eventTitle}".`;

  return createNotification({
    user_id: userId,
    title,
    message,
    type: 'invitation',
    related_entity_type: 'event',
    related_entity_id: eventId
  });
};

/**
 * Gets notifications for a specific user
 */
export const getNotificationsForUser = async (
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
    orderBy?: 'created_at' | 'scheduled_at';
    orderDirection?: 'asc' | 'desc';
  } = {}
): Promise<{ data?: Notification[]; error?: Error | null }> => {
  try {
    const {
      limit = 20,
      offset = 0,
      unreadOnly = false,
      orderBy = 'created_at',
      orderDirection = 'desc'
    } = options;

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return { error: new Error(error.message) };
    }

    return { data };
  } catch (error: unknown) {
    console.error('Unexpected error fetching notifications:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
): Promise<{ data?: Notification; error?: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, sent_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error marking notification as read:', error);
      return { error: new Error(error.message) };
    }

    return { data };
  } catch (error: unknown) {
    console.error('Unexpected error marking notification as read:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

/**
 * Marks all notifications for a user as read
 */
export const markAllNotificationsAsRead = async (
  userId: string
): Promise<{ data?: { count: number }; error?: Error | null }> => {
  try {
    // First, count how many unread notifications the user has
    const { count: unreadCount, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (countError) {
      console.error('Error getting count of unread notifications:', countError);
      return { error: new Error(countError.message) };
    }

    // Update all unread notifications to be read
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return { error: new Error(error.message) };
    }

    return { data: { count: unreadCount || 0 } };
  } catch (error: unknown) {
    console.error('Unexpected error marking all notifications as read:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};

/**
 * Deletes a notification
 */
export const deleteNotification = async (
  notificationId: string,
  userId: string
): Promise<{ error?: Error | null }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting notification:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error: unknown) {
    console.error('Unexpected error deleting notification:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error occurred') };
  }
};