# S3 and CloudFront Setup Guide

This guide explains how to set up Amazon S3 with versioning and CloudFront CDN for the screenshot scraper application.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Domain name for CDN (optional but recommended)

## Step 1: Create S3 Bucket with Versioning

1. Sign in to the AWS Management Console
2. Navigate to the S3 service
3. Click "Create bucket"
4. Enter a unique bucket name (e.g., `screenshot-scraper-prod`)
5. Select your preferred region
6. Uncheck "Block all public access" (we'll configure proper permissions later)
7. Check "Enable bucket versioning"
8. Click "Create bucket"

### Configure Bucket Policy

After creating the bucket, configure the bucket policy for public read access to screenshots:

1. Go to your bucket's "Permissions" tab
2. Edit the "Bucket policy" with the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::screenshot-scraper-prod/*"
        }
    ]
}
```

Replace `screenshot-scraper-prod` with your actual bucket name.

### CORS Configuration

Add CORS configuration to allow CDN access:

1. Go to your bucket's "Permissions" tab
2. Edit "Cross-origin resource sharing (CORS)" with the following configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

## Step 2: Configure CloudFront CDN

1. Sign in to the AWS Management Console
2. Navigate to the CloudFront service
3. Click "Create Distribution"
4. In the "Origin Domain" field, select your S3 bucket
5. Leave the default settings for the rest of the options
6. Under "Default cache behavior":
   - Set "Viewer protocol policy" to "Redirect HTTP to HTTPS"
   - Set "Allowed HTTP methods" to "GET, HEAD"
   - Set "Cache key and origin requests" to "Use legacy cache settings"
7. In the "Distribution settings" section:
   - Set "Price class" to your preference (e.g., "Use all edge locations")
   - Set "Alternate domain name (CNAME)" if you have a custom domain
   - Select or create an SSL certificate if using a custom domain
8. Click "Create Distribution"

### CloudFront Configuration Details

Once the distribution is created, note the domain name assigned by CloudFront. This will be used as your CDN URL.

## Step 3: Configure Application Environment Variables

Update your environment variables in the `.env` file:

```bash
# S3 Configuration
S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region

# CDN Configuration
CDN_URL=https://your-cloudfront-domain.cloudfront.net
```

## Step 4: Image Optimization Features

The application automatically optimizes images with the following features:

1. **Multiple Sizes**: Generates thumbnail, medium, and large versions of screenshots
2. **WebP Format**: Automatically converts images to WebP for reduced file sizes
3. **Quality Setting**: Uses 85% quality setting for optimal balance between size and quality
4. **High-Quality Resampling**: Uses LANCZOS algorithm for the best resize quality

## Step 5: Watermarking (Optional)

To add watermarks to your screenshots:

1. Set the `WATERMARK_TEXT` environment variable in your `.env` file:
   ```bash
   WATERMARK_TEXT=Your Custom Watermark
   ```

2. The watermark will appear in the bottom-right corner of all processed images
3. Watermark color is white with 50% opacity
4. To disable watermarking, remove the `WATERMARK_TEXT` variable or leave it empty

## Testing the Setup

After completing the setup:

1. Verify the S3 bucket is created with versioning enabled
2. Confirm the CloudFront distribution is deployed and active
3. Test image uploads through the application
4. Verify images are accessible via the CDN URL

## Security Considerations

1. **Access Control**: The bucket policy allows public read access only to objects, not to bucket listings
2. **HTTPS**: CloudFront enforces HTTPS for secure delivery
3. **Credentials**: Ensure AWS credentials have minimal required permissions
4. **Presigned URLs**: For private content, use presigned URLs instead of public access

## Cost Considerations

1. **S3 Storage**: Pay for storage of screenshots and versioned files
2. **CloudFront**: Pay for data transfer and requests
3. **Requests**: Optimize caching headers to reduce request costs
4. **Versioning**: Keep in mind that versioning increases storage costs as all versions are retained

Monitor your AWS billing dashboard regularly to track costs associated with the service.