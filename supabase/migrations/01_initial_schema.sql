    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Users table (extending Supabase auth.users)
    CREATE TABLE public.users (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255),
      avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Events table
    CREATE TABLE public.events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      start_time TIMESTAMP WITH TIME ZONE NOT NULL,
      end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500),
      color VARCHAR(7), -- Hex color for calendar display
      is_all_day BOOLEAN DEFAULT FALSE,
      created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Tasks table
    CREATE TABLE public.tasks (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      due_date TIMESTAMP WITH TIME ZONE,
      priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5), -- 1-5 scale
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMP WITH TIME ZONE,
      assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
      created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Event Participants table
    CREATE TABLE public.event_participants (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('owner', 'admin', 'participant')),
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'tentative')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(event_id, user_id) -- Prevent duplicate participation
    );

    -- User Preferences table
    CREATE TABLE public.user_preferences (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      calendar_view VARCHAR(20) DEFAULT 'week' CHECK (calendar_view IN ('day', 'week', 'month')),
      timezone VARCHAR(50) DEFAULT 'UTC',
      notification_enabled BOOLEAN DEFAULT TRUE,
      theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id)
    );

    -- Notifications table
    CREATE TABLE public.notifications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) CHECK (type IN ('event_reminder', 'task_deadline', 'invitation', 'collaboration', 'general')),
      related_entity_type VARCHAR(50) CHECK (related_entity_type IN ('event', 'task', 'invitation')),
      related_entity_id UUID,
      is_read BOOLEAN DEFAULT FALSE,
      scheduled_at TIMESTAMP WITH TIME ZONE,
      sent_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Indexes for better performance
    CREATE INDEX idx_events_start_time ON public.events(start_time);
    CREATE INDEX idx_events_end_time ON public.events(end_time);
    CREATE INDEX idx_events_created_by ON public.events(created_by);
    CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
    CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
    CREATE INDEX idx_tasks_completed ON public.tasks(completed);
    CREATE INDEX idx_event_participants_event_id ON public.event_participants(event_id);
    CREATE INDEX idx_event_participants_user_id ON public.event_participants(user_id);
    CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
    CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
    CREATE INDEX idx_notifications_scheduled_at ON public.notifications(scheduled_at);

    -- Enable RLS on tables
    -- Disabling RLS for open access as requested
    -- Disabling RLS for ALL tables for open access as requested
    ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.event_participants DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_preferences DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
    
    -- All RLS policies are removed to unrestrict access.

    -- Function to handle new user creation in auth schema
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
      INSERT INTO public.users (id, email, full_name)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
      );
      RETURN NEW;
    END;
    $$;

    -- Trigger to call the function when a new user signs up
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

    -- Enable RLS on auth.users if needed for additional security
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
    
    -- Grant permissions to the authenticated role
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_participants TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;