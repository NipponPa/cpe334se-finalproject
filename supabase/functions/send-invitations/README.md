# Send Invitations Edge Function

This Supabase Edge Function handles sending email invitations for calendar events.

## Function Purpose
- Processes invitation requests from the frontend
- Formats email content for event invitations
- Sends emails using a third-party email service

## Deployment

To deploy this function to your Supabase project, you need to:

1. Install and configure the Supabase CLI:
```bash
npm install -g supabase
```

2. Login to your Supabase account:
```bash
supabase login
```

3. Link your local project to your Supabase project:
```bash
supabase link --project-ref <your-project-ref>
```

4. Set up email functionality:
To enable actual email sending, you have several options:

**Option 1: Using Resend (Recommended)**
- Create an account at [resend.com](https://resend.com)
- Get your API key
- Set it as a secret in Supabase:
```bash
supabase secrets set RESEND_API_KEY="your-api-key-here"
```

**Option 2: Using other email services (SendGrid, Mailgun, etc.)**
- Get your API credentials from your email provider
- Set them as secrets in Supabase:
```bash
supabase secrets set EMAIL_SERVICE_API_KEY="your-api-key-here"
```

5. Deploy the function:
```bash
supabase functions deploy send-invitations
```

## Environment Setup

Make sure your environment variables are properly configured:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## Current Implementation

The function currently processes email invitations and shows how to integrate with email services like Resend. In a production environment, you would uncomment the email sending code and configure your email service credentials.

## Error Handling

The function includes proper error handling and will return appropriate HTTP status codes:
- 200: Success
- 400: Bad request (missing required fields)
- 405: Method not allowed
- 500: Internal server error

## Usage

The function expects a POST request with the following JSON body:
```json
{
  "eventDetails": {
    "title": "Event Title",
    "start_time": "2023-06-15T10:00:00Z",
    "end_time": "2023-06-15T11:0:00Z",
    "description": "Event description",
    "event_url": "https://example.com/event/123"
  },
  "invitees": [
    {"email": "friend1@example.com"},
    {"email": "friend2@example.com"}
  ]
}