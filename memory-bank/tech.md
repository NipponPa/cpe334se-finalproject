# Technology Stack and Implementation Details

## Frontend Technologies
- React 18+ with TypeScript
- Next.js framework
- Tailwind CSS for styling
- Component-based architecture

## Backend Services
- Supabase for authentication and database operations
- PostgreSQL database for event storage
- Supabase Edge Functions for sending invitations

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

## Critical Implementation Paths
- AddEventForm.tsx: Enhanced with date/time pickers, all-day toggle, and edit mode
- Calendar.tsx: Updated state management and database operations
- DayCell.tsx: Enhanced event display and selection feedback
- EventDetailView.tsx: Added edit functionality for events
- CalendarGrid.tsx: Updated to properly handle multi-day events