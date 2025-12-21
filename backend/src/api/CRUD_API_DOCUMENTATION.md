# CRUD API Endpoints Documentation

This document describes all the CRUD (Create, Read, Update, Delete) endpoints available in the Screenshot Scraper API.

## Overview

The API provides full CRUD operations for all major entities in the system:
1. Users
2. Scrape Jobs
3. Screenshots
4. API Usage Records

## Authentication

All endpoints (except health check) require authentication via API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Base URL

All endpoints are prefixed with `/api/v1`.

## Entities and Endpoints

### Users

Manage user accounts and API keys.

#### List Users

```
GET /api/v1/users/
```

Retrieve a list of users with pagination support.

Query Parameters:
- `skip` (integer, optional): Number of records to skip (default: 0)
- `limit` (integer, optional): Maximum number of records to return (default: 100, max: 1000)

#### Get User

```
GET /api/v1/users/{user_id}
```

Retrieve a specific user by ID.

Path Parameters:
- `user_id` (integer, required): The ID of the user

#### Create User

```
POST /api/v1/users/
```

Create a new user account.

Request Body:
```json
{
  "email": "user@example.com",
  "api_key": "unique-api-key",
  "tier": "free",
  "quota_remaining": 100
}
```

Required fields:
- `email` (string): User's email address (must be unique)
- `api_key` (string): Unique API key for authentication

Optional fields:
- `tier` (string): User tier ("free", "pro", "enterprise") - defaults to "free"
- `quota_remaining` (integer): Remaining quota for scraping operations - defaults to 100

#### Update User

```
PUT /api/v1/users/{user_id}
```

Update an existing user account.

Path Parameters:
- `user_id` (integer, required): The ID of the user

Request Body:
```json
{
  "email": "updated@example.com",
  "api_key": "new-api-key",
  "tier": "pro",
  "quota_remaining": 500
}
```

All fields are optional. Only provided fields will be updated.

#### Delete User

```
DELETE /api/v1/users/{user_id}
```

Delete a user account.

Path Parameters:
- `user_id` (integer, required): The ID of the user

### Scrape Jobs

Manage screenshot scraping jobs.

#### List Scrape Jobs

```
GET /api/v1/jobs/
```

Retrieve a list of scrape jobs with pagination support.

Query Parameters:
- `skip` (integer, optional): Number of records to skip (default: 0)
- `limit` (integer, optional): Maximum number of records to return (default: 100, max: 1000)

#### Get Scrape Job

```
GET /api/v1/jobs/{job_id}
```

Retrieve a specific scrape job by ID.

Path Parameters:
- `job_id` (integer, required): The ID of the scrape job

#### Create Scrape Job

```
POST /api/v1/jobs/
```

Create a new scrape job.

Request Body:
```json
{
  "user_id": 1,
  "app_id": "com.example.app",
  "store": "playstore",
  "status": "pending"
}
```

Required fields:
- `user_id` (integer): ID of the user who owns this job
- `app_id` (string): Package name (Play Store) or App ID (App Store)
- `store` (string): Target store ("playstore" or "appstore")

Optional fields:
- `status` (string): Initial job status - defaults to "pending"

#### Update Scrape Job

```
PUT /api/v1/jobs/{job_id}
```

Update an existing scrape job.

Path Parameters:
- `job_id` (integer, required): The ID of the scrape job

Request Body:
```json
{
  "status": "completed",
  "screenshots_count": 5,
  "started_at": "2023-01-01T10:00:00Z",
  "completed_at": "2023-01-01T10:01:30Z",
  "error_message": "Optional error message"
}
```

All fields are optional. Only provided fields will be updated.

#### Delete Scrape Job

```
DELETE /api/v1/jobs/{job_id}
```

Delete a scrape job.

Path Parameters:
- `job_id` (integer, required): The ID of the scrape job

### Screenshots

Manage individual screenshot records.

#### List Screenshots

```
GET /api/v1/screenshots-crud/
```

Retrieve a list of screenshots with pagination support.

Query Parameters:
- `skip` (integer, optional): Number of records to skip (default: 0)
- `limit` (integer, optional): Maximum number of records to return (default: 100, max: 1000)

#### Get Screenshot

```
GET /api/v1/screenshots-crud/{screenshot_id}
```

Retrieve a specific screenshot by ID.

Path Parameters:
- `screenshot_id` (integer, required): The ID of the screenshot

#### Create Screenshot

```
POST /api/v1/screenshots-crud/
```

Create a new screenshot record.

Request Body:
```json
{
  "job_id": 12345,
  "url": "https://example.com/screenshot.png",
  "s3_key": "optional-s3-key",
  "device_type": "mobile",
  "resolution": "1080x1920",
  "file_size": 102400
}
```

Required fields:
- `job_id` (integer): ID of the scrape job this screenshot belongs to
- `url` (string): URL where the screenshot can be accessed

Optional fields:
- `s3_key` (string): Key for the screenshot in S3 storage
- `device_type` (string): Type of device the screenshot was taken on
- `resolution` (string): Screen resolution of the screenshot
- `file_size` (integer): Size of the screenshot file in bytes

#### Update Screenshot

```
PUT /api/v1/screenshots-crud/{screenshot_id}
```

Update an existing screenshot record.

Path Parameters:
- `screenshot_id` (integer, required): The ID of the screenshot

Request Body:
```json
{
  "s3_key": "updated-s3-key",
  "device_type": "tablet",
  "resolution": "1536x2048",
  "file_size": 204800
}
```

All fields are optional. Only provided fields will be updated.

#### Delete Screenshot

```
DELETE /api/v1/screenshots-crud/{screenshot_id}
```

Delete a screenshot record.

Path Parameters:
- `screenshot_id` (integer, required): The ID of the screenshot

### API Usage Records

Manage API usage tracking records.

#### List API Usage Records

```
GET /api/v1/usage/
```

Retrieve a list of API usage records with pagination support.

Query Parameters:
- `skip` (integer, optional): Number of records to skip (default: 0)
- `limit` (integer, optional): Maximum number of records to return (default: 100, max: 1000)

#### Get API Usage Record

```
GET /api/v1/usage/{usage_id}
```

Retrieve a specific API usage record by ID.

Path Parameters:
- `usage_id` (integer, required): The ID of the usage record

#### Create API Usage Record

```
POST /api/v1/usage/
```

Create a new API usage record.

Request Body:
```json
{
  "user_id": 1,
  "endpoint": "/api/v1/screenshots/scrape",
  "response_time_ms": 150,
  "status_code": 200
}
```

Required fields:
- `user_id` (integer): ID of the user who made the API call
- `endpoint` (string): API endpoint that was called
- `response_time_ms` (integer): Response time in milliseconds
- `status_code` (integer): HTTP status code returned

#### Update API Usage Record

```
PUT /api/v1/usage/{usage_id}
```

Update an existing API usage record.

Path Parameters:
- `usage_id` (integer, required): The ID of the usage record

Request Body:
```json
{
  "response_time_ms": 200,
  "status_code": 400
}
```

All fields are optional. Only provided fields will be updated.

#### Delete API Usage Record

```
DELETE /api/v1/usage/{usage_id}
```

Delete an API usage record.

Path Parameters:
- `usage_id` (integer, required): The ID of the usage record

## Error Responses

All endpoints follow standard HTTP status codes:

- 200: Success (GET, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing or invalid API key)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "detail": "Error message describing the problem"
}
```

## Rate Limits

- Free tier: 100 requests per minute
- Pro tier: 1000 requests per minute
- Enterprise tier: 10000 requests per minute

## Pagination

All list endpoints support pagination with `skip` and `limit` query parameters:
- Default limit: 100 records
- Maximum limit: 1000 records
- Skip parameter: Number of records to skip (default: 0)

Example:
```
GET /api/v1/users/?skip=10&limit=50
```

This retrieves 50 users, skipping the first 10 records.