# Context

- **Current Focus**: Integrating friend invitation logic into the event creation process
- **Recent Changes**: 
  - Updated the event creation logic in `src/components/calendar/AddEventForm.tsx` to call the Supabase Edge Function `send-invitations` when saving an event
  - Modified the form's `onSave` handler to make a POST request to the Edge Function with event details and invitees array
  - Updated the `Event` data structure to include an `invitations` array with recipientEmail and status
  - Implemented proper error handling for the Edge Function call
  - Fixed UI styling issues in the FriendSelection component
  - Replaced hardcoded friend examples with real data from Supabase by implementing a fetchFriends function that queries the users table
  - Added loading state and proper error handling for the friends fetching operation
- **Next Steps**: Testing the complete invitation workflow and ensuring proper integration with the notification system