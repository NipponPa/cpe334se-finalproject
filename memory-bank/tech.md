# Technologies Used

This project is a Next.js 15 application built with React 19 and TypeScript, designed for event, task, and collaboration management.

## Core Technologies
- **Framework**: [Next.js 15.5.4](https://nextjs.org/)
- **UI Library**: [React 19.1.0](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) built on [Radix UI Primitives](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Calendar Components**: [FullCalendar](https://fullcalendar.io/) or custom calendar implementations for event visualization

## Backend & Data Management
- **Backend-as-a-Service**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL via Supabase
- **Authentication Library**: `@supabase/supabase-js`
- **Real-time Features**: Supabase real-time subscriptions for collaborative updates
- **Providers**: Email/Password and Google OAuth
- **Database Schema**: Comprehensive schema with users, events, tasks, event_participants, user_preferences, and notifications tables
- **Security**: Row Level Security (RLS) policies to ensure data privacy
- **Migrations**: SQL migration files for database schema management

## Form Management
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Schema Validation**: [Zod](https://zod.dev/)

## Calendar & Scheduling
- **Calendar Libraries**: [date-fns](https://date-fns.org/) for date manipulation
- **Drag and Drop**: [React DnD](https://react-dnd.github.io/react-dnd) or similar for calendar interactions
- **Time Zone Handling**: [date-fns-tz](https://date-fns.org/v2.29.0/docs/Time-Zones) for accurate scheduling across time zones

## Notifications
- **Notification System**: [React Hot Toast](https://react-hot-toast.com/) or [Notistack](https://iamhosseindhv.com/notistack) for user notifications
- **Push Notifications**: Web Push API via Supabase Functions or similar

## Development & Tooling
- **Package Manager**: npm
- **Linter**: [ESLint](https://eslint.org/)
- **Containerization**: [Docker](https://docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- **Testing (E2E)**: [Playwright](https://playwright.dev/)
- **State Management**: React Context API with custom hooks for calendar and task state

## Development Scripts
- `npm run dev`: Starts the development server with hot reloading.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.