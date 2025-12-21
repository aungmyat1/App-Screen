import jwt
import hashlib
import secrets
from typing import Dict, Optional
from datetime import datetime, timedelta


class AuthManager:
    """Handle authentication and authorization"""
    
    def __init__(self, secret_key: str = None):
        """
        Initialize the auth manager
        
        Args:
            secret_key (str): Secret key for JWT signing. 
                             If not provided, a random one will be generated.
        """
        self.secret_key = secret_key or secrets.token_urlsafe(32)
        self.users = {}  # In production, this would be a database
        self.tokens = {}  # In production, this would be stored in Redis or similar
    
    def authenticate_user(self, token: str) -> Optional[Dict]:
        """
        Authenticate user with token
        
        Args:
            token (str): Authentication token
            
        Returns:
            dict: User information if authenticated, None otherwise
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            user_id = payload['user_id']
            
            # Check if token is still valid and not revoked
            if token in self.tokens and self.tokens[token] == user_id:
                return self.users.get(user_id)
            return None
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def authorize_user(self, user_id: str, action: str, resource: str) -> bool:
        """
        Authorize user for specific action on resource
        
        Args:
            user_id (str): User identifier
            action (str): Action to perform (e.g., 'read', 'write', 'delete')
            resource (str): Resource to access
            
        Returns:
            bool: True if authorized, False otherwise
        """
        # Simple RBAC implementation
        user = self.users.get(user_id)
        if not user:
            return False
            
        role = user.get('role', 'guest')
        
        # Define permissions
        permissions = {
            'admin': {'read', 'write', 'delete'},
            'user': {'read', 'write'},
            'guest': {'read'}
        }
        
        return action in permissions.get(role, set())
    
    def generate_token(self, user_id: str, expires_in: int = 3600) -> str:
        """
        Generate authentication token for user
        
        Args:
            user_id (str): User identifier
            expires_in (int): Token expiration time in seconds
            
        Returns:
            str: Generated JWT token
        """
        expire = datetime.utcnow() + timedelta(seconds=expires_in)
        payload = {
            'user_id': user_id,
            'exp': expire,
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        
        # Store token
        self.tokens[token] = user_id
        
        return token
    
    def revoke_token(self, token: str) -> bool:
        """
        Revoke authentication token
        
        Args:
            token (str): Token to revoke
            
        Returns:
            bool: True if token was revoked, False if not found
        """
        if token in self.tokens:
            del self.tokens[token]
            return True
        return False
    
    def register_user(self, username: str, password: str, role: str = 'user') -> str:
        """
        Register a new user
        
        Args:
            username (str): Username
            password (str): Plain text password
            role (str): User role
            
        Returns:
            str: User ID
        """
        user_id = hashlib.sha256(username.encode()).hexdigest()[:16]
        
        # Hash password (in production, use bcrypt or similar)
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        self.users[user_id] = {
            'username': username,
            'password_hash': hashed_password,
            'role': role,
            'created_at': datetime.utcnow()
        }
        
        return user_id
    
    def login_user(self, username: str, password: str) -> Optional[str]:
        """
        Login user and return token
        
        Args:
            username (str): Username
            password (str): Plain text password
            
        Returns:
            str: Authentication token or None if login failed
        """
        # Hash the provided password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Find user
        for user_id, user_data in self.users.items():
            if (user_data['username'] == username and 
                user_data['password_hash'] == hashed_password):
                return self.generate_token(user_id)
                
        return None