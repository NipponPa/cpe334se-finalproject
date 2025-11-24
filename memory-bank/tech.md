# Technology Stack and Implementation Details

## Frontend Technologies
- React 18+ with TypeScript
- Next.js framework
- Tailwind CSS for styling
- Component-based architecture

## Backend Services
- Supabase for authentication and database operations
- PostgreSQL database for event storage
- Supabase Storage for profile picture management
- Supabase Edge Functions for sending invitations and image processing

## Key Implementation Patterns

### Date Handling
- Proper timezone conversion to prevent date shifting
- UTC storage in database with local time display
- Special handling for all-day events to maintain correct dates
- Multi-day event support with proper start/end date ranges

### Component State Management
- Selected day state propagated through component hierarchy
- Event state managed in main Calendar component
- Form state isolated in AddEventForm component
- Visual feedback for selected days implemented consistently

### Multi-day Event Visualization
- Special styling for start/middle/end days of multi-day events
- Proper event display in calendar grid cells
- Accurate event duration calculation and display
- Correct filtering of events per day in multi-day scenarios

### Editable Events Implementation
- Single form component handles both creation and editing
- Clear UI indicators for edit vs create modes
- Pre-population of form with existing event data
- Proper update operations that preserve original event creator

### Profile Picture Management
- Client-side image optimization using canvas (800x800px max, 80% quality)
- File validation for type (JPEG, PNG, GIF, WEBP) and size (max 5MB)
- Drag-and-drop upload interface with preview functionality
- Unique filename generation using user ID and timestamp
- OAuth integration to support Google profile pictures as defaults

## Security Implementation
- Row Level Security (RLS) policies restricting users to their own data
- Storage policies ensuring users can only access their own profile pictures
- Filename validation to prevent directory traversal attacks
- MIME type validation on both client and server side

### Notification System Implementation
- Internal notification system replaces previous email invitation functionality
- Event invitations now create notifications in the database instead of sending emails
- NotificationDropdown component provides UI for accepting/declining invitations
- Real-time notification count display in NavigationBar
- Only registered users can be invited (external email functionality removed)
- Supabase Edge Function updated to create internal notifications for registered users only
- TypeScript interfaces ensure proper typing throughout the notification system
- Proper error handling and user feedback for notification operations

## Critical Implementation Paths
- AddEventForm.tsx: Enhanced with date/time pickers, all-day toggle, and edit mode
- Calendar.tsx: Updated state management and database operations
- DayCell.tsx: Enhanced event display and selection feedback
- EventDetailView.tsx: Added edit functionality for events
- CalendarGrid.tsx: Updated to properly handle multi-day events
- ProfilePictureUpload.tsx: Component for uploading and managing profile pictures
- ProfilePictureDisplay.tsx: Component for displaying profile pictures with fallbacks
- profilePictureUtils.ts: Utility functions for handling uploads, deletions, and validations
- notification-utils.ts: Utility functions for creating, retrieving, and managing notifications
- NotificationDropdown.tsx: Component for displaying and responding to notifications with accept/decline functionality
- FriendSelection.tsx: Updated to only allow selection of registered users (internal) for invitations
- send-invitations Supabase Edge Function: Updated to create internal notifications instead of sending emails
- Calendar.tsx: Updated to handle new event creation flow from AddEventForm
- 04_notifications_rls_policy.sql: Migration file to fix RLS policy for notifications table
- signup/page.tsx: Captures username during signup and stores it in both Supabase authentication metadata and user table
- AuthContext.tsx: Updated signUp function to accept userMetadata parameter for storing username during signup
- signup-username-storage.test.ts: Unit tests verifying that username is properly stored in both authentication and user table during signup
- profile/page.tsx: Updated to fetch and display full name from users table instead of user ID, and swapped the position of Full Name and Email fields in the UI