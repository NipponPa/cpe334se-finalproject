// Enable CORS for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async function handler(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.eventDetails) {
      return new Response(JSON.stringify({ error: 'eventDetails is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!body.invitees || !Array.isArray(body.invitees)) {
      return new Response(JSON.stringify({ error: 'invitees array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { eventDetails, invitees } = body;

    // Validate event details
    if (!eventDetails.title || !eventDetails.start_time || !eventDetails.end_time) {
      return new Response(JSON.stringify({ error: 'eventDetails must include title, start_time, and end_time' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process each invitee
    for (const invitee of invitees) {
      if (!invitee.email) {
        return new Response(JSON.stringify({ error: `Invitee at index ${invitees.indexOf(invitee)} must include an email` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create email content
      const emailContent = `
        <html>
          <body>
            <h2>You're invited to: ${eventDetails.title}</h2>
            <p><strong>Event Details:</strong></p>
            <ul>
              <li><strong>Start Time:</strong> ${eventDetails.start_time}</li>
              <li><strong>End Time:</strong> ${eventDetails.end_time}</li>
              <li><strong>Description:</strong> ${eventDetails.description || 'No description provided'}</li>
            </ul>
            <p><a href="${eventDetails.event_url || 'https://example.com/event'}">View Event</a></p>
            <p>Please let us know if you can attend!</p>
          </body>
        </html>
      `;

      // Log the email content (instead of sending a real email)
      console.log(`Sending invitation to ${invitee.email}:`);
      console.log(emailContent);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed invitations for ${invitees.length} invitees`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error processing invitations:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing the invitations',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}