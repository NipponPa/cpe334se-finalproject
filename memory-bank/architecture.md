# Calendar Application Architecture

## System Overview
The calendar application is built with React/Next.js and uses Supabase for backend services including authentication and database operations. The UI follows a component-based architecture with clear separation of concerns.

## Profile Picture System Architecture
The application includes a comprehensive profile picture management system with the following components:

### Storage Layer
- Supabase Storage bucket named `profile-pictures` configured for public access
- File validation and size limits (max 5MB) with support for JPEG, PNG, GIF, and WEBP formats
- Files are organized in user-specific folders using user ID as prefix (e.g., `user-id/1234567890_profile.jpg`)

### Database Integration
- Enhanced `users` table with profile picture metadata columns:
  - `avatar_url`: Public URL of the profile picture
  - `profile_image_filename`: Original filename in storage
  - `profile_image_size`: File size in bytes
  - `profile_image_type`: MIME type of the image
  - `profile_image_updated_at`: Timestamp of last update
- Row Level Security (RLS) policies ensure users can only manage their own profile pictures

### Backend Services
- Supabase Edge Functions for image processing and validation
- Custom database functions for updating profile picture metadata
- Security validation to prevent unauthorized access and malicious uploads

### Frontend Components
- `ProfilePictureUpload.tsx`: Component for uploading and managing profile pictures with drag-and-drop support
- `ProfilePictureDisplay.tsx`: Component for displaying profile pictures with fallback to user initials
- Client-side image optimization before upload (resized to 800x800px with 80% quality)
- OAuth integration to support Google profile pictures as defaults

## Notification System Architecture
The application now includes a comprehensive internal notification system for event invitations with the following components:

### Notification Utility Layer
- `notification-utils.ts`: Contains functions for creating, retrieving, and managing notifications
- Functions include `createNotification`, `createEventInvitationNotification`, `getNotificationsForUser`, `markNotificationAsRead`, etc.
- Uses TypeScript interfaces for proper typing of notification data

### Database Integration
- Enhanced `notifications` table with columns for user_id, title, message, type, related_entity_type, related_entity_id, and is_read status
- Row Level Security (RLS) policies ensure users can only access their own notifications
- Notification types include 'event_reminder', 'task_deadline', 'invitation', 'collaboration', 'general'

### Frontend Components
- `NotificationDropdown.tsx`: Component for displaying notifications with accept/decline buttons for event invitations
- Integration with `NavigationBar.tsx` to show notification count and toggle dropdown
- Updated `FriendSelection.tsx`: Component now only allows selection of registered users (internal)
- Updated `AddEventForm.tsx`: Creates internal notifications instead of sending email invitations

### Backend Services
- Updated `send-invitations` Supabase Edge Function to create internal notifications instead of sending emails
- Function only processes invitations for registered users in the system
- Maintains same API interface for compatibility with existing code
- Fixed event creation flow: events are now created in database first, then notifications are created with actual event ID

## Component Structure
- `Calendar.tsx`: Main calendar component that manages state and coordinates other components
- `CalendarHeader.tsx`: Displays month/year and contains the "Add Event" button
- `CalendarGrid.tsx`: Renders the calendar grid layout with days
- `DayCell.tsx`: Represents individual days in the calendar with event visualization
- `AddEventForm.tsx`: Modal form for creating and editing events
- `EventDetailView.tsx`: Modal showing events for a selected day with edit capabilities
- `FriendSelection.tsx`: Component for selecting friends to invite to events
- `NotificationDropdown.tsx`: Component for displaying and responding to notifications (added in notification system update)

## Key Technical Decisions
- Date handling: Implemented proper timezone conversion to prevent date shifting
- Multi-day events: Added support for events spanning multiple days with visual indicators
- Editable events: Implemented in-place editing of existing events
- Visual feedback: Added clear indicators for selected days and target dates

## Database Integration
- Uses Supabase for event storage with start_time and end_time columns
- Events include title, description, start_time, end_time, and isAllDay properties
- Authentication ensures events are associated with the correct user
- Proper handling of all-day events to prevent date shifting

## Component Relationships
- Calendar.tsx orchestrates the main functionality and passes state to child components
- DayCell.tsx communicates with Calendar.tsx when days are clicked
- AddEventForm.tsx receives selected day information and callbacks for saving events
- EventDetailView.tsx shows events for a selected day and provides editing capabilities
- All components work together to provide a consistent date handling and visualization experience