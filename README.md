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
- [Supabase](https://supabase.com/) - Backend services (optional)
- [React Hook Form](https://react-hook-form.com/) - Form handling library
- [Zod](https://zod.dev/) - Schema validation library
- [Docker](https://docker.com/) - Containerization platform
- [Docker Compose](https://docs.docker.com/compose/) - Container orchestration

## Installation

Follow these steps to set up the project locally:

1. Clone the repository (if available) or create a new Next.js project:
   ```bash
   npx create-next-app@latest my-app --typescript --tailwind --eslint
   ```

2. Navigate to your project directory:
   ```bash
   cd my-app
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Install additional dependencies for ShadCN UI:
   ```bash
   npx shadcn@latest add card button input label
   ```

5. Install additional dependencies used in this template:
   ```bash
   npm install @radix-ui/react-label @radix-ui/react-slot lucide-react class-variance-authority clsx tailwind-merge tailwindcss-animate react-hook-form zod @supabase/supabase-js
   ```

6. Install development dependencies:
   ```bash
   npm install -D @types/node @types/react @types/react-dom autoprefixer postcss tailwindcss
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
├── public/                 # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                # Next.js 13+ app directory
│   │   ├── favicon.ico
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.module.css # Page-specific styles
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable components
│   │   └── ui/             # ShadCN UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   └── lib/
│       └── utils.ts        # Utility functions
├── .gitignore
├── components.json         # ShadCN configuration
├── eslint.config.mjs
├── next.config.ts          # Next.js configuration
├── package.json
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```
## Features

- Modern React development with Next.js 15
- Type-safe with TypeScript
- Beautiful UI with Tailwind CSS and ShadCN components
- Responsive design
- Dark mode support
- Pre-configured with ESLint and other development tools
- Optimized for performance
- Docker containerization support
- Supabase integration for backend services


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
