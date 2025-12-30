"""
Authentication module for the screenshot SaaS application.
"""
from datetime import datetime, timedelta
from typing import Optional
import jwt
import secrets
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import os


# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme for API
security = HTTPBearer()


class Token(BaseModel):
    """
    Token response model.
    """
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """
    Token data model.
    """
    username: Optional[str] = None


class User(BaseModel):
    """
    User model.
    """
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    """
    User in database model.
    """
    hashed_password: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password
        
    Returns:
        True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash for a password.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def get_user(username: str) -> Optional[UserInDB]:
    """
    Get a user from the database (mock implementation).
    
    Args:
        username: Username to search for
        
    Returns:
        User object if found, None otherwise
    """
    # This is a mock implementation - in a real app, this would query a database
    if username == "testuser":
        return UserInDB(
            username="testuser",
            email="test@example.com",
            full_name="Test User",
            hashed_password=get_password_hash("testpassword")
        )
    return None


def authenticate_user(username: str, password: str) -> Optional[User]:
    """
    Authenticate a user.
    
    Args:
        username: Username
        password: Plain text password
        
    Returns:
        User object if authentication successful, None otherwise
    """
    user = get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create an access token.
    
    Args:
        data: Data to encode in the token
        expires_delta: Token expiration time delta
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Get the current authenticated user from the token.
    
    Args:
        credentials: HTTP authorization credentials
        
    Returns:
        User object if authenticated
        
    Raises:
        HTTPException: If authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Get the current active user.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if active
        
    Raises:
        HTTPException: If user is inactive
    """
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user