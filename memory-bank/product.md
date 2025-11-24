# Calendar Application Product Description

## Overview
The calendar application is a React/Next.js application that allows users to create, view, and manage events. It integrates with Supabase for authentication and database operations, providing a full-featured calendar experience with visual indicators and intuitive event management.

## Core Features
- User authentication and authorization
- Username handling during signup that connects the input to both the display name in Supabase authentication and the full name in the user table
- Month view calendar with day selection
- Event creation with title, description, start/end times
- Visual indicators for events on calendar days
- Friend selection for event invitations (now using internal notifications)
- Event detail view showing all events for a selected day
- Internal notification system for event invitations with accept/decline functionality
- Notification bell in navigation bar showing unread notification count

## Enhanced Features
- Visual date selection indicators: The calendar now clearly shows which day is selected when creating events, with visual feedback in the form of highlighted days and date displays in the AddEventForm header.
- Multi-day event support: Users can now create events that span multiple days, with proper visualization in the calendar grid showing start/middle/end day indicators.
- Editable events functionality: Users can click on existing events to edit them, with the form pre-populated with current event details and clear UI indicators distinguishing between creating new events and editing existing ones.
- Proper date handling: Fixed timezone-related issues that were causing incorrect dates, ensuring all event types (single-day, multi-day, all-day) display correctly without date shifting.
- Internal notification system: Replaced email invitations with an internal notification system for event invitations. Users can invite registered friends and they receive notifications in their notification bell with accept/decline options. Only registered users can be invited (external email functionality removed). Fixed the event creation flow to ensure notifications are created with actual event IDs from the database rather than temporary IDs.

## Profile Picture Management
- User profile pictures with upload, update, and deletion capabilities
- Support for multiple image formats (JPEG, PNG, GIF, WEBP) up to 5MB
- Client-side image optimization for faster loading and reduced storage
- Drag-and-drop interface with preview functionality
- OAuth integration to automatically use Google profile pictures as defaults
- Fallback to user initials when no profile picture is set

## User Experience Goals
- Intuitive event creation with clear visual cues about the target date
- Seamless multi-day event creation and visualization
- Easy editing of existing events
- Consistent date handling across all timezones
- Responsive and accessible UI components
- Personalized user experience through profile pictures
- Enhanced profile page with full name display instead of user ID and improved field ordering