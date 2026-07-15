# Crowdfunding Platform

Crowdfunding is a role-based crowdfunding platform built with Next.js, MongoDB, HeroUI, and Stripe Checkout.

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
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id.apps.googleusercontent.com
```

#### Google Sign-In setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create an **OAuth 2.0 Client ID** (application type: **Web application**).
3. Add authorized JavaScript origins: `http://localhost:3000` (and your live site URL).
4. Copy the Client ID into `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and restart `npm run dev`.

After login/register, the app stores the JWT as `access-token` in **localStorage** and also sets an httpOnly cookie so private routes stay logged in after reload.

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
