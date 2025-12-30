"""
Storage module for the screenshot SaaS application.
"""
import os
import boto3
from typing import Optional, List, Dict, Any
from abc import ABC, abstractmethod
from botocore.exceptions import ClientError
import logging

logger = logging.getLogger(__name__)


class StorageBackend(ABC):
    """
    Abstract base class for storage backends.
    """
    
    @abstractmethod
    def save_file(self, file_path: str, content: bytes) -> bool:
        """
        Save a file to storage.
        
        Args:
            file_path: Path where the file should be saved
            content: File content as bytes
            
        Returns:
            True if successful, False otherwise
        """
        pass
    
    @abstractmethod
    def get_file(self, file_path: str) -> Optional[bytes]:
        """
        Get a file from storage.
        
        Args:
            file_path: Path of the file to retrieve
            
        Returns:
            File content as bytes or None if not found
        """
        pass
    
    @abstractmethod
    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            file_path: Path of the file to delete
            
        Returns:
            True if successful, False otherwise
        """
        pass
    
    @abstractmethod
    def file_exists(self, file_path: str) -> bool:
        """
        Check if a file exists in storage.
        
        Args:
            file_path: Path of the file to check
            
        Returns:
            True if file exists, False otherwise
        """
        pass


class LocalStorage(StorageBackend):
    """
    Local file system storage backend.
    """
    
    def __init__(self, base_path: str = "./storage"):
        """
        Initialize local storage.
        
        Args:
            base_path: Base directory for storing files
        """
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)
    
    def save_file(self, file_path: str, content: bytes) -> bool:
        try:
            full_path = os.path.join(self.base_path, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'wb') as f:
                f.write(content)
            
            return True
        except Exception as e:
            logger.error(f"Error saving file {file_path} to local storage: {e}")
            return False
    
    def get_file(self, file_path: str) -> Optional[bytes]:
        try:
            full_path = os.path.join(self.base_path, file_path)
            if not os.path.exists(full_path):
                return None
            
            with open(full_path, 'rb') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error getting file {file_path} from local storage: {e}")
            return None
    
    def delete_file(self, file_path: str) -> bool:
        try:
            full_path = os.path.join(self.base_path, file_path)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file {file_path} from local storage: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        full_path = os.path.join(self.base_path, file_path)
        return os.path.exists(full_path)


class S3Storage(StorageBackend):
    """
    AWS S3 storage backend.
    """
    
    def __init__(self, bucket_name: str, aws_access_key_id: str, aws_secret_access_key: str, region_name: str = "us-east-1"):
        """
        Initialize S3 storage.
        
        Args:
            bucket_name: Name of the S3 bucket
            aws_access_key_id: AWS access key ID
            aws_secret_access_key: AWS secret access key
            region_name: AWS region name
        """
        self.bucket_name = bucket_name
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )
    
    def save_file(self, file_path: str, content: bytes) -> bool:
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_path,
                Body=content
            )
            return True
        except ClientError as e:
            logger.error(f"Error saving file {file_path} to S3: {e}")
            return False
    
    def get_file(self, file_path: str) -> Optional[bytes]:
        try:
            response = self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=file_path
            )
            return response['Body'].read()
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                logger.info(f"File {file_path} not found in S3")
                return None
            logger.error(f"Error getting file {file_path} from S3: {e}")
            return None
    
    def delete_file(self, file_path: str) -> bool:
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_path
            )
            return True
        except ClientError as e:
            logger.error(f"Error deleting file {file_path} from S3: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=file_path)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            logger.error(f"Error checking existence of file {file_path} in S3: {e}")
            return False


class StorageManager:
    """
    Manager for storage operations with multiple backends.
    """
    
    def __init__(self, storage_backend: StorageBackend):
        """
        Initialize storage manager with a specific backend.
        
        Args:
            storage_backend: Instance of a StorageBackend implementation
        """
        self.storage_backend = storage_backend
    
    def save_screenshot(self, app_id: str, screenshot_data: bytes, platform: str = "unknown") -> bool:
        """
        Save a screenshot for an app.
        
        Args:
            app_id: ID of the app
            screenshot_data: Screenshot content as bytes
            platform: Platform name (e.g., 'appstore', 'playstore')
            
        Returns:
            True if successful, False otherwise
        """
        file_path = f"screenshots/{platform}/{app_id}/{len(os.listdir(os.path.join('./storage', 'screenshots', platform, app_id)) if os.path.exists(os.path.join('./storage', 'screenshots', platform, app_id)) else []) + 1}.png"
        return self.storage_backend.save_file(file_path, screenshot_data)
    
    def save_app_metadata(self, app_id: str, metadata: Dict[str, Any], platform: str = "unknown") -> bool:
        """
        Save app metadata.
        
        Args:
            app_id: ID of the app
            metadata: App metadata as a dictionary
            platform: Platform name (e.g., 'appstore', 'playstore')
            
        Returns:
            True if successful, False otherwise
        """
        import json
        file_path = f"metadata/{platform}/{app_id}.json"
        return self.storage_backend.save_file(file_path, json.dumps(metadata).encode('utf-8'))
    
    def get_screenshots_for_app(self, app_id: str, platform: str = "unknown") -> List[bytes]:
        """
        Get all screenshots for an app.
        
        Args:
            app_id: ID of the app
            platform: Platform name (e.g., 'appstore', 'playstore')
            
        Returns:
            List of screenshot content as bytes
        """
        # This is a simplified implementation
        # In a real system, we would need to list all files in a directory
        screenshots = []
        # Implementation would depend on the storage backend
        # For now, return an empty list
        return screenshots