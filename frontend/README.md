# AppScreens Frontend

This is the frontend application for AppScreens, a service that allows users to download screenshots from the Apple App Store and Google Play Store.

## Features

- User authentication (login, registration, password reset)
- Role-based access control (RBAC)
- Subscription management and billing
- App screenshot downloading
- Responsive design with dark mode support

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication solution
- [React Query](https://react-query.tanstack.com/) - Data fetching and state management

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
  ├── layout.tsx          # Root layout
  ├── page.tsx            # Home page
  ├── login/              # Login page
  ├── register/           # Registration page
  ├── dashboard/          # Dashboard page
  ├── apps/               # App management page
  ├── billing/            # Billing and subscription page
  └── settings/           # User settings page

components/
  └── access-control.tsx  # RBAC components

contexts/
  └── auth-context.tsx    # Authentication context

lib/
  ├── rbac.ts             # Role-based access control
  ├── billing.ts          # Billing and subscription management
  ├── braintree-webhook.ts # Braintree webhook handling
  ├── security.ts         # Security utilities
  ├── env-config.ts       # Environment configuration
  ├── logger.ts           # Logging utilities
  └── compliance.ts       # Compliance utilities
```

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_STRIPE_KEY=your_stripe_public_key
```

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS features
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction) - learn about NextAuth.js features