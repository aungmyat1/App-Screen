# Billing System Documentation

This document describes how to set up and use the billing system for the screenshot scraper application.

## Overview

The billing system integrates with Stripe to handle subscription payments and plan management. It supports multiple tiers with different quotas and features.

## Prerequisites

1. Stripe account
2. Stripe API keys (publishable and secret)
3. Webhook configuration in the Stripe dashboard

## Setup Instructions

### 1. Create Stripe Products and Prices

1. Log into your Stripe dashboard
2. Navigate to Products
3. Create products for each plan:
   - Pro Plan ($29/month)
   - Enterprise Plan ($299/month)
4. Note the Price IDs for each product

### 2. Configure Environment Variables

Add the following to your `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Configure Webhooks in Stripe Dashboard

1. In the Stripe dashboard, go to Developers > Webhooks
2. Add a new endpoint with the URL: `https://yourdomain.com/webhooks/stripe`
3. Select the following events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Note the webhook signing secret and add it to your environment variables

### 4. Update Pricing Plans

Update the pricing plans in `src/api/routes/billing.py` with your actual Stripe Price IDs:

```python
PRICING_PLANS = {
    'pro': {
        'price_id': 'price_your_pro_price_id',  # Replace with actual Stripe price ID
        'price': 29,
        'quota': 500,
        'features': ['Both stores', 'Batch operations', 'API access']
    },
    'enterprise': {
        'price_id': 'price_your_enterprise_price_id',  # Replace with actual Stripe price ID
        'price': 299,
        'quota': 50000,
        'features': ['Everything', 'Priority support', 'Custom integration']
    }
}
```

## API Endpoints

### Get Available Plans

```
GET /api/v1/billing/plans
```

Returns information about all available plans.

### Create Subscription

```
POST /api/v1/billing/subscribe
```

Creates a new subscription for a user.

Parameters:
- `plan` (string): The plan to subscribe to (pro, enterprise)

### Get Subscription Details

```
GET /api/v1/billing/subscription/{subscription_id}
```

Retrieves details about a specific subscription.

### Cancel Subscription

```
DELETE /api/v1/billing/subscription/{subscription_id}
```

Cancels a subscription at the end of the current billing period.

## Webhook Handling

The application listens for the following Stripe events:

1. `checkout.session.completed` - Triggered when a customer completes a payment
2. `invoice.payment_succeeded` - Triggered when a subscription payment is successful
3. `customer.subscription.deleted` - Triggered when a subscription is canceled
4. `customer.subscription.updated` - Triggered when a subscription is updated

Each event is handled appropriately to update user accounts and permissions.

## User Model Changes

The User model has been extended with two new fields:
- `stripe_customer_id`: Stores the Stripe Customer ID
- `stripe_subscription_id`: Stores the Stripe Subscription ID

A database migration (002_add_stripe_fields_to_users.py) is included to update the database schema.

## Security Considerations

1. All webhook requests are verified using the Stripe signature
2. Sensitive information like the Stripe secret key is stored in environment variables
3. Webhook secrets are used to verify the authenticity of incoming requests
4. HTTPS is enforced through security headers

## Testing

To test the billing system:

1. Use Stripe's test mode with test cards (e.g., 4242 4242 4242 4242)
2. Create test products and prices in the Stripe dashboard
3. Use the test webhook endpoint for local development

## Troubleshooting

### Webhook Verification Failures

Ensure that:
1. The `STRIPE_WEBHOOK_SECRET` environment variable is correctly set
2. The webhook endpoint URL is correctly configured in the Stripe dashboard
3. Your application is accessible from the public internet (for Stripe to reach it)

### Subscription Creation Failures

Ensure that:
1. The `STRIPE_SECRET_KEY` environment variable is correctly set
2. The Price IDs in `PRICING_PLANS` are correct
3. Your Stripe account is properly configured

## Future Improvements

1. Add support for metered billing based on actual usage
2. Implement proration for plan upgrades/downgrades
3. Add support for coupons and promotional codes
4. Implement account credit system for overages
5. Add email notifications for payment failures and subscription changes