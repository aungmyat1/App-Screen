<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AppScreens - App Screenshot Downloader

AppScreens is a web application that allows users to download screenshots from apps available on the Google Play Store and Apple App Store. The application consists of a React frontend and a Node.js/Express backend with MongoDB for data storage.

## Features

- Download app screenshots from Google Play Store and Apple App Store
- User authentication and account management
- Subscription plans (Free, Pro, Enterprise)
- REST API for developers
- Dark mode support

## Tech Stack

### Current Stack (Legacy)
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Braintree for payment processing
- Joi for validation

### Modern Stack (Recommended)
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **UI Components**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js or Auth0 with OAuth 2.0 + JWT
- **Payments**: Braintree
- **Caching/Search**: Redis/Elasticsearch
- **File Storage**: AWS S3 + CloudFront CDN
- **Deployment**: Docker & Kubernetes on AWS/Azure/GCP
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel/Netlify

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (for modern stack)
- MongoDB (for legacy stack)
- npm or yarn

## Installation

### Legacy Stack

1. Clone the repository:
```bash
git clone <repository-url>
cd App-Screen-
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Create a `.env` file in the `server` directory based on `.env.example`:
```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Braintree
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key

# Server
PORT=5000
```

### Modern Stack

1. Clone the repository:
```bash
git clone <repository-url>
cd App-Screen-
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the `backend` directory based on `.env.example`:
```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=appscreen
DB_PASSWORD=appscreen
DB_NAME=appscreen

# JWT
JWT_SECRET=appscreen_secret_key
JWT_EXPIRES_IN=7d

# Braintree
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key

# Server
PORT=5000
```

## Usage

### Legacy Stack

#### Development

1. Start the backend server:
```bash
npm run dev:server
```

2. Start the frontend development server:
```bash
npm run dev
```

#### Production

1. Build the frontend:
```bash
npm run build
```

2. Build the backend:
```bash
npm run build:server
```

### Modern Stack

#### Development

1. Start the backend server:
```bash
cd backend
npm run start:dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

#### Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

## Project Structure

### Legacy Stack
```
.
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   └── services/           # API services
├── server/                 # Backend source code
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
├── App.tsx                 # Main App component
├── index.tsx               # Entry point
└── vite.config.ts          # Vite configuration
```

### Modern Stack
```
.
├── frontend/               # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility functions and API services
│   └── styles/             # CSS files
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── entities/       # Database entities
│   │   ├── dtos/           # Data transfer objects
│   │   └── config/         # Configuration files
│   └── dist/               # Compiled output
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Screenshots
- `POST /api/screenshots` - Request app screenshots
- `GET /api/screenshots/:id` - Get screenshot job status
- `GET /api/screenshots` - Get user's screenshot jobs

### Payment
- `GET /api/payment/client-token` - Get Braintree client token
- `POST /api/payment/subscribe` - Process subscription payment
- `POST /api/payment/cancel` - Cancel subscription

## Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

This will start the frontend, backend, and database services.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
