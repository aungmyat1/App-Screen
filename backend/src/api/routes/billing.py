import os
import stripe
from fastapi import APIRouter, Depends, HTTPException

# Initialize Stripe with the secret key from environment variables
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/api/v1/billing", tags=["billing"])

# Define pricing plans
PRICING_PLANS = {
    'free': {
        'price': 0,
        'quota': 10,
        'features': ['Basic scraping', 'Play Store only']
    },
    'pro': {
        'price_id': 'price_xxx',
        'price': 29,
        'quota': 500,
        'features': ['Both stores', 'Batch operations', 'API access']
    },
    'enterprise': {
        'price_id': 'price_yyy',
        'price': 299,
        'quota': 50000,
        'features': ['Everything', 'Priority support', 'Custom integration']
    }
}


# Placeholder for settings module (in a real app, this would be properly imported)
class Settings:
    STRIPE_SECRET_KEY = STRIPE_SECRET_KEY


settings = Settings()


# Set Stripe API key from settings
stripe.api_key = settings.STRIPE_SECRET_KEY


# Placeholder for get_current_user dependency (in a real app, this would be properly implemented)
def get_current_user():
    # This is a placeholder implementation
    class User:
        def __init__(self):
            self.id = 1
            self.email = "user@example.com"
    
    return User()


# Placeholder for update_user_subscription function (in a real app, this would be properly implemented)
async def update_user_subscription(user_id, subscription_id, plan):
    # This is a placeholder implementation
    pass


@router.post("/subscribe")
async def create_subscription(plan: str, user=Depends(get_current_user)):
    """Create Stripe subscription"""
    customer = stripe.Customer.create(
        email=user.email,
        metadata={'user_id': user.id}
    )
    
    subscription = stripe.Subscription.create(
        customer=customer.id,
        items=[{'price': PRICING_PLANS[plan]['price_id']}],
        trial_period_days=14
    )
    
    await update_user_subscription(user.id, subscription.id, plan)
    
    return {"subscription_id": subscription.id, "status": "active"}


@router.get("/plans")
async def get_plans():
    """Get available pricing plans"""
    # Return plans without sensitive information
    plans = {}
    for plan_name, plan_details in PRICING_PLANS.items():
        plans[plan_name] = {
            'price': plan_details['price'],
            'quota': plan_details['quota'],
            'features': plan_details['features']
        }
    return plans


@router.get("/subscription/{subscription_id}")
async def get_subscription(subscription_id: str, user=Depends(get_current_user)):
    """Get subscription details"""
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        return subscription
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/subscription/{subscription_id}")
async def cancel_subscription(subscription_id: str, user=Depends(get_current_user)):
    """Cancel subscription"""
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    try:
        # Cancel subscription at period end
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        
        # In a real implementation, you would update the user in your database
        # await update_user_subscription_status(user.id, "cancel_at_period_end")
        
        return {"subscription_id": subscription.id, "status": "cancel_at_period_end"}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))