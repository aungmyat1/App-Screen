from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from starlette.status import HTTP_401_UNAUTHORIZED
import os

# In a real implementation, you would validate against database/API keys
# For now, we'll use a simple check
API_KEYS = os.environ.get("API_KEYS", "").split(",") if os.environ.get("API_KEYS") else []


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip authentication for health check and docs
        if request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        # Get API key from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return JSONResponse(
                status_code=HTTP_401_UNAUTHORIZED,
                content={"detail": "Authorization header missing"}
            )

        # Extract API key (assuming format "Bearer <api_key>" or just "<api_key>")
        api_key = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else auth_header

        # Validate API key
        if API_KEYS and api_key not in API_KEYS:
            return JSONResponse(
                status_code=HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid API key"}
            )

        response = await call_next(request)
        return response