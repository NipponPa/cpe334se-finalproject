# Next.js 15 ShadCN UI Template

This is a Next.js 15 application with React 19 using ShadCN UI components and Tailwind CSS for styling. It serves as a basic landing page template with UI examples to help you get started with your project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 18.17 or later)
- npm, yarn, or pnpm package manager
- Git

## Technologies Used

- [Next.js 15.5.4](https://nextjs.org/) - React framework
- [React 19.1.0](https://reactjs.org/) - JavaScript library for building user interfaces
- [React DOM 19.1.0](https://reactjs.org/) - React package for DOM-specific methods
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript language
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - Accessible and customizable UI components
- [Radix UI Primitives](https://www.radix-ui.com/) - Low-level UI components
- [Lucide React](https://lucide.dev/) - Icon library
- [Supabase](https://supabase.com/) - Backend-as-a-Service for authentication and database
- [React Hook Form](https://react-hook-form.com/) - Form handling library
- [Zod](https://zod.dev/) - Schema validation library
- [Docker](https://docker.com/) - Containerization platform
- [Docker Compose](https://docs.docker.com/compose/) - Container orchestration

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to your project directory:
   ```bash
   cd cpe334se-finalproject
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables by creating a `.env.local` file with your Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

To build and run the application in production mode:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000` (or the port specified in your environment)

### Docker Mode

To run the application using Docker:

1. Make sure you have Docker and Docker Compose installed
2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

The application will be available at `http://localhost:3000`


## Project Structure

```
.
├── public/
│   ├── ...
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page
│   │   ├── reset-password/
│   │   │   └── page.tsx      # Password reset page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        # Dashboard/Home page
│   ├── components/
│   │   ├── ProtectedRoute.tsx # Component to protect routes
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx   # Manages authentication state
│   └── lib/
│       ├── supabase.ts     # Supabase client initialization
│       └── utils.ts
├── docs/
│   └── adr/
│       └── 001-supabase-authentication-approach.md
├── .env.local.example      # Example environment variables
├── docker-compose.yml
├── Dockerfile
├── next.config.ts
├── package.json
└── tsconfig.json
```
## Authentication

This template uses **Supabase** for authentication. The authentication flow is managed through `src/contexts/AuthContext.tsx`, which provides hooks for signing up, signing in (with email/password and OAuth), and signing out.

- **Protected Routes**: The `src/components/ProtectedRoute.tsx` component ensures that only authenticated users can access certain pages.
- **UI Components**: The application includes pre-built pages for login, signup, and password reset in the `src/app/` directory.
- **Supabase Client**: The Supabase client is initialized in `src/lib/supabase.ts`.

## Features

- **Full Authentication Flow**: Email/password and OAuth (Google) sign-up and sign-in.
- **Protected Routes**: Secure pages accessible only to authenticated users.
- **Password Reset**: Functionality for users to reset their passwords.
- **Modern Tech Stack**: Next.js 15, React 19, and TypeScript.
- **Styled with Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **ShadCN UI Components**: A set of accessible and customizable UI components.
- **Docker Support**: Comes with `Dockerfile` and `docker-compose.yml` for easy containerization.


## Customization

To customize this template:

1. Modify the content in `src/app/page.tsx` to change the main page
2. Update the global styles in `src/app/globals.css`
3. Add new components to the `src/components/ui/` directory
4. Update the layout in `src/app/layout.tsx` as needed

## Contributing

If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions about this template, please check the documentation for the individual technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/docs)
