# Architecture Decision Record: Supabase Authentication and Event Management Implementation

## Title
Use Supabase with Google OAuth for Authentication and Event Management in Student Event Planner Application

## Status
Accepted

## Context
Our Next.js application requires a robust authentication system and event management capabilities to help students manage events, tasks, and collaborations efficiently. We need to decide on an architecture that balances development speed, security, maintainability, scalability, and real-time collaboration features. The primary requirements include implementing Google OAuth for user authentication and a centralized calendar system for event and task management specifically tailored for students.

## Decision
We will implement authentication and event management using Supabase with Google OAuth integration for the following reasons:

### Technical Requirements
- Need to support email/password authentication
- Requirement for Google OAuth provider
- Server-side rendering compatibility
- Type safety with TypeScript
- Session management
- Protected route implementation
- Real-time event and task synchronization
- Calendar data storage and retrieval
- User profile management
- Collaboration and invitation system

### Frameworks and Libraries Chosen
- **Frontend Framework**: Next.js 15.5.4
- **Runtime Environment**: React 19.1.0
- **Language**: TypeScript
- **UI Components**: Radix UI primitives, Tailwind CSS
- **Authentication Library**: Supabase JavaScript client library (@supabase/supabase-js v2.75.0)
- **Database**: Supabase PostgreSQL database
- **UI Styling**: Tailwind CSS with Tailwind Merge for class composition
- **Calendar Components**: FullCalendar or custom calendar implementations
- **Real-time Features**: Supabase real-time subscriptions

### Session Strategy
- **JWT-based Authentication**: Supabase uses JSON Web Tokens (JWT) for session management
- **Client-side Storage**: Session tokens are stored in browser storage and managed by the Supabase client
- **Automatic Token Refresh**: Supabase handles token refresh automatically to maintain user sessions
- **Secure Token Handling**: Tokens are stored securely and included in requests automatically

### User Record Storage
- **Database**: User records are stored in Supabase's PostgreSQL database
- **Authentication Tables**: Supabase automatically manages authentication tables (auth.users, auth.identities)
- **User Profiles**: Additional user profile data can be stored in custom tables linked to auth.users
- **Event and Task Data**: Calendar events and tasks stored in dedicated tables with relationships to users
- **Collaboration Data**: Event participants and invitation data stored in related tables
- **Security**: Database access is controlled through Row Level Security (RLS) policies

### Redirect URIs
- **Local Development**: http://localhost:3000
- **Production**: https://[domain].com (to be configured based on deployment)
- **OAuth Callbacks**: Configured in Supabase dashboard for Google OAuth provider
- **Auth Callback Path**: /auth/callback (standard path for handling authentication redirects)

### Why Supabase?
1. **Rapid Development**: Supabase provides a complete authentication backend without requiring custom server implementation
2. **Built-in Security**: Handles password hashing, session management, and security best practices out-of-the-box
3. **Database Integration**: Seamlessly integrates with Supabase's PostgreSQL database for user profiles, events, and tasks
4. **OAuth Support**: Easy integration with Google OAuth provider
5. **Real-time Capabilities**: Essential for collaborative calendar features and real-time updates
6. **Scalability**: Managed infrastructure that scales automatically
7. **Type Safety**: Excellent TypeScript support with generated types
8. **Row Level Security**: Built-in security model to control data access per user
9. **Storage**: Potential for file attachments to events or tasks in the future

## Implementation Approach
1. Use Supabase JavaScript client library
2. Create authentication context for state management
3. Create calendar context for event and task state management
4. Implement protected route components
5. Build login/signup UI components
6. Configure environment variables for Supabase credentials
7. Implement Google OAuth sign-in functionality
8. Design database schema for events, tasks, and collaboration features
9. Implement real-time subscriptions for collaborative updates
10. Create calendar UI components with multiple view options

## Common Configuration Issues and Solutions

### Issue: "Anonymous sign-ins are disabled" error
**Description**: When attempting to sign up with email/password, the error "Anonymous sign-ins are disabled" appears.

**Solution**: This error occurs when email/password authentication is not enabled in the Supabase dashboard. To fix this:
1. Go to your Supabase dashboard at https://supabase.com/dashboard
2. Select your project
3. Navigate to the "Authentication" section in the sidebar
4. Click on "Settings" under Authentication
5. Ensure that "Email and password" option is enabled
6. Ensure that "Sign up enabled" is toggled on
7. Save the changes

### Issue: Google OAuth not working
**Description**: When attempting to sign in with Google, the OAuth flow fails.

**Solution**: This error occurs when Google OAuth is not properly configured in the Supabase dashboard. To fix this:
1. Go to your Supabase dashboard at https://supabase.com/dashboard
2. Select your project
3. Navigate to the "Authentication" section in the sidebar
4. Click on "Settings" under Authentication
5. Ensure that "Google" OAuth provider is enabled
6. Add the redirect URI for your application (e.g., http://localhost:3000/auth/callback)
7. Configure Google OAuth credentials in the Supabase authentication settings
8. Save the changes

### Issue: Real-time updates not working for collaborative features
**Description**: When multiple users modify events, changes don't sync in real-time.

**Solution**: This error occurs when real-time subscriptions are not properly configured:
1. Ensure Row Level Security (RLS) policies are correctly set up for the relevant tables
2. Enable real-time for the tables in the Supabase dashboard
3. Verify that the subscription is correctly implemented in the client code
4. Check that the user has proper permissions to access the data they're subscribing to

**Prevention**: When setting up a new Supabase project, always verify that the required authentication providers are enabled in the dashboard.

## Consequences

### Positive
- Reduced development time for authentication and data management features
- Industry-standard security practices
- Easy maintenance and updates
- Built-in user management dashboard
- Google OAuth provides seamless user experience
- Real-time collaboration capabilities for shared calendars
- Potential to leverage additional Supabase features (database, storage, real-time)
- Scalable solution that can handle multiple users and events

### Negative
- Vendor lock-in to Supabase platform
- Additional external dependency
- Monthly costs that scale with usage
- Less control over authentication and database implementation details
- Google OAuth requires additional configuration steps
- Real-time features may introduce complexity

### Neutral
- Learning curve for Supabase platform features and real-time capabilities
- Requires internet connectivity for authentication and real-time features

## Alternatives Considered

### NextAuth.js + Custom Database
- Pros: Popular, excellent Next.js integration, many providers, full control over database
- Cons: Requires additional setup for database and real-time features, self-managed session handling

### Firebase Authentication + Firestore
- Pros: Mature platform, good real-time capabilities, integrated solution
- Cons: Vendor lock-in to Google, potential cost considerations, different database paradigm

### Custom JWT + PostgreSQL
- Pros: Full control over authentication flow and data management, no vendor lock-in
- Cons: More complex implementation, security responsibility, session management complexity, no built-in real-time features

## Decision Drivers
- Time-to-market requirements for event and task management features
- Security best practices
- Team familiarity with Supabase
- Integration with existing tech stack
- Scalability needs
- Requirement for Google OAuth integration
- Need for real-time collaboration features
- Requirement for robust database management

## Related Decisions
- Tech stack includes Next.js with TypeScript
- Docker containerization approach
- Calendar component library selection (FullCalendar or custom)
- Notification system implementation

## Notes
This decision aligns with our goal of rapid development while maintaining security standards. Supabase provides a good balance between control and convenience for our authentication and event management needs. The real-time capabilities are particularly valuable for the collaborative aspects of the student event planner application, allowing multiple students to view and modify shared calendars simultaneously for group projects and study sessions.