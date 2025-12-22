from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os


# Tier-based rate limits
TIER_LIMITS = {
    "free": "100/hour",
    "basic": "500/hour",
    "premium": "2000/hour",
    "enterprise": "10000/hour"
}

# Default tier if none specified
DEFAULT_TIER = "free"

# Initialize the limiter
limiter = Limiter(key_func=get_remote_address)


def get_tier_from_request(request: Request) -> str:
    """
    Extract user tier from request.
    In a real implementation, this would check the user's account tier.
    For now, we'll use a simple header or default to free tier.
    """
    # Check for tier in header (would normally come from user authentication)
    tier = request.headers.get("X-User-Tier", DEFAULT_TIER).lower()
    
    # Validate tier
    if tier not in TIER_LIMITS:
        tier = DEFAULT_TIER
    
    return tier


def get_rate_limit_for_tier(tier: str) -> str:
    """Get rate limit string for a given tier"""
    return TIER_LIMITS.get(tier, TIER_LIMITS[DEFAULT_TIER])


class RateLimitMiddleware:
    def __init__(self, app):
        self.app = app
        # Handle rate limit exceeded
        app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    async def __call__(self, scope, receive, send):
        # Pass through to the next middleware/application
        await self.app(scope, receive, send)