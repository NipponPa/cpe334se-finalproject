-- Enable RLS for event_participants
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own invitations
CREATE POLICY "Allow users to see their own invitations"
ON public.event_participants
FOR SELECT
USING (auth.uid() = user_id);

-- Allow event creators to manage participants of their events
CREATE POLICY "Allow event creators to manage participants"
ON public.event_participants
FOR ALL
USING (
  auth.uid() = (
    SELECT created_by
    FROM public.events
    WHERE id = event_id
  )
);

-- Allow users to update their own invitation status
CREATE POLICY "Allow users to update their own status"
ON public.event_participants
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RPC function to update invitation status
CREATE OR REPLACE FUNCTION update_invitation_status(
  p_event_id UUID,
  p_status VARCHAR
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.event_participants
  SET status = p_status
  WHERE event_id = p_event_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;