# System Architecture

This project is a Next.js application with a client-side rendered frontend and a backend powered by Supabase.

## High-Level Design
The architecture is based on a Jamstack approach, where the frontend is a static-first Next.js application that communicates with Supabase for backend services like authentication and database operations.

## Source Code Structure

- `src/app/`: Contains the main application pages and routing.
  - `(pages)`: Publicly accessible pages like `/login`, `/signup`, and `/reset-password`.
  - `layout.tsx`: The main application layout.
  - `page.tsx`: The main dashboard/home page for authenticated users.
- `src/components/`: Reusable React components.
  - `ProtectedRoute.tsx`: A higher-order component that wraps pages to ensure only authenticated users can access them.
  - `ui/`: ShadCN UI components like `button.tsx`, `card.tsx`, etc.
- `src/contexts/`: React contexts for global state management.
  - `AuthContext.tsx`: Manages the application's authentication state, providing user session information and auth-related functions (login, logout, etc.) throughout the app.
- `src/lib/`: Utility functions and library initializations.
  - `supabase.ts`: Initializes the Supabase client.
  - `utils.ts`: General utility functions.
- `docs/adr/`: Contains Architecture Decision Records.

## Authentication Flow
Authentication is handled by Supabase, supporting both email/password and Google OAuth.

1.  **User Interaction**: The user interacts with login/signup forms in the UI.
2.  **Auth Context**: The `AuthContext` calls the Supabase client with the user's credentials or initiates the OAuth flow.
3.  **Supabase Client**: The client communicates with the Supabase backend to authenticate the user.
4.  **Session Management**: Supabase returns a JWT, which is stored in the browser. The `AuthContext` listens for authentication state changes and updates the application state accordingly.
5.  **Protected Routes**: The `ProtectedRoute` component checks for an active session in the `AuthContext`. If no session exists, it redirects the user to the login page.

## Key Technical Decisions
- **Supabase for Backend**: Chosen for its rapid development capabilities, integrated database, and built-in authentication. This avoids the need to build and maintain a custom backend. See `docs/adr/001-supabase-authentication-approach.md`.
- **Next.js with App Router**: Provides a modern, file-based routing system and server-side rendering capabilities.
- **ShadCN UI**: Used for its accessible and customizable component library, which accelerates UI development.