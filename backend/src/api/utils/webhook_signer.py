import hmac
import hashlib
import json
import time
import os
from typing import Dict, Any


class WebhookSigner:
    """
    Utility class for signing webhook requests
    """
    
    def __init__(self, secret: str = None):
        """
        Initialize the webhook signer
        
        Args:
            secret: Secret key for signing. If not provided, will be read from WEBHOOK_SECRET env var
        """
        self.secret = secret or os.getenv("WEBHOOK_SECRET", "")
    
    def sign_request(self, payload: Dict[Any, Any], timestamp: int = None) -> str:
        """
        Generate signature for webhook payload
        
        Args:
            payload: The webhook payload data
            timestamp: Unix timestamp. If not provided, current time will be used
            
        Returns:
            Signature string
        """
        if not self.secret:
            raise ValueError("Webhook secret is required for signing")
        
        if timestamp is None:
            timestamp = int(time.time())
        
        # Create the signature payload
        signature_payload = f"{timestamp}.{json.dumps(payload, separators=(',', ':'))}".encode('utf-8')
        
        # Generate HMAC signature
        signature = hmac.new(
            self.secret.encode('utf-8'),
            signature_payload,
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    def verify_signature(self, payload: str, signature: str, timestamp: str) -> bool:
        """
        Verify webhook signature
        
        Args:
            payload: Raw payload string
            signature: Signature to verify
            timestamp: Timestamp string
            
        Returns:
            True if signature is valid, False otherwise
        """
        if not self.secret:
            return False
        
        try:
            # Recreate the signature
            timestamp_int = int(timestamp)
            signature_payload = f"{timestamp_int}.{payload}".encode('utf-8')
            
            expected_signature = hmac.new(
                self.secret.encode('utf-8'),
                signature_payload,
                hashlib.sha256
            ).hexdigest()
            
            # Use hmac.compare_digest for timing attack resistance
            return hmac.compare_digest(expected_signature, signature)
        except (ValueError, TypeError):
            return False
    
    def create_signed_headers(self, payload: Dict[Any, Any]) -> Dict[str, str]:
        """
        Create headers for a signed webhook request
        
        Args:
            payload: The webhook payload data
            
        Returns:
            Dictionary of headers including signature headers
        """
        timestamp = int(time.time())
        signature = self.sign_request(payload, timestamp)
        
        return {
            "X-Signature-Timestamp": str(timestamp),
            "X-Signature": signature,
            "Content-Type": "application/json"
        }