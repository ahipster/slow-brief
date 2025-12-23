# Slow Brief

**What matters, without the feed.**

---

## Overview

Slow Brief is a daily editorial platform that replaces algorithmic feeds with deliberate judgment. One brief per day. Always.

### Core Promise

- Read **less**
- Understand **more**
- Feel **calmer**
- Stop scrolling

**Scarcity is the product.**

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Hosting**: Vercel
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth (passwordless magic link)
- **Payments**: Stripe (€5/month or €50/year)
- **Rendering**: Server-Side Rendering (SSR) for paywall enforcement

---

## Documentation

| Document | Purpose |
|----------|---------|
| **[SPEC.md](SPEC.md)** | Complete technical specification - architecture, data models, implementation details |
| **[SETUP.md](SETUP.md)** | First-time setup guide - Firebase, Stripe, Vercel, domain configuration |
| **[DEPLOY.md](DEPLOY.md)** | Continuous deployment guide - how to deploy updates |
| **[CLAUDE.md](CLAUDE.md)** | AI assistant guide - principles and constraints |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Firebase account
- Stripe account
- Vercel account

### Local Development

```bash
# Clone repository
git clone https://github.com/ahipster/slow-brief.git
cd slow-brief

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Stripe credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Setup

See **[SETUP.md](SETUP.md)** for complete first-time setup instructions.

### Deploying Updates

See **[DEPLOY.md](DEPLOY.md)** for continuous deployment guide.

---

## Project Structure

```
slow-brief/
├── app/                    # Next.js pages and API routes
│   ├── page.tsx            # Homepage (today's brief)
│   ├── archive/            # Brief archive
│   ├── briefs/[slug]/      # Individual brief (SSR paywall)
│   ├── about/              # About page
│   ├── manifesto/          # Editorial principles
│   ├── subscribe/          # Subscription page
│   ├── account/            # Account management
│   ├── login/              # Magic link login
│   └── api/                # API routes (checkout, webhooks)
├── components/             # React components
├── lib/                    # Utilities (auth, briefs, Firebase)
├── public/                 # Static assets
├── firestore.rules         # Firestore security rules
└── [documentation files]
```

---

## Key Features

### Server-Side Paywall

Paid content is **never** sent to non-subscribers:
- Firestore rules deny client access to `paidHtml` field
- Brief fetching uses Firebase Admin SDK (server-side only)
- Pages render server-side with subscription check
- No client-side gating or blur tricks

### Passwordless Authentication

- Magic link sent to email
- No password required
- Session stored in HttpOnly cookie

### Stripe Integration

- Monthly (€5) and Annual (€50) subscriptions
- Webhook integration for real-time subscription updates
- Customer Portal for subscription management

---

## Security

- ✅ Server-side paywall enforcement
- ✅ Firestore security rules
- ✅ Stripe webhook signature verification
- ✅ HttpOnly, Secure session cookies
- ✅ HTTPS enforced (automatic on Vercel)
- ✅ Environment variables secured

---

## Editorial Principles

> Slow Brief exists to reduce noise, not add to it.
>
> We publish one brief per day.
> We choose deliberately.
> We omit aggressively.
>
> We believe judgment matters more than volume.
> We believe understanding takes time.

### What We Never Add

- Multiple posts per day
- Categories or tags
- Related stories
- Personalization
- Comments or social features
- AI-generated content
- Multiple subscription tiers

**Rule**: If a feature increases volume, attention, or complexity → say no.

---

## Production

- **Site**: https://slowbrief.com
- **Repository**: https://github.com/ahipster/slow-brief
- **Status**: Live in production

---

## License

All rights reserved.

---

**One brief per day. Always.**
