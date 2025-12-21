# Screenshots API Endpoints

This document describes the core API endpoints for scraping mobile app screenshots.

## Base URL

All endpoints are prefixed with `/api/v1/screenshots`.

## Authentication

All endpoints require authentication via API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Scrape Screenshots

```
POST /api/v1/screenshots/scrape
```

Initiates a screenshot scraping job for a mobile app.

#### Request Body

```json
{
  "app_id": "com.example.app",
  "store": "playstore",
  "force_refresh": false
}
```

- `app_id` (string, required): Package name for Play Store or App ID for App Store
- `store` (string, required): Either "playstore" or "appstore"
- `force_refresh` (boolean, optional): Skip cache and force new scrape. Defaults to false.

#### Response

```json
{
  "job_id": 12345,
  "status": "queued",
  "estimated_time": "30-60 seconds"
}
```

#### Errors

- 403: Quota exceeded
- 400: Invalid request parameters

### Get Job Status

```
GET /api/v1/screenshots/job/{job_id}
```

Retrieves the status and results of a scraping job.

#### Path Parameters

- `job_id` (integer, required): The ID of the scraping job

#### Response

```json
{
  "job_id": 12345,
  "status": "completed",
  "screenshots": [
    "https://example.com/screenshot1.png",
    "https://example.com/screenshot2.png"
  ],
  "progress": 100.0
}
```

- `job_id` (integer): The ID of the scraping job
- `status` (string): Current status ("queued", "processing", "completed", "failed")
- `screenshots` (array): Array of screenshot URLs (empty if not completed)
- `progress` (float): Progress percentage (0-100)

#### Errors

- 404: Job not found

### Batch Scrape

```
POST /api/v1/screenshots/batch
```

Initiates multiple scraping jobs simultaneously (Pro/Enterprise tier only).

#### Request Body

```json
{
  "requests": [
    {
      "app_id": "com.example.app1",
      "store": "playstore",
      "force_refresh": false
    },
    {
      "app_id": "com.example.app2",
      "store": "appstore",
      "force_refresh": true
    }
  ]
}
```

- `requests` (array, required): Array of scrape requests (max 50 per batch)

#### Response

```json
{
  "jobs": [
    {
      "job_id": 12345
    },
    {
      "job_id": 12346
    }
  ],
  "total": 2
}
```

#### Errors

- 403: Batch operations require Pro tier
- 400: Invalid request parameters

## Rate Limits

- Free tier: 100 requests per minute
- Pro tier: 1000 requests per minute
- Enterprise tier: 10000 requests per minute

## Quotas

- Free tier: 100 scrapes per month
- Pro tier: 1000 scrapes per month
- Enterprise tier: Unlimited scrapes

## Response Codes

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 429: Too Many Requests
- 500: Internal Server Error