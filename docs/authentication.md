# Authentication Implementation

This document describes the authentication system implemented for the AppScreens application.

## Overview

The authentication system is built using NextAuth.js with the following features:

1. OAuth authentication with Google and GitHub
2. Email/password authentication
3. Email verification
4. User profile management
5. Role-based access control

## Implementation Details

### NextAuth.js Configuration

The authentication is configured in `frontend/lib/auth.ts` with:

- Google OAuth provider
- GitHub OAuth provider
- Prisma adapter for database integration
- Custom session callback to include user role
- Custom pages for sign in, verification request, and error handling

### Login Page

The login page (`frontend/app/login/page.tsx`) provides:

- OAuth buttons for Google and GitHub
- Email/password login form
- Redirect to registration page

### Registration Page

The registration page (`frontend/app/register/page.tsx`) provides:

- OAuth buttons for Google and GitHub
- Email/password registration form
- Password confirmation validation
- Automatic sign in after registration

### Profile Management

The profile page (`frontend/app/profile/page.tsx`) allows users to:

- Update their name and email
- Change their password
- Enable two-factor authentication

### Email Verification

Email verification is implemented with:

- Verification token generation
- Token expiration (24 hours)
- Verification API endpoint
- Resend verification email functionality

### Role-Based Access Control

Role-based access control is implemented with:

- RoleGuard component to protect routes
- User roles (USER, ADMIN, OWNER)
- Session callback that includes user role

## API Routes

### Registration API

`frontend/pages/api/auth/register.ts` handles user registration with:

- Input validation
- Duplicate email check
- Password hashing
- User creation

### Profile API

`frontend/pages/api/user/profile.ts` handles profile updates with:

- Session validation
- Input validation
- User data update

### Email Verification API

`frontend/pages/api/auth/verify-email.ts` handles email verification with:

- Token validation
- Token expiration check
- User verification status update

### Resend Verification API

`frontend/pages/api/auth/resend-verification.ts` handles resending verification emails with:

- Email validation
- New token generation
- Token expiration setting

## Database Schema

The User model in the Prisma schema includes:

- id: UUID primary key
- name: User's full name
- email: Unique email address
- emailVerified: Timestamp when email was verified
- emailVerificationToken: Token for email verification
- emailVerificationTokenExpiry: Expiration time for verification token
- password: Hashed password
- role: User role (USER, ADMIN, OWNER)
- image: User's profile image URL
- createdAt: Account creation timestamp
- updatedAt: Last update timestamp
- passwordLastChanged: Timestamp when password was last changed

## Security Considerations

1. Passwords are hashed using bcryptjs
2. Email verification tokens expire after 24 hours
3. Sessions are managed by NextAuth.js
4. Role-based access control prevents unauthorized access
5. Input validation is performed on all API endpoints

## Future Improvements

1. Implement password reset functionality
2. Add two-factor authentication
3. Implement account lockout after failed attempts
4. Add rate limiting to authentication endpoints
5. Implement OAuth account linking