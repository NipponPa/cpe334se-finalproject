# Supabase Configuration

This directory contains the Supabase configuration for the Student Event Planner application.

## Migrations

Database migrations are stored in the `migrations/` directory. The initial schema includes:

- **users**: Extends Supabase auth with additional profile information
- **events**: Stores calendar events with scheduling and location details
- **tasks**: Manages tasks with due dates and priorities
- **event_participants**: Handles collaboration and invitations
- **user_preferences**: Stores user-specific settings
- **notifications**: Manages system notifications

## Setup Instructions

1. Make sure you have the Supabase CLI installed:
```bash
npm install -g supabase
```

2. Run the initial migration:
```bash
supabase db reset
```

3. Or apply migrations manually:
```bash
supabase migration up
```

## Environment Variables

Add these to your `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Row Level Security (RLS)

The schema includes Row Level Security policies to ensure users only access their own data. These are enabled by default in the migration.

## Authentication Synchronization

The application uses a PostgreSQL trigger and function to automatically synchronize user data between Supabase's auth.users table and the application's public.users table. When a new user registers, a corresponding record is automatically created in the public.users table, ensuring that user profile data is available for application features.