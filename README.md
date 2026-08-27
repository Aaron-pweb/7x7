# 7x7 Journal

<p align="center">
  <img src="public/pc-view.png" alt="Desktop View" height="400" />
  <img src="public/mobile-view.jpg" alt="Mobile View" height="400" />
</p>

A web application designed for mindful journaling, asking 7 different questions about your daily activity. Built as a Progressive Web App (PWA) with offline capabilities.

## Features

- Daily Journaling: Answer 7 curated questions every day.
- Progressive Web App: Installable on mobile devices with offline caching.
- Authentication: Secure user accounts via Supabase.
- Role-Based Access Control: Granular permissions for Users, Admins, and Superadmins.
- Challenge System: Real-time participation and progression tracking.
- Strict CI/CD: Automated linting, type-checking, and schema validation.

## Tech Stack

- Framework: Next.js 16 (App Router)
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Supabase
- Styling: Tailwind CSS
- Animation: Framer Motion
- PWA: Serwist

## Getting Started

### Prerequisites

- Node.js 22 or higher
- A Supabase project (PostgreSQL)

### Environment Variables

Create a `.env.local` file in the root of the project with the following keys:

```
DATABASE_URL="postgresql://user:password@host:port/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/dbname"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate the Prisma client:
```bash
npx prisma generate
```

3. Push the database schema:
```bash
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Deployment

The application is configured for deployment on Vercel. 
Ensure you set the required environment variables in the Vercel dashboard. The build step is configured to automatically generate the Prisma client before bundling the Next.js application.
