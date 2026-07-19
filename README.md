# FundFlow — Crowdfunding Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v3-orange?style=for-the-badge)](https://heroui.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com/)

**FundFlow** is a modern, role-based crowdfunding platform built to connect creators with supportive patrons. Sporting a curated brutalist design, it features transparent credit-based backing, Stripe integrations, real-time feedback, and full administrative moderation controls.

---

## 📝 Project Submission Details

* **Website Name:** FundFlow
* **Admin Username:** `admin@demo.com`
* **Admin Password:** `password123`
* **Front-end Live Site Link:** [https://crowdfunding-platform-pha.netlify.app/](https://crowdfunding-platform-pha.netlify.app/)
* **Client-Side GitHub Repository:** [https://github.com/kazolhabib/Crowdfunding-Platform](https://github.com/kazolhabib/Crowdfunding-Platform)
* **Server-Side GitHub Repository:** [https://github.com/kazolhabib/Crowdfunding-Platform-Server](https://github.com/kazolhabib/Crowdfunding-Platform-Server)

---

## ✨ Key Features (12 Core Pillars)

1. **Role-Based Dashboards:** Distinct dashboards and operations for **Supporters**, **Creators**, and **Administrators** to secure role-based interactions.
2. **Curated Brutalist Aesthetics:** Sleek, bold layout built with curated typography, custom HSL color systems, card shadows, and lively animations.
3. **Stripe Checkout & Payouts:** Fully integrated Stripe checkout session flow with secure credit packages and client-side verification fallbacks.
4. **Stats Counter Animations:** High-performance, scroll-triggered counter animations using custom cubic ease-out curves for key platform stats.
5. **Dynamic Loading Spinner:** Clean loading indicators implemented across the application (homepage, dashboard, search filters) to optimize UX.
6. **Mobile Responsive Contributions:** Custom mobile card view layout replacing wide horizontal tables to prevent unwanted scrollbars on small screens.
7. **Floating Notification System:** Pop-up notification center delivering real-time status updates (contributions, campaign states, and withdrawals).
8. **Campaign Explore & Details:** Advanced categorization, search filtering, progress tracking, and detail viewing for active community projects.
9. **Dynamic Financial Calculations:** Credit-to-currency system automating campaign goals and creator withdrawals (e.g., 20 credits = $1 USD).
10. **imgBB Image Uploading:** Seamless image uploads with real-time preview options for user avatars and campaign cover pictures.
11. **Supporter Reporting Desk:** Moderation report center allowing supporters to flag suspicious or fraudulent campaigns for safety.
12. **Admin Payout & Control Hub:** Administrative panel to approve campaigns, process withdrawals, change user roles, and resolve flagged reports.

---

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router, conventions matching v16/Turbopack)
* **Styling:** Tailwind CSS v4 & HeroUI React Component Library
* **Animations:** Framer Motion (for toast alerts and stat counters)
* **Icons:** Lucide React & React Icons
* **Database & Modeling:** MongoDB & Mongoose
* **State Management:** Custom React Context (Auth, Toast notification context)

---

## ⚙️ Local Setup Guide

Follow these steps to configure and run the client-side server locally:

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/kazolhabib/Crowdfunding-Platform.git
cd Crowdfunding-Platform
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root folder and add the following keys:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
API_URL=http://localhost:5001
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Setup Google Sign-In
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Create an **OAuth 2.0 Client ID** as a **Web application**.
3. Set Authorized JavaScript origins to `http://localhost:3000`.
4. Copy the client ID and insert it as the Google OAuth ID if requested by the auth config.

### 4. Running the Development Server
Execute the Next.js development script:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 🛡️ User Roles Breakdown

* **Supporters:** Purchase credits via Stripe, back active campaigns, manage contribution history, and report suspicious projects.
* **Creators:** Build and launch campaigns, manage contribution approvals, and request credit-to-USD withdrawals.
* **Administrators:** Oversee user accounts, manage platform-wide campaigns, process withdrawals, and investigate flagged reports.
