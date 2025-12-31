"""
Authentication middleware for the screenshot scraper API
"""
from typing import Optional
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from starlette.types import ASGIApp
import jwt
from src.database import SessionLocal
from src.models import User


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        # Skip auth for health check and public endpoints
        if request.url.path in ["/health", "/docs", "/redoc"]:
            response = await call_next(request)
            return response

        # Get API key from header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Authorization header missing or invalid")

        api_key = auth_header.replace("Bearer ", "")

        # Validate API key against database
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.api_key == api_key).first()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid API key")
            
            # Add user info to request state
            request.state.user = user
        finally:
            db.close()

        response = await call_next(request)
        return response