# Architecture Decision Record: Supabase Authentication Implementation

## Title
Use Supabase with Google OAuth for Authentication in Next.js Application

## Status
Accepted

## Context
Our Next.js application requires a robust authentication system to secure user data and provide personalized experiences. We need to decide on an authentication approach that balances development speed, security, maintainability, and scalability. The primary requirement is to implement Google OAuth for user authentication.

## Decision
We will implement authentication using Supabase with Google OAuth integration for the following reasons:

### Technical Requirements
- Need to support email/password authentication
- Requirement for Google OAuth provider
- Server-side rendering compatibility
- Type safety with TypeScript
- Session management
- Protected route implementation

### Frameworks and Libraries Chosen
- **Frontend Framework**: Next.js 15.5.4
- **Runtime Environment**: React 19.1.0
- **Language**: TypeScript
- **UI Components**: Radix UI primitives, Tailwind CSS
- **Authentication Library**: Supabase JavaScript client library (@supabase/supabase-js v2.75.0)
- **Database**: Supabase PostgreSQL database
- **UI Styling**: Tailwind CSS with Tailwind Merge for class composition

### Session Strategy
- **JWT-based Authentication**: Supabase uses JSON Web Tokens (JWT) for session management
- **Client-side Storage**: Session tokens are stored in browser storage and managed by the Supabase client
- **Automatic Token Refresh**: Supabase handles token refresh automatically to maintain user sessions
- **Secure Token Handling**: Tokens are stored securely and included in requests automatically

### User Record Storage
- **Database**: User records are stored in Supabase's PostgreSQL database
- **Authentication Tables**: Supabase automatically manages authentication tables (auth.users, auth.identities)
- **User Profiles**: Additional user profile data can be stored in custom tables linked to auth.users
- **Security**: Database access is controlled through Row Level Security (RLS) policies

### Redirect URIs
- **Local Development**: http://localhost:3000
- **Production**: https://[domain].com (to be configured based on deployment)
- **OAuth Callbacks**: Configured in Supabase dashboard for Google OAuth provider
- **Auth Callback Path**: /auth/callback (standard path for handling authentication redirects)

### Why Supabase?
1. **Rapid Development**: Supabase provides a complete authentication backend without requiring custom server implementation
2. **Built-in Security**: Handles password hashing, session management, and security best practices out-of-the-box
3. **Database Integration**: Seamlessly integrates with Supabase's PostgreSQL database for user profiles and related data
4. **OAuth Support**: Easy integration with Google OAuth provider
5. **Real-time Capabilities**: Can leverage real-time features for collaborative applications in the future
6. **Scalability**: Managed infrastructure that scales automatically
7. **Type Safety**: Excellent TypeScript support with generated types

## Implementation Approach
1. Use Supabase JavaScript client library
2. Create authentication context for state management
3. Implement protected route components
4. Build login/signup UI components
5. Configure environment variables for Supabase credentials
6. Implement Google OAuth sign-in functionality

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

**Prevention**: When setting up a new Supabase project, always verify that the required authentication providers are enabled in the dashboard.

## Consequences

### Positive
- Reduced development time for authentication features
- Industry-standard security practices
- Easy maintenance and updates
- Built-in user management dashboard
- Google OAuth provides seamless user experience
- Potential to leverage additional Supabase features (database, storage, real-time)

### Negative
- Vendor lock-in to Supabase platform
- Additional external dependency
- Monthly costs that scale with usage
- Less control over authentication implementation details
- Google OAuth requires additional configuration steps

### Neutral
- Learning curve for Supabase platform features
- Requires internet connectivity for authentication

## Alternatives Considered

### NextAuth.js
- Pros: Popular, excellent Next.js integration, many providers
- Cons: Requires additional setup, self-managed session handling

### Custom JWT Implementation
- Pros: Full control over authentication flow, no vendor lock-in
- Cons: More complex implementation, security responsibility, session management complexity

### Firebase Authentication
- Pros: Mature platform, good documentation
- Cons: Vendor lock-in to Google, potential cost considerations

## Decision Drivers
- Time-to-market requirements
- Security best practices
- Team familiarity with Supabase
- Integration with existing tech stack
- Scalability needs
- Requirement for Google OAuth integration

## Related Decisions
- Tech stack includes Next.js with TypeScript
- Docker containerization approach
- Potential future use of Supabase database features

## Notes
This decision aligns with our goal of rapid development while maintaining security standards. Supabase provides a good balance between control and convenience for our authentication needs.