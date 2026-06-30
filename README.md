# Better Auth & Next.js

A minimal reference implementation showcasing full-stack authentication inside **Next.js** using **Better Auth**, featuring multi-provider OAuth integration, centralized monitoring, and automated session management via middleware-based route protection.

> [!IMPORTANT]
> **Disclaimer:** This is reference code. Production implementations require proper security measures. Route protection is handled by a built-in middleware layer (`src/middleware.ts`), but you should audit it for your specific security requirements.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Auth | [Better Auth](https://better-auth.com) |
| Database | PostgreSQL + [Prisma](https://www.prisma.io/) |
| Validation | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) |
| Monitoring | [Sentry](https://sentry.io/) |
| Toasts | [react-toastify](https://fkhadra.github.io/react-toastify/) |
| Icons | [Lucide React](https://lucide.dev/) + [Phosphor Icons](https://phosphoricons.com/) |

---

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...all]/route.ts  # Better Auth API handler (GET/POST)
│   ├── dashboard/
│   │   ├── page.tsx                 # Protected dashboard (server-side session check)
│   │   └── components/
│   │       └── button-signout.tsx   # Client-side sign-out button
│   ├── signin/
│   │   └── components/
│   │       └── signin-form.tsx      # Login form (email/password + social OAuth)
│   ├── signup/
│   │   ├── page.tsx                 # Sign-up page
│   │   └── components/
│   │       └── signup-form.tsx      # Registration form
│   ├── layout.tsx                   # Root layout (fonts, toast provider)
│   ├── page.tsx                     # Home page (login entry point)
│   ├── globals.css                  # Tailwind + theme tokens
│   └── global-error.tsx             # Sentry-integrated error boundary
├── components/ui/
│   └── toast.tsx                    # react-toastify provider wrapper
├── lib/
│   ├── auth.ts                      # Server-side Better Auth config + provider detection
│   ├── auth-client.ts               # Client-side auth client
│   ├── prisma.ts                    # Prisma singleton for dev hot-reload safety
│   └── utils.ts                     # Tailwind class merge utility (cn)
├── middleware.ts                     # Route protection — redirects unauthenticated users to /
├── instrumentation.ts               # Sentry server-side registration
└── instrumentation-client.ts        # Sentry client-side initialization
```

---

## Environment Variables

Create a `.env` file in the root directory and populate it with the following variables:

```env
# Database connection
DATABASE_URL=

# Sentry
SENTRY_AUTH_TOKEN=
SENTRY_DSN=
SENTRY_TRACES_SAMPLE_RATE=
SENTRY_ENABLE_LOGS=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Public vars
NEXT_PUBLIC_URL=http://localhost:3000

# Social Providers
# Twitch
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
# X
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
# GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## Getting Started

Clone the repository, install the dependencies, set up the database, and fire up the local development server:

```bash
# install dependencies
npm install

# generate Prisma client and run database migrations
npx prisma generate
npx prisma migrate dev

# start the development server
npm run dev
```

---

## Authentication Flow

```
Public routes (/, /signin, /signup)    →  Accessible without authentication
Protected routes (/dashboard, etc.)    →  Redirected to / if no valid session

Email/Password sign-in    →  /signin  →  redirects to /dashboard on success
Social OAuth sign-in      →  /signin  →  Better Auth OAuth flow  →  /dashboard
Sign-up                   →  /signup  →  redirects to /dashboard on success
Sign-out                  →  /dashboard  →  clears session, redirects to /
```

The middleware (`src/middleware.ts`) inspects every request and performs a server-side session check via Better Auth's `getSession`. Public and static paths are excluded.

---

ricardo albrecht - ricardoalbrecht1@gmail.com