from fastapi import APIRouter, Response
from src.services.monitoring_service import generate_metrics

router = APIRouter(prefix="/metrics", tags=["monitoring"])


@router.get("")
async def metrics():
    """
    Prometheus metrics endpoint
    """
    content, content_type = generate_metrics()
    return Response(content=content, media_type=content_type)