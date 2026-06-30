# Better Auth & Next.js

A minimal reference implementation showcasing full-stack authentication inside **Next.js** using **Better Auth**, featuring multi-provider OAuth integration, centralized monitoring, and automated session management.

> [!IMPORTANT]
> **Disclaimer:** This is reference code. Production implementations require proper security measures.

---

## Environment Variables

Create a `.env` file in the root directory and populate it with the following architecture variables:

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

Clone the repository, install the dependencies, and fire up the local development server using your preferred package manager:

```bash
# install dependencies
npm install # or yarn, pnpm, bun

# start the development server
npm run dev
```

---

## Deployment & Verification

You can interact with the authentication middleware flows through the following execution contexts:

* Localhost: [http://localhost:3000](http://localhost:3000)
* Public running: [https://better-auth.vercel.rdev.eti.br](https://better-auth.vercel.rdev.eti.br)

```
ricardo albrecht - ricardoalbrecht1@gmail.com
```