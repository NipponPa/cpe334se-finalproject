# System Architecture

This project is a Next.js application with a client-side rendered frontend and a backend powered by Supabase, designed as a Student Event Planner to help students manage events, tasks, and collaborations efficiently through a centralized calendar system.

## High-Level Design
The architecture is based on a Jamstack approach, where the frontend is a static-first Next.js application that communicates with Supabase for backend services like authentication, database operations, and real-time updates for collaborative features.

## Source Code Structure

- `src/app/`: Contains the main application pages and routing.
  - `(pages)`: Publicly accessible pages like `/login`, `/signup`, and `/reset-password`.
  - `layout.tsx`: The main application layout.
  - `page.tsx`: The main dashboard/home page for authenticated users.
  - `calendar/`: Calendar-related pages and components
    - `calendar/page.tsx`: Main calendar view
    - `event/[id]/page.tsx`: Individual event details
    - `task/[id]/page.tsx`: Individual task details
  - `profile/`: User profile management pages
  - `collaboration/`: Collaboration and sharing features
- `src/components/`: Reusable React components.
  - `ProtectedRoute.tsx`: A higher-order component that wraps pages to ensure only authenticated users can access them.
  - `ui/`: ShadCN UI components like `button.tsx`, `card.tsx`, etc.
  - `Calendar/`: Calendar-specific components
    - `CalendarView.tsx`: Main calendar component with multiple view options
    - `EventCard.tsx`: Component for displaying individual events
    - `TaskList.tsx`: Component for displaying tasks
  - `Collaboration/`: Collaboration components
    - `InviteModal.tsx`: Modal for inviting participants to events
    - `ParticipantList.tsx`: Component for managing event participants
- `src/contexts/`: React contexts for global state management.
  - `AuthContext.tsx`: Manages the application's authentication state, providing user session information and auth-related functions (login, logout, etc.) throughout the app.
  - `CalendarContext.tsx`: Manages calendar state, events, and tasks
 - `NotificationContext.tsx`: Handles notification state and delivery
- `src/lib/`: Utility functions and library initializations.
  - `supabase.ts`: Initializes the Supabase client.
  - `utils.ts`: General utility functions.
  - `calendar-utils.ts`: Calendar-specific utility functions
- `docs/adr/`: Contains Architecture Decision Records.

## Authentication Flow
Authentication is handled by Supabase, supporting both email/password and Google OAuth.

1. **User Interaction**: The user interacts with login/signup forms in the UI.
2.  **Auth Context**: The `AuthContext` calls the Supabase client with the user's credentials or initiates the OAuth flow.
3. **Supabase Client**: The client communicates with the Supabase backend to authenticate the user.
4.  **Session Management**: Supabase returns a JWT, which is stored in the browser. The `AuthContext` listens for authentication state changes and updates the application state accordingly.
5.  **Protected Routes**: The `ProtectedRoute` component checks for an active session in the `AuthContext`. If no session exists, it redirects the user to the login page.

## Event and Task Management System
The application manages events and tasks through Supabase database tables with real-time synchronization, specifically designed for student use cases.

1. **Calendar Components**: UI components render calendar views and handle user interactions for creating, editing, and deleting events/tasks.
2.  **Calendar Context**: Manages the state of events, tasks, and calendar views, coordinating between UI components and the Supabase client.
3.  **Supabase Database**: Stores event and task data in dedicated tables with relationships to user accounts.
4. **Real-time Updates**: Uses Supabase's real-time features to update calendars when events are modified by collaborators.

## Database Schema

The application uses a comprehensive database schema with the following core tables:

- **users**: Extends Supabase auth with additional profile information
- **events**: Stores calendar events with scheduling and location details
- **tasks**: Manages tasks with due dates, priorities, and completion status
- **event_participants**: Handles collaboration and invitations to events
- **user_preferences**: Stores user-specific settings and preferences
- **notifications**: Manages system notifications and reminders

All tables are secured with Row Level Security (RLS) policies to ensure users only access their own data.

## Authentication Synchronization

The application uses a trigger-based approach to synchronize user data between Supabase's auth.users table and the application's public.users table. When a new user registers, a PostgreSQL trigger automatically creates a corresponding record in the public.users table, ensuring that user profile data is available for application features.

## Collaboration Flow
Collaboration features enable students to invite others to events and manage participant lists for group projects and study sessions.

1.  **Invite Process**: Students can invite others to events through the `InviteModal` component.
2.  **Participant Management**: The `ParticipantList` component manages event participants and their roles.
3 **Notification System**: The `NotificationContext` handles sending and receiving notifications for event invitations and updates.
4.  **Supabase RLS**: Row Level Security ensures users only see events and tasks they have access to.

## Key Technical Decisions
- **Supabase for Backend**: Chosen for its rapid development capabilities, integrated database, built-in authentication, and real-time features. This avoids the need to build and maintain a custom backend. See `docs/adr/001-supabase-authentication-approach.md`.
- **Next.js with App Router**: Provides a modern, file-based routing system and server-side rendering capabilities.
- **ShadCN UI**: Used for its accessible and customizable component library, which accelerates UI development.
- **Real-time Collaboration**: Leveraging Supabase's real-time features for collaborative calendar updates, particularly useful for group projects and study sessions.