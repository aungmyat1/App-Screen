# API Endpoint Structure

## Overview

The AppScreens API follows RESTful principles and is organized around resources. All endpoints require authentication unless otherwise specified.

## Authentication

### POST /api/v1/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "organization_name": "Acme Corp"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "organization": {
    "id": "uuid",
    "name": "Acme Corp"
  },
  "token": "jwt-token"
}
```

### POST /api/v1/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "jwt-token"
}
```

### POST /api/v1/auth/logout
Logout user
```json
{
  "refresh_token": "refresh-token"
}
```

## Users

### GET /api/v1/users/profile
Get authenticated user profile

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "admin",
  "organization": {
    "id": "uuid",
    "name": "Acme Corp"
  }
}
```

### PUT /api/v1/users/profile
Update user profile
```json
{
  "first_name": "Jane",
  "last_name": "Smith"
}
```

### PUT /api/v1/users/password
Update user password
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

## Organizations

### GET /api/v1/organizations
Get user's organization

Response:
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "billing_email": "billing@acme.com"
}
```

### PUT /api/v1/organizations
Update organization
```json
{
  "name": "New Corp Name",
  "billing_email": "newbilling@example.com"
}
```

## Teams

### GET /api/v1/teams
List teams in organization

Response:
```json
[
  {
    "id": "uuid",
    "name": "Design Team",
    "description": "UI/UX Designers",
    "member_count": 5
  }
]
```

### POST /api/v1/teams
Create a new team
```json
{
  "name": "Development Team",
  "description": "Software Developers"
}
```

### GET /api/v1/teams/{teamId}
Get team details

Response:
```json
{
  "id": "uuid",
  "name": "Development Team",
  "description": "Software Developers",
  "members": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "member"
    }
  ]
}
```

### PUT /api/v1/teams/{teamId}
Update team
```json
{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

### DELETE /api/v1/teams/{teamId}
Delete team

### POST /api/v1/teams/{teamId}/members
Add member to team
```json
{
  "user_id": "uuid",
  "role": "member"
}
```

### DELETE /api/v1/teams/{teamId}/members/{userId}
Remove member from team

## Projects

### GET /api/v1/projects
List projects

Response:
```json
[
  {
    "id": "uuid",
    "name": "Mobile App Redesign",
    "description": "Redesign of mobile application",
    "created_at": "2023-01-01T00:00:00Z"
  }
]
```

### POST /api/v1/projects
Create project
```json
{
  "name": "New Project",
  "description": "Project description"
}
```

### GET /api/v1/projects/{projectId}
Get project details

### PUT /api/v1/projects/{projectId}
Update project
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

### DELETE /api/v1/projects/{projectId}
Delete project

## Screenshot Jobs

### GET /api/v1/jobs
List screenshot jobs

Query Parameters:
- `status`: Filter by job status (pending, processing, completed, failed)
- `project_id`: Filter by project
- `limit`: Number of jobs to return (default: 20)
- `offset`: Offset for pagination (default: 0)

Response:
```json
[
  {
    "id": "uuid",
    "app_id": "com.example.app",
    "app_url": "https://play.google.com/store/apps/details?id=com.example.app",
    "store": "google",
    "status": "completed",
    "created_at": "2023-01-01T00:00:00Z",
    "completed_at": "2023-01-01T00:05:00Z"
  }
]
```

### POST /api/v1/jobs
Create screenshot job
```json
{
  "app_url": "https://play.google.com/store/apps/details?id=com.example.app",
  "store": "google",
  "project_id": "uuid" // optional
}
```

Response:
```json
{
  "id": "uuid",
  "app_id": "com.example.app",
  "app_url": "https://play.google.com/store/apps/details?id=com.example.app",
  "store": "google",
  "status": "pending",
  "created_at": "2023-01-01T00:00:00Z"
}
```

### GET /api/v1/jobs/{jobId}
Get job details

Response:
```json
{
  "id": "uuid",
  "app_id": "com.example.app",
  "app_url": "https://play.google.com/store/apps/details?id=com.example.app",
  "store": "google",
  "status": "completed",
  "result_url": "https://cdn.example.com/screenshots/job-uuid.zip",
  "screenshots": [
    {
      "id": "uuid",
      "url": "https://cdn.example.com/screenshots/job-uuid/1.png",
      "width": 1080,
      "height": 1920,
      "device_type": "mobile",
      "orientation": "portrait"
    }
  ],
  "created_at": "2023-01-01T00:00:00Z",
  "completed_at": "2023-01-01T00:05:00Z"
}
```

### DELETE /api/v1/jobs/{jobId}
Delete job

## Screenshots

### GET /api/v1/screenshots
List screenshots

Query Parameters:
- `job_id`: Filter by job
- `device_type`: Filter by device type
- `limit`: Number of screenshots to return (default: 20)
- `offset`: Offset for pagination (default: 0)

### GET /api/v1/screenshots/{screenshotId}
Get screenshot details

## Sharing

### POST /api/v1/jobs/{jobId}/share
Share job with another user
```json
{
  "user_id": "uuid",
  "permission": "view" // view, edit, download
}
```

### GET /api/v1/shared/jobs
List jobs shared with user

### DELETE /api/v1/shared/jobs/{sharedId}
Unshare job

## Comments

### GET /api/v1/jobs/{jobId}/comments
List comments on job

Response:
```json
[
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe"
    },
    "content": "This looks great!",
    "created_at": "2023-01-01T00:00:00Z"
  }
]
```

### POST /api/v1/jobs/{jobId}/comments
Add comment to job
```json
{
  "content": "This needs more work",
  "parent_id": "uuid" // optional, for replies
}
```

### PUT /api/v1/comments/{commentId}
Update comment
```json
{
  "content": "Updated comment"
}
```

### DELETE /api/v1/comments/{commentId}
Delete comment

## Subscriptions

### GET /api/v1/subscriptions
Get organization subscription

Response:
```json
{
  "id": "uuid",
  "plan_id": "pro",
  "status": "active",
  "current_period_start": "2023-01-01T00:00:00Z",
  "current_period_end": "2023-02-01T00:00:00Z"
}
```

### POST /api/v1/subscriptions
Create or update subscription
```json
{
  "plan_id": "enterprise",
  "payment_method_nonce": "payment-method-nonce"
}
```

### POST /api/v1/subscriptions/cancel
Cancel subscription

## Usage

### GET /api/v1/usage
Get organization usage statistics

Response:
```json
{
  "period_start": "2023-01-01T00:00:00Z",
  "period_end": "2023-02-01T00:00:00Z",
  "metrics": {
    "screenshots_taken": 150,
    "storage_used": 1024000000, // in bytes
    "jobs_processed": 75
  }
}
```

## Real-time Collaboration

### WebSocket Endpoint
`wss://api.appscreens.com/v1/ws`

Events:
- `job.status.updated`: Job status changed
- `job.shared`: Job shared with user
- `comment.created`: New comment added
- `comment.updated`: Comment updated
- `comment.deleted`: Comment deleted

## Rate Limiting

API requests are rate-limited:
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated users
- 10 requests per minute for file uploads

## Error Responses

All error responses follow this format:
```json
{
  "error": {
    "code": "error_code",
    "message": "Human readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error