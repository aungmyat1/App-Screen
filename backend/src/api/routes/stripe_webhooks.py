import stripe
import os
import json
from fastapi import APIRouter, Request, Header, HTTPException, status
from src.api.utils.webhook_signer import WebhookSigner

router = APIRouter(prefix="/webhooks/stripe", tags=["stripe-webhooks"])

# Get Stripe webhook secret from environment variables
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


@router.post("")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None)
):
    """Handle Stripe webhook events"""
    # Get raw body
    payload = await request.body()
    
    # Check if Stripe is configured
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe webhook secret is not configured"
        )
    
    # Verify webhook signature
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        # Invalid payload
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payload"
        )
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature"
        )
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Fulfill the purchase...
        await handle_checkout_session(session)
    
    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        # Update user's payment status...
        await handle_payment_succeeded(invoice)
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # Downgrade user's plan...
        await handle_subscription_cancelled(subscription)
    
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        # Update user's subscription...
        await handle_subscription_updated(subscription)
    
    return {"status": "success"}


async def handle_checkout_session(session):
    """Handle successful checkout session"""
    # In a real implementation, you would:
    # 1. Find the user associated with the session
    # 2. Update their subscription status in the database
    # 3. Grant them access to the paid features
    pass


async def handle_payment_succeeded(invoice):
    """Handle successful payment"""
    # In a real implementation, you would:
    # 1. Find the user associated with the invoice
    # 2. Extend their subscription period
    # 3. Send a receipt email
    pass


async def handle_subscription_cancelled(subscription):
    """Handle cancelled subscription"""
    # In a real implementation, you would:
    # 1. Find the user associated with the subscription
    # 2. Update their subscription status in the database
    # 3. Schedule account downgrade at period end
    pass


async def handle_subscription_updated(subscription):
    """Handle updated subscription"""
    # In a real implementation, you would:
    # 1. Find the user associated with the subscription
    # 2. Update their plan details in the database
    # 3. Adjust their quota/permissions accordingly
    pass