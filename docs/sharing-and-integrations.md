# Sharing and Integrations

This document describes the sharing and integration features implemented for the AppScreens application.

## Overview

The sharing and integration system provides users with tools to share screenshots with others, embed them on websites, integrate with popular communication platforms like Slack and Discord, and use a developer-friendly API with webhook support.

## Features Implemented

### 1. Shareable Links with Permissions

The shareable links feature allows users to generate URLs that grant access to their screenshots with customizable permissions:

- **View Only**: Recipients can only view the screenshot
- **View & Comment**: Recipients can view and add comments
- **Edit**: Recipients can view, comment, and make annotations

Key aspects:
- Token-based access control
- Expiration options for temporary access
- Permission levels to control access
- Easy-to-use interface for generating and managing links

### 2. Embed Codes for Websites

Users can embed screenshots directly into their websites or documentation:

- Generates iframe embed codes
- Customizable dimensions
- Maintains access controls from the original share link
- Works with all major website platforms and CMS systems

### 3. Slack/Discord Integration

Integration with popular team communication platforms:

- Webhook-based notifications
- Automatic screenshot delivery
- Customizable message formatting
- Easy setup through UI

### 4. API for Developers

A comprehensive REST API for programmatic access:

- Authentication with API keys
- Endpoints for creating and managing screenshot jobs
- Retrieving screenshot results
- Listing jobs with filtering and pagination
- Detailed API documentation with code examples

### 5. Webhook System

Real-time notifications for important events:

- Configurable event triggers
- Secure webhook delivery with signature verification
- Delivery status tracking
- Retry mechanism for failed deliveries

## Implementation Details

### Frontend Components

1. **ShareDialog**:
   - Modal interface for generating shareable links
   - Permission selection dropdown
   - Copy-to-clipboard functionality for links and embed codes
   - Visual feedback for user actions

2. **IntegrationPanel**:
   - UI for configuring Slack and Discord webhooks
   - Test functionality for verifying integration setup
   - Save mechanism for storing webhook URLs

3. **WebhookSettingsPage**:
   - Interface for managing webhook configurations
   - Event selection with checkboxes
   - Webhook activation/deactivation
   - Test and delete functionality
   - Status tracking for deliveries

4. **ApiDocumentationPage**:
   - Comprehensive API documentation
   - Tabbed interface for different sections
   - Code examples in multiple languages
   - Detailed endpoint specifications

5. **SharedScreenshotPage**:
   - Publicly accessible page for shared screenshots
   - Token validation and permission checking
   - Responsive design for various devices
   - Commenting interface for collaborative feedback

### API Routes

1. **POST /api/screenshots/[id]/share**:
   - Creates a new shareable link for a screenshot
   - Accepts permission level and expiration settings
   - Returns the shareable URL and token

2. **GET /api/screenshots/[id]/share**:
   - Retrieves existing share links for a screenshot
   - Returns list of active and expired links

### Data Models

#### ShareToken
```typescript
interface ShareToken {
  id: string;
  screenshotId: string;
  token: string;
  permission: "view" | "comment" | "edit";
  expiresAt: Date | null;
  createdAt: Date;
}
```

#### Webhook
```typescript
interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  lastDelivery?: Date;
  lastDeliveryStatus?: "success" | "failed";
}
```

## Technical Considerations

### Security

1. **Token-based Access**:
   - Cryptographically secure token generation
   - Expiration enforcement
   - Permission validation on every request

2. **Webhook Security**:
   - Signature verification for incoming webhook requests
   - HTTPS requirement for webhook URLs
   - Secret-based authentication

3. **API Security**:
   - API key authentication
   - Rate limiting to prevent abuse
   - Input validation and sanitization

### Performance

1. **Efficient Token Validation**:
   - Database indexing for fast token lookups
   - Caching for frequently accessed tokens
   - Minimal overhead for permission checks

2. **Webhook Delivery**:
   - Asynchronous delivery to avoid blocking operations
   - Retry mechanism with exponential backoff
   - Delivery status tracking for monitoring

### User Experience

1. **Intuitive Sharing Interface**:
   - Simple permission selection
   - Clear expiration options
   - One-click copy functionality

2. **Comprehensive Documentation**:
   - Tabbed interface for easy navigation
   - Code examples in multiple languages
   - Clear endpoint specifications

3. **Real-time Feedback**:
   - Loading states for async operations
   - Success/error notifications
   - Immediate visual feedback

## Integration Points

### Authentication System
- Integration with existing NextAuth.js authentication
- Permission-based access control
- Session validation for share link creation

### Screenshot Management
- Connection to existing screenshot storage
- Metadata retrieval for shared screenshots
- Access control enforcement

### Notification System
- Integration with webhook delivery mechanism
- Event triggering for screenshot job completion
- Error handling and retry logic

## Future Improvements

1. **Enhanced Sharing Features**:
   - Password protection for share links
   - Download restrictions
   - Custom branding for shared pages

2. **Additional Integrations**:
   - Microsoft Teams integration
   - Email notifications
   - Jira integration for issue tracking

3. **Advanced Webhook Features**:
   - Custom payload formatting
   - Filtering options for events
   - Batch delivery for high-volume scenarios

4. **API Enhancements**:
   - GraphQL API in addition to REST
   - SDKs for popular programming languages
   - API rate plan management

5. **Embed Improvements**:
   - Interactive embeds with annotation capabilities
   - Responsive embed sizing
   - Custom styling options

## Testing Considerations

1. **Share Link Functionality**:
   - Token generation and validation
   - Permission enforcement
   - Expiration handling

2. **Integration Testing**:
   - Webhook delivery to mock endpoints
   - Signature verification
   - Error handling and retries

3. **API Testing**:
   - Endpoint validation
   - Authentication testing
   - Rate limiting enforcement

4. **Security Testing**:
   - Token brute force protection
   - Injection attack prevention
   - Access control validation

This sharing and integration system provides a comprehensive set of tools for users to share their screenshots, integrate with their workflows, and build custom solutions on top of the AppScreens platform.