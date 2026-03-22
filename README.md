# PickAll Transport Booking Web App

PickAll is a React + Vite web application for vehicle transport bookings. Users can request quotes, track shipments, contact support, register/login with Firebase Authentication, and manage their account details through a dashboard.

## Current Functionality

### Public Experience

- Home, Services, Quote, Track, and Contact pages
- Service cards include `Book Now` CTA that routes to `/get-a-quote`
- Quote form submits using EmailJS and also stores tracking/quote records in Firestore
- Contact form submits using EmailJS and stores leads in Firestore
- Tracking page fetches live shipment status from Firestore using tracking ID

### Authentication

- Register/Login using Firebase Auth Email/Password
- Email verification required before login
- Resend verification flow from login page
- Registration flow includes timeout handling and recreate-account edge-case handling

### User Dashboard (`/my-account/*`)

- Route-based account sections:
	- `/my-account/dashboard`
	- `/my-account/orders`
	- `/my-account/addresses`
	- `/my-account/account-details`
	- `/my-account/edit-address/billing`
	- `/my-account/edit-address/shipping`
- Orders list with collection compatibility (`order` and `orders`)
- Address management (billing + shipping) with validation
- Account details update (name/display name)
- Password change with re-authentication
- Account deletion flow with confirmation and cleanup

### Reliability and UX Hardening

- Timeout wrappers for network-sensitive operations
- Firestore fallback messaging when writes are delayed/unavailable
- Local account profile cache fallback for first/last/display/email
- Compatibility support for both profile collections: `Users` and `users`

## Tech Stack

### Frontend

- React (Vite)
- React Router
- TailwindCSS

### Integrations

- Firebase Authentication
- Cloud Firestore
- Firebase Analytics (optional toggle)
- EmailJS

### Tooling

- Node.js + npm
- Git + GitHub
- VS Code

## Project Structure

```txt
src/
	components/
		Footer.jsx
		Hero.jsx
		HowItWorks.jsx
		Navbar.jsx
		QuoteForm.jsx
		Services.jsx
		ServicesCard.jsx
		Tracking.jsx
	lib/
		firebase.js
	pages/
		ContactPage.jsx
		Home.jsx
		Login.jsx
		QuotePage.jsx
		Register.jsx
		ServicesPage.jsx
		TrackPage.jsx
		UserDashboard.jsx
	App.jsx
	App.css
	index.css
```

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Environment Variables

Create `.env` in project root and configure:

```env
# EmailJS
VITE_EMAIL_SERVICE=your_emailjs_service_id
VITE_EMAIL_TEMPLATE=your_quote_template_id
VITE_CONTACT_TEMPLATE=your_contact_template_id
VITE_EMAIL_KEY=your_emailjs_public_key
VITE_ADMIN_EMAIL=support@example.com

# Firebase Web App Config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...

# Feature Toggles
VITE_ENABLE_FIRESTORE=true
VITE_ENABLE_ANALYTICS=false
```

Restart the dev server after updating `.env`.

## Firebase Configuration Checklist

1. Enable `Authentication -> Sign-in method -> Email/Password`.
2. Create Firestore database with database id `(default)`.
3. Add/publish Firestore rules compatible with your app flows.
4. Ensure these collections are supported:
	 - `Users`
	 - `users`
	 - `quoteRequests`
	 - `tracking`
	 - `contactLeads`
	 - `order` and/or `orders`

## Firestore Data Expectations

- Profile docs use user UID as document ID in `Users`/`users`.
- Addresses are stored inside profile doc as maps:
	- `billingAddress`
	- `shippingAddress`
- `pincode` should be numeric in Firestore.
- Quote/contact/tracking flows are designed to remain user-friendly even when Firestore writes are delayed.

## Notes

- If Firebase verification email is temporarily rate-limited after recreate-account, the app guides users to login and resend verification.
- Dashboard and account operations are resilient to intermittent network delays.
- Build status has been validated with `npm run build` after major changes.
