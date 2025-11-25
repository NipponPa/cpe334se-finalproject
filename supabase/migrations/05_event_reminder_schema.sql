-- Add reminder_minutes column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER DEFAULT NULL;

-- Add comment to document the purpose of the column
COMMENT ON COLUMN public.events.reminder_minutes IS 'Number of minutes before the event start time to send a reminder notification. NULL means no reminder.';