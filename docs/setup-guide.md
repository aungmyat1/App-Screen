# AppScreens Setup Guide

This guide will help you set up and run the AppScreens application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Docker (optional, for containerized deployment)
- Git

## Architecture Overview

AppScreens consists of:
1. **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
2. **Backend**: NestJS with TypeScript, PostgreSQL, and TypeORM
3. **Database**: PostgreSQL
4. **Payment Processing**: Braintree
5. **Deployment**: Docker & Docker Compose

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd App-Screen-
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=appscreen

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Braintree Configuration
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key

# Server Configuration
PORT=5000
```

#### Database Setup

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE appscreen;
```

The application will automatically create tables on first run.

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Running the Application

#### Development Mode

Start the backend:

```bash
cd ../backend
npm run start:dev
```

In a new terminal, start the frontend:

```bash
cd ../frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

#### Production Mode

Build the backend:

```bash
cd backend
npm run build
```

Build the frontend:

```bash
cd ../frontend
npm run build
```

Start the applications:

```bash
# Start backend
cd ../backend
npm run start:prod

# Start frontend (in a new terminal)
cd ../frontend
npm run start
```

### 5. Docker Deployment (Optional)

The application includes Docker configuration for containerized deployment.

#### Build and Run with Docker Compose

```bash
docker-compose up -d
```

This will start:
- Frontend service on port 3000
- Backend service on port 5000
- PostgreSQL database on port 5432

#### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Configuration Details

### Database Configuration

The application uses PostgreSQL with TypeORM. Make sure your database credentials are correctly set in the backend `.env` file.

### Braintree Payment Configuration

To enable payment processing:

1. Sign up for a Braintree account at https://www.braintreegateway.com/
2. Obtain your Merchant ID, Public Key, and Private Key
3. Add these to your backend `.env` file
4. Configure your plans in the Braintree control panel

### Authentication

The application uses JWT for authentication:
- Tokens expire after 7 days by default
- Passwords are hashed using bcrypt
- User sessions are managed via localStorage on the frontend

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get authenticated user profile

### Screenshots
- `POST /api/screenshots` - Request app screenshots
- `GET /api/screenshots/:id` - Get screenshot job status
- `GET /api/screenshots` - Get user's screenshot jobs
- `GET /api/download/screenshots/:jobId` - Download completed screenshots

### Payment
- `GET /api/payment/client-token` - Get Braintree client token
- `POST /api/payment/subscribe` - Subscribe to a plan
- `POST /api/payment/cancel` - Cancel subscription

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env` file
   - Verify the database exists

2. **Braintree Integration Not Working**
   - Verify Braintree credentials in `.env` file
   - Ensure you're using the correct environment (Sandbox/Production)

3. **Frontend Cannot Connect to Backend**
   - Check that the backend is running
   - Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Getting Help

If you encounter issues not covered in this guide:
1. Check the application logs for error messages
2. Ensure all dependencies are correctly installed
3. Verify all environment variables are properly set
4. Consult the official documentation for the technologies used:
   - [Next.js Documentation](https://nextjs.org/docs)
   - [NestJS Documentation](https://docs.nestjs.com/)
   - [Braintree Documentation](https://developer.paypal.com/braintree/docs)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.