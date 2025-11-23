import { supabase } from '@/lib/supabase';

async function checkEvents() {
  console.log('Checking for events in the database...');
  
  try {
    // Try to fetch all events first
    const { data: allEvents, error: allEventsError } = await supabase
      .from('events')
      .select('*');
    
    if (allEventsError) {
      console.error('Error fetching all events:', allEventsError);
    } else {
      console.log('All events in database:', allEvents);
      console.log('Total events found:', allEvents?.length || 0);
    }
    
    // If you know your user ID, you can test with that
    // Replace 'YOUR_USER_ID' with the actual user ID you want to query
    const testUserId = 'YOUR_USER_ID'; // Update this with actual user ID if known
    
    if (testUserId !== 'YOUR_USER_ID') {
      const { data: userEvents, error: userEventsError } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', testUserId);
      
      if (userEventsError) {
        console.error('Error fetching user events:', userEventsError);
      } else {
        console.log(`Events for user ${testUserId}:`, userEvents);
        console.log(`Total events for user:`, userEvents?.length || 0);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check
checkEvents();