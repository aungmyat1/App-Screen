from fastapi import APIRouter, Request, Header, HTTPException, status
from src.api.utils.webhook_signer import WebhookSigner
import json

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/screenshot-completed")
async def screenshot_completed_webhook(
    request: Request,
    x_signature: str = Header(None),
    x_signature_timestamp: str = Header(None)
):
    """
    Webhook endpoint for screenshot completion notifications
    """
    # Get raw body
    body = await request.body()
    body_str = body.decode("utf-8")
    
    # Verify signature if provided
    if x_signature and x_signature_timestamp:
        signer = WebhookSigner()
        if not signer.verify_signature(body_str, x_signature, x_signature_timestamp):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid webhook signature"
            )
    
    # Parse JSON payload
    try:
        payload = json.loads(body_str)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )
    
    # Process webhook
    # In a real implementation, you would:
    # 1. Validate the payload structure
    # 2. Update database records
    # 3. Send notifications
    # 4. Trigger other workflows
    
    return {"status": "ok", "message": "Webhook received successfully"}


@router.post("/send-test-webhook")
async def send_test_webhook():
    """
    Endpoint to send a test webhook (for demonstration purposes)
    """
    # In a real implementation, this would actually send an HTTP request
    # to a configured webhook URL with a signed payload
    
    signer = WebhookSigner()
    payload = {
        "event": "test",
        "timestamp": "2023-01-01T00:00:00Z",
        "data": {
            "message": "This is a test webhook"
        }
    }
    
    headers = signer.create_signed_headers(payload)
    
    return {
        "status": "ok", 
        "message": "Test webhook prepared",
        "payload": payload,
        "headers": headers
    }