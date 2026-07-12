# FundFlow — Crowdfunding Platform

FundFlow is a role-based crowdfunding platform built with Next.js, MongoDB, HeroUI, and Stripe Checkout.

## Setup checklist

1. Install dependencies: `npm install`
2. Create `.env.local` in this project with the required values below.
3. Install and run the companion payment server in `../crowdfunding-platform-server`.
4. Add that server's Stripe values to its `.env` file (see its `.env.example`).
5. Start the frontend: `npm run dev`

### Frontend `.env.local`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/crowdfunding-platform
JWT_SECRET=replace-with-a-long-random-secret
API_URL=http://localhost:5000
IMGBB_API_KEY=your_imgbb_api_key
```

### Payment server `.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crowdfunding-platform
JWT_SECRET=replace-with-the-same-long-random-secret
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

For local Stripe webhook forwarding, use:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the returned `whsec_...` value into the payment server `.env`, then restart the server.

## Roles

- Supporters explore campaigns, contribute platform credits, and purchase credit packages.
- Creators submit campaigns, review contributions, and request withdrawals.
- Admins approve campaigns, process withdrawals, manage users/campaigns, and resolve reports.

Role-based access is enforced by Next.js Proxy for dashboard navigation and by API-level authorization for admin actions.
