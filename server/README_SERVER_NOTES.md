Server notes:
- API runs on port 4000 by default.
- Stripe: set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in server/.env
- To run seed: `npm run seed` inside /server (requires a running MongoDB)
- Webhook testing: you can use the Stripe CLI to forward events to /api/payments/stripe/webhook
