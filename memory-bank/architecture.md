# Calendar Application Architecture

## System Overview
The calendar application is built with React/Next.js and uses Supabase for backend services including authentication and database operations. The UI follows a component-based architecture with clear separation of concerns.

## Component Structure
- `Calendar.tsx`: Main calendar component that manages state and coordinates other components
- `CalendarHeader.tsx`: Displays month/year and contains the "Add Event" button
- `CalendarGrid.tsx`: Renders the calendar grid layout with days
- `DayCell.tsx`: Represents individual days in the calendar with event visualization
- `AddEventForm.tsx`: Modal form for creating and editing events
- `EventDetailView.tsx`: Modal showing events for a selected day with edit capabilities
- `FriendSelection.tsx`: Component for selecting friends to invite to events

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