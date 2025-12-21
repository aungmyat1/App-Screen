from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from starlette.status import HTTP_429_TOO_MANY_REQUESTS
import time
from typing import Dict

# Simple in-memory store for rate limiting
# In production, you'd use Redis for distributed rate limiting
rate_limit_store: Dict[str, Dict[str, int]] = {}


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Simple rate limiting: 100 requests per minute per IP
        client_ip = request.client.host if request.client else "unknown"
        current_time = int(time.time())
        window_start = current_time - 60  # 1 minute window

        # Clean up old entries
        if client_ip in rate_limit_store:
            rate_limit_store[client_ip] = {
                timestamp: count
                for timestamp, count in rate_limit_store[client_ip].items()
                if timestamp > window_start
            }
        else:
            rate_limit_store[client_ip] = {}

        # Count request
        if current_time in rate_limit_store[client_ip]:
            rate_limit_store[client_ip][current_time] += 1
        else:
            rate_limit_store[client_ip][current_time] = 1

        # Calculate total requests in window
        total_requests = sum(rate_limit_store[client_ip].values())

        # Check if limit exceeded (100 requests per minute)
        if total_requests > 100:
            return JSONResponse(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded"}
            )

        response = await call_next(request)
        return response