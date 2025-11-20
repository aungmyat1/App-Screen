# File Upload and Organization System

This document describes the file upload and organization system implemented for the AppScreens application.

## Overview

The file upload system provides the following features:

1. Drag and drop file upload with progress tracking
2. AWS S3 integration with signed URLs
3. Image compression and optimization
4. Thumbnail generation
5. File organization with folders and tags

## Implementation Details

### Drag and Drop Upload Component

The drag and drop upload component (`frontend/components/file-upload.tsx`) provides:

- Visual drag and drop zone with file type validation
- File previews before upload
- Upload progress tracking for each file
- Ability to cancel ongoing uploads
- Sequential uploading of multiple files

Key features:
- Uses `react-dropzone` for drag and drop functionality
- Supports images up to 10MB in size
- Provides visual feedback during upload process
- Allows removal of files before upload

### AWS S3 Integration

AWS S3 integration is implemented with signed URLs:

- Backend API endpoint generates signed URLs for direct S3 uploads
- Frontend uses XMLHttpRequest for upload progress tracking
- Files are stored in user-specific folders in S3
- Security through temporary signed URLs that expire after 1 minute

The signing API (`frontend/pages/api/upload/sign.ts`):
- Authenticates users via NextAuth.js sessions
- Generates unique S3 keys with user ID prefix
- Creates presigned POST URLs with appropriate constraints
- Limits file sizes to 10MB

### Image Processing

Image processing features are implemented in `frontend/lib/image-optimizer.ts`:

1. Image Compression:
   - Resizes images to maximum 1920x1080 dimensions
   - Compresses images with configurable quality (default 80%)
   - Supports JPEG, PNG, and WebP output formats

2. Thumbnail Generation:
   - Creates 300x200 thumbnails
   - Maintains aspect ratio with cover fit
   - Outputs JPEG format with configurable quality

Both functions use the Canvas API for client-side processing, which:
- Reduces bandwidth usage
- Improves upload speeds
- Provides consistent image formats

### File Organization

The file organization system (`frontend/components/file-organizer.tsx`) provides:

1. Folder Management:
   - Create and manage folders
   - Move files between folders
   - View files by folder

2. Tagging System:
   - Create custom tags with colors
   - Assign multiple tags to files
   - Filter files by tags

3. File Display:
   - Grid view of files with metadata
   - File actions via dropdown menu
   - Tag management per file

Data models:
- Folders: id, name, parentId (for hierarchical structure)
- Tags: id, name, color
- Files: id, name, size, type, folderId, tags[], uploadedAt

## Security Considerations

1. User Isolation:
   - Files are stored in user-specific S3 prefixes
   - Signed URLs are generated per-user and per-file

2. File Validation:
   - Client-side file type and size validation
   - Server-side validation of signed URL requests
   - S3 upload constraints enforced via presigned URLs

3. Access Control:
   - Only authenticated users can generate signed URLs
   - Signed URLs expire after 1 minute
   - File access controlled through application logic

## Performance Optimizations

1. Client-side Processing:
   - Image compression reduces upload bandwidth
   - Thumbnail generation avoids server processing

2. Progressive Uploads:
   - Files uploaded sequentially
   - Progress tracking provides user feedback
   - Upload cancellation prevents wasted bandwidth

3. Efficient Rendering:
   - Virtualized lists for large file collections
   - Memoization of expensive operations
   - Lazy loading of images

## Future Improvements

1. Enhanced Organization:
   - Nested folder support
   - Tag color customization
   - Advanced filtering and search

2. Improved Upload Experience:
   - Parallel uploads with concurrency limits
   - Pause/resume functionality
   - Batch operations

3. Additional Processing:
   - Server-side image optimization
   - Format conversion (e.g., PNG to WebP)
   - EXIF data extraction

4. Storage Management:
   - Storage quota tracking
   - File versioning
   - Automated cleanup of old files