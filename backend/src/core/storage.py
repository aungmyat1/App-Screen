import boto3
from botocore.config import Config
from datetime import datetime
import os

class S3Storage:
    def __init__(self):
        # Get credentials from environment variables or use defaults
        aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
        aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
        
        # Initialize S3 client
        self.s3_client = boto3.client(
            's3',
            config=Config(signature_version='s3v4'),
            region_name=os.getenv('AWS_REGION', 'us-east-1'),
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )
        self.bucket = os.getenv('S3_BUCKET', 'screenshot-scraper-prod')
        self.cdn_url = os.getenv('CDN_URL', 'https://cdn.yourapp.com')
    
    async def upload_screenshot(
        self,
        file_data: bytes,
        key: str,
        content_type: str = 'image/webp'
    ) -> str:
        """Upload screenshot to S3 with CDN"""
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=file_data,
            ContentType=content_type,
            CacheControl='max-age=31536000',  # 1 year
            Metadata={
                'uploaded_at': datetime.utcnow().isoformat()
            }
        )
        
        # Return CDN URL
        return f"{self.cdn_url}/{key}"
    
    async def generate_presigned_url(self, key: str, expires: int = 3600) -> str:
        """Generate temporary download URL"""
        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket, 'Key': key},
            ExpiresIn=expires
        )