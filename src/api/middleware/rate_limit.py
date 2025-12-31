"""
Rate limiting middleware for the screenshot scraper API
"""
import time
from typing import Dict
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from starlette.types import ASGIApp


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp, max_requests: int = 100, window_size: int = 3600):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_size = window_size
        self.requests: Dict[str, list] = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()

        # Initialize client record if not exists
        if client_ip not in self.requests:
            self.requests[client_ip] = []

        # Remove requests outside the window
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if current_time - req_time < self.window_size
        ]

        # Check if limit exceeded
        if len(self.requests[client_ip]) >= self.max_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")

        # Add current request
        self.requests[client_ip].append(current_time)

        response = await call_next(request)
        return response