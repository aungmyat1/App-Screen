import os
import json
from typing import List, Dict, Optional
from pathlib import Path


class StorageManager:
    """Manage storage for downloaded screenshots and metadata"""
    
    def __init__(self, storage_path: str = "./storage"):
        """
        Initialize the storage manager
        
        Args:
            storage_path (str): Base path for storing files
        """
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
    
    def save_screenshot(self, app_id: str, screenshot_data: bytes, filename: str) -> str:
        """
        Save screenshot data to storage
        
        Args:
            app_id (str): Application identifier
            screenshot_data (bytes): Screenshot binary data
            filename (str): Filename for the screenshot
            
        Returns:
            str: Full path to saved file
        """
        app_dir = self.storage_path / app_id
        app_dir.mkdir(exist_ok=True)
        
        file_path = app_dir / filename
        with open(file_path, 'wb') as f:
            f.write(screenshot_data)
            
        return str(file_path)
    
    def retrieve_screenshot(self, app_id: str, filename: str) -> Optional[bytes]:
        """
        Retrieve screenshot from storage
        
        Args:
            app_id (str): Application identifier
            filename (str): Filename of the screenshot
            
        Returns:
            bytes: Screenshot data or None if not found
        """
        file_path = self.storage_path / app_id / filename
        if not file_path.exists():
            return None
            
        with open(file_path, 'rb') as f:
            return f.read()
    
    def delete_screenshot(self, app_id: str, filename: str) -> bool:
        """
        Delete screenshot from storage
        
        Args:
            app_id (str): Application identifier
            filename (str): Filename of the screenshot
            
        Returns:
            bool: True if file was deleted, False if not found
        """
        file_path = self.storage_path / app_id / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False
    
    def list_screenshots(self, app_id: str) -> List[str]:
        """
        List all screenshots for an app
        
        Args:
            app_id (str): Application identifier
            
        Returns:
            list: List of screenshot filenames
        """
        app_dir = self.storage_path / app_id
        if not app_dir.exists():
            return []
            
        return [f.name for f in app_dir.iterdir() if f.is_file()]
    
    def save_metadata(self, app_id: str, metadata: Dict) -> str:
        """
        Save app metadata to storage
        
        Args:
            app_id (str): Application identifier
            metadata (dict): Metadata to save
            
        Returns:
            str: Full path to saved metadata file
        """
        app_dir = self.storage_path / app_id
        app_dir.mkdir(exist_ok=True)
        
        metadata_path = app_dir / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
            
        return str(metadata_path)
    
    def load_metadata(self, app_id: str) -> Optional[Dict]:
        """
        Load app metadata from storage
        
        Args:
            app_id (str): Application identifier
            
        Returns:
            dict: Metadata or None if not found
        """
        metadata_path = self.storage_path / app_id / "metadata.json"
        if not metadata_path.exists():
            return None
            
        with open(metadata_path, 'r') as f:
            return json.load(f)