# Navigation Bar Component Design Specification
## PJ Pakjim Planner Application

### Overview
This document outlines the design specification for the responsive navigation bar component for the PJ Pakjim Planner application. The navigation bar will be a consistent UI element across the application that provides access to key features and user management.

### Requirements
Based on the user's request, the navigation bar must include the following elements, ordered from left to right:
- **Logo:** The text "PJ Pakjim Planner".
- **Date Controls:**
  - A "Current Date" button.
  - Navigation buttons for the previous and succeeding months.
- **Notifications:** A notification bell icon.
- **User Information:**
  - The user's email address and username.
  - A "Sign Out" button.

### Component Structure
The navigation bar will be composed of several sub-components for better maintainability:

#### 1. NavigationBar (Main Component)
- Responsible for overall layout and responsive behavior
- Contains all other sub-components
- Handles responsive breakpoints and layout adjustments

#### 2. LogoComponent
- Displays the application logo: "PJ Pakjim Planner"
- Links to the main dashboard when clicked

#### 3. DateControls
- Contains the "Current Date" button
- Includes previous and next month navigation buttons
- Communicates with the calendar context to update the displayed date

#### 4. NotificationIcon
- Displays a notification bell icon
- Shows a count of unread notifications
- Opens a dropdown with notification details when clicked

#### 5. UserInfo
- Displays the user's email address and username
- Contains the sign-out functionality
- Shows a dropdown menu on click with user options

### Visual Design
The navigation bar will follow the existing application color scheme and design patterns:

- **Background Color:** Dark theme with `#373434` (consistent with ProtectedRoute component)
- **Text Color:** `#FFDA68` (yellow/gold accent color)
- **Button Colors:** `#FFD966` (yellow) with hover effects as seen in CalendarHeader
- **Spacing:** Consistent padding and margins for visual harmony

### Responsive Layout Design

#### Desktop View (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│  PJ Pakjim Planner   [<<] [Current Month Year] [>>] [Today] [Notifications]  │
│                                                                             │
│                                                [User Email] [Username] [v] │
└─────────────────────────────────────────────────────┘
```

Layout:
- Logo on the far left
- Date controls in the center
- Notifications and user info on the far right
- All elements visible and fully accessible

#### Tablet View (768px - 1023px)
```
┌─────────────────────────────────────────────────────────────────┐
│  PJ Pakjim Planner   [<<] [Month Year] [>>] [Today] [N] [User]  │
└─────────────────────────────────┘
```

Layout:
- Logo on the far left
- Date controls in the center
- Notifications and user info on the far right
- Slightly condensed spacing
- Notification icon may be simplified to just the bell icon

#### Mobile View (<768px)
```
┌─────────────────────────────────┐
│  PJ Pakjim Planner        [☰] │
└─────────────────────────────────┘
```

Layout:
- Logo on the left
- Hamburger menu icon on the right
- Date controls and user info collapsed into a mobile menu
- When hamburger menu is clicked, a slide-out or dropdown menu appears with:
  - Date controls (Current Date, Previous/Next Month)
  - Notification bell icon
  - User email
  - User username
  - Sign Out button

### Breakpoint Specifications
- **Mobile:** Max-width: 767px
- **Tablet:** 768px - 1023px
- **Desktop:** Min-width: 1024px

### Component Implementation Details

#### NavigationBar Component Props
```typescript
interface NavigationBarProps {
  currentDate: Date;
 onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onSignOut: () => void;
  user: {
    email: string;
    username: string;
  };
  notificationCount?: number;
  onNotificationClick?: () => void;
}
```

#### Date Controls Behavior
- The "Current Date" button should navigate to the current month
- Previous month button (`<<`) navigates to the previous month
- Next month button (`>>`) navigates to the next month
- Month/year display shows the current month and year being viewed

#### User Info Dropdown
When clicked, the user info section should display a dropdown with:
- User's email address
- User's username
- Sign Out button
- Option to access profile settings (future enhancement)

#### Notification System
- Bell icon displays a badge with the number of unread notifications
- Clicking the bell icon opens a dropdown with recent notifications
- Each notification should have a title, time, and read/unread status

### Accessibility Considerations
- All interactive elements must be keyboard accessible
- Proper ARIA labels for screen readers
- Sufficient color contrast for readability
- Focus indicators for keyboard navigation
- Semantic HTML elements for proper document structure

### Performance Considerations
- Components should be optimized to prevent unnecessary re-renders
- Notification data should be efficiently managed to avoid performance issues
- Responsive behavior should be smooth without layout thrashing

### Future Enhancements
- Profile picture avatar next to user information
- Notification filtering options
- Theme switching capability (light/dark mode)
- Additional user menu options (Settings, Profile, etc.)

### Implementation Notes
- The component should integrate with the existing AuthContext for user information
- Date controls should communicate with the CalendarContext to update the displayed date range
- The component should be built using Tailwind CSS classes for consistency with the existing application
- Follow the same button styling patterns as seen in CalendarHeader.tsx