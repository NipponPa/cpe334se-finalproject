import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to generate a random string for unique emails
const randomString = () => Math.random().toString(36).substring(7);

// Initialize Supabase clients
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Supabase environment variables are not set. Please check your .env file.');
}

// Admin client for setup and teardown
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

describe('Event Invitation RLS Policy', () => {
  let creatorClient: SupabaseClient;
  let friendClient: SupabaseClient;
  let creatorId: string;
  let friendId: string;
  let eventId: string;

  const creatorEmail = `creator-${randomString()}@example.com`;
  const friendEmail = `friend-${randomString()}@example.com`;
  const password = 'password123';

  beforeAll(async () => {
    // 1. Create two users: creator and friend
    const { data: creatorData, error: creatorError } = await supabaseAdmin.auth.admin.createUser({
      email: creatorEmail,
      password: password,
      email_confirm: true,
    });
    if (creatorError) throw new Error(`Failed to create creator: ${creatorError.message}`);
    creatorId = creatorData.user.id;

    const { data: friendData, error: friendError } = await supabaseAdmin.auth.admin.createUser({
      email: friendEmail,
      password: password,
      email_confirm: true,
    });
    if (friendError) throw new Error(`Failed to create friend: ${friendError.message}`);
    friendId = friendData.user.id;

    // 2. Sign in as the creator to get an authenticated client
    creatorClient = createClient(supabaseUrl, supabaseAnonKey);
    const { error: signInError } = await creatorClient.auth.signInWithPassword({
      email: creatorEmail,
      password: password,
    });
    if (signInError) throw new Error(`Creator failed to sign in: ${signInError.message}`);

    // 3. Sign in as the friend to get an authenticated client
    friendClient = createClient(supabaseUrl, supabaseAnonKey);
    const { error: friendSignInError } = await friendClient.auth.signInWithPassword({
      email: friendEmail,
      password: password,
    });
    if (friendSignInError) throw new Error(`Friend failed to sign in: ${friendSignInError.message}`);
  });

  afterAll(async () => {
    // Cleanup: delete the created users
    await supabaseAdmin.auth.admin.deleteUser(creatorId);
    await supabaseAdmin.auth.admin.deleteUser(friendId);
    // The event is deleted via CASCADE when the creator user is deleted.
  });

  it('should allow an event creator to invite another user', async () => {
    // 4. Creator creates a new event
    const { data: eventData, error: eventError } = await creatorClient
      .from('events')
      .insert({
        title: 'Creator\'s Grand Event',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600 * 1000).toISOString(),
        created_by: creatorId,
      })
      .select()
      .single();
    
    if (eventError) throw new Error(`Failed to create event: ${eventError.message}`);
    expect(eventData).not.toBeNull();
    eventId = eventData.id;

    // 5. Creator invites the friend to the event
    const { error: invitationError } = await creatorClient
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: friendId,
        role: 'participant',
        status: 'pending',
      });
    
    // This is the core assertion: the insert should succeed because the RLS policy allows it.
    expect(invitationError).toBeNull();

    // 6. Verify the friend is in the event_participants table
    const { data: participantData, error: participantError } = await supabaseAdmin
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', friendId)
      .single();

    expect(participantError).toBeNull();
    expect(participantData).not.toBeNull();
    expect(participantData.user_id).toBe(friendId);
    expect(participantData.status).toBe('pending');
  });

  it('should allow the invited user to accept the invitation by creating a duplicate event', async () => {
    // First, get the original event to compare with the duplicate
    const { data: originalEvent, error: fetchError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    expect(fetchError).toBeNull();
    expect(originalEvent).not.toBeNull();

    // Simulate the friend accepting the invitation by creating a duplicate event
    const duplicateEvent = {
      title: originalEvent.title,
      description: originalEvent.description,
      start_time: originalEvent.start_time,
      end_time: originalEvent.end_time,
      location: originalEvent.location,
      color: originalEvent.color,
      is_all_day: originalEvent.is_all_day,
      created_by: friendId,
    };

    const { data: newEventData, error: createError } = await friendClient
      .from('events')
      .insert([duplicateEvent])
      .select()
      .single();

    expect(createError).toBeNull();
    expect(newEventData).not.toBeNull();
    console.log('Created duplicate event:', newEventData);

    // Verify the duplicate event exists in the database
    const { data: duplicateEventCheck, error: checkError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', newEventData.id)
      .single();

    expect(checkError).toBeNull();
    expect(duplicateEventCheck).not.toBeNull();
    expect(duplicateEventCheck.created_by).toBe(friendId);
    expect(duplicateEventCheck.title).toBe(originalEvent.title);
  });
});