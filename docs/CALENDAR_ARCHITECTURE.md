# Interactive Calendar Component Architecture

## 1. Component Breakdown

### Calendar (Main Component)
- **Responsibilities**: Orchestrates all other components, manages overall state, handles navigation between views, and serves as the main entry point for the calendar functionality.

### CalendarHeader
- **Responsibilities**: Handles navigation controls (previous/next buttons), displays the current month/year, provides view switching options (day/week/month), and contains the "Add Event" button.

### CalendarGrid
- **Responsibilities**: Renders the grid structure for the calendar (rows and columns of days), manages the layout for different calendar views (month, week, day), and handles day cell rendering.

### DayCell
- **Responsibilities**: Represents individual days in the calendar grid, displays events that occur on that day, handles click events for selecting a day or creating new events, and shows visual indicators for special days.

### EventDetailView
- **Responsibilities**: Displays detailed information about a selected event in a modal or side-panel, allows users to edit or delete events, and shows event metadata (time, description, participants).

### FriendSelectionUI
- **Responsibilities**: Displays a list of the user's friends, allows searching and filtering of friends, manages the list of selected invitees, and integrates with the AddEventForm to provide selected friends for invitation. This component can be embedded within the AddEventForm or used as a separate reusable component.

### AddEventForm
- **Responsibilities**: Provides a form for creating new events, includes fields for title, start/end times, description, and other event details, handles form submission and validation, and includes a new "Invite Friends" section that allows users to select from a list of their friends or enter email addresses manually.

## 2. Data Model

### Event Interface
```typescript
interface Event {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
  invitations?: Invitation[];
}
```

### Invitation Interface
```typescript
interface Invitation {
  recipientEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  userId?: string | number; // Optional, for registered users
}
```

### Friend Interface
```typescript
interface Friend {
  id: string | number;
  name: string;
  email: string;
}
```

## 3. State Management

### State to be Managed
- `currentDate`: Tracks the currently displayed date/month for navigation purposes
- `events`: Array of all events to be displayed on the calendar
- `selectedDay`: The currently selected day (for creating new events or displaying day-specific information)
- `selectedEvent`: The currently selected event (for viewing/editing details)
- `isDetailViewOpen`: Boolean flag indicating if the event detail view is open
- `isAddEventFormOpen`: Boolean flag indicating if the add event form is open
- `viewType`: Current calendar view type (month, week, day)
- `friends`: Array of friends that can be invited to events (managed in the Calendar component)
- `invitees`: Array of selected invitees for the current event being created (managed in the AddEventForm component)

### State Location
- The main `Calendar` component will use `useState` and `useReducer` hooks to manage the state
- For more complex applications or if the calendar state needs to be accessed from outside the calendar component, a `CalendarContext` could be implemented
- Individual components will receive state updates via props from the parent `Calendar` component
- For global access to calendar events across the application, a `CalendarContext` or a more centralized state management solution like Redux might be appropriate

### State Flow
- The main `Calendar` component acts as the single source of truth
- Child components receive state via props and callbacks to update state
- Events will be stored in the Supabase database and synchronized with the UI state
- Changes to events will be reflected in both the UI state and persisted to the database

## 4. Backend Services

### Supabase Edge Function: send-invitations
- **Purpose**: This function receives event details and a list of invitees, then sends formatted emails to each recipient with event information and invitation status tracking capabilities.
- **Responsibilities**: Process the invitation request, format email content with event details, send emails to invitees, update invitation status in the database, and handle delivery confirmations.
- **Input**: Event object containing all event details, array of invitee objects (containing email addresses and other relevant information)
- **Output**: Confirmation of successful email delivery or error handling for failed deliveries