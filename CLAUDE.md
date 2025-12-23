# CLAUDE.md - AI Assistant Guide for Slow Brief

**Domain**: slowbrief.com
**Tagline**: What matters, without the feed.

---

## 1. Product Vision

**Slow Brief** is a daily editorial companion that replaces algorithmic feeds with a single, deliberate act of judgment. Each day, briefs are chosen and framed calmly, with enough context to understand why it matters — and with restraint about what does not.

### The Core Promise

If someone reads Slow Brief each day:
- They read **less**
- They understand **more**
- They feel **calmer**
- They stop scrolling

**Scarcity is the product.**

---

## 2. What Slow Brief IS and IS NOT

### ✓ It IS:
- A daily editorial judgment
- A calm reading ritual (5–7 minutes)
- A finite alternative to feeds
- Human-voiced, **never AI-voiced**
- Opinionated in selection, neutral in tone

### ✗ It IS NOT:
- A news site
- A feed or aggregator
- A blog
- Personalized content
- Optimized for engagement metrics
- Multiple posts per day
- Categorized or tagged content
- AI-generated prose

---

## 3. Editorial Manifesto (The Constitution)

> **Slow Brief exists to reduce noise, not add to it.**
>
> We choose deliberately.
> We choose deliberately.
> We omit aggressively.
>
> We do not chase trends, outrage, or virality.
> We do not optimize for engagement.
> We do not personalize attention.
>
> We believe judgment matters more than volume.
> We believe understanding takes time.
>
> If you read only this, you should feel oriented — not overwhelmed.

**This manifesto governs ALL development decisions.**

---

## 4. Technical Architecture

### Stack

- **Platform**: Firebase App Hosting (billing enabled)
- **Framework**: Next.js (SSR for SEO + server-side paywall)
- **Database**: Firestore
- **Authentication**: Firebase Authentication (email magic link)
- **Payments**: Stripe Checkout (subscriptions)
- **Hosting**: Firebase App Hosting

### Key Technical Constraints

1. **Server-Side Paywall**
   - Paid content NEVER shipped to client for non-subscribers
   - Rendered server-side only
   - No blur tricks, no client-side gating

2. **Firestore Structure**
   ```
   briefs/
     {slug}/
       - publishDate: timestamp
       - headline: string
       - freeHtml: string (120-180 words)
       - paidHtml: string (full context)
       - slug: string
       - status: 'draft' | 'published'

   users/
     {uid}/
       - email: string
       - subscriptionStatus: 'active' | 'inactive'
       - stripeCustomerId: string
   ```

3. **Security Rules**
   - Briefs collection: admin-only write, public read of free fields only
   - Users collection: admin-only access
   - Paid content fields denied to client reads

---

## 5. Project Structure

```
slow-brief/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (today's brief)
│   ├── archive/
│   │   └── page.tsx              # Chronological list
│   ├── briefs/
│   │   └── [slug]/
│   │       └── page.tsx          # Individual brief (SSR paywall)
│   ├── about/
│   │   └── page.tsx              # What Slow Brief is/isn't
│   ├── subscribe/
│   │   └── page.tsx              # One plan, one price
│   └── manifesto/
│       └── page.tsx              # Editorial constitution
├── components/
│   ├── Brief.tsx                 # Brief display component
│   ├── Paywall.tsx               # Paywall UI
│   └── SubscribeCTA.tsx          # Subscribe call-to-action
├── lib/
│   ├── firebase-admin.ts         # Admin SDK setup
│   ├── firebase-client.ts        # Client SDK setup
│   ├── auth.ts                   # Auth helpers
│   └── briefs.ts                 # Brief fetching logic
├── functions/
│   └── stripe-webhook.ts         # Stripe → Firestore sync
├── public/
│   └── robots.txt                # SEO
├── .gitignore
├── next.config.js
├── package.json
├── firestore.rules
├── firebase.json
├── tsconfig.json
└── CLAUDE.md                     # This file
```

**Only these pages exist. Do not add more.**

---

## 6. Website Structure (Immutable)

The site has **exactly 6 pages**:

1. **`/`** - Homepage (today's brief, free section visible)
2. **`/archive`** - Chronological list (title + date only)
3. **`/briefs/[slug]`** - Individual brief (server-side paywall)
4. **`/subscribe`** - One plan, one price
5. **`/manifesto`** - Editorial constitution + what Slow Brief is / is not

**No additional pages should be created without explicit approval.**

---

## 7. Content Structure

### Daily Brief Format

Each brief has:

1. **Headline** (plain language, clear)
2. **Free Section** (120–180 words)
   - Public, SEO-indexed
   - Enough framing to establish credibility
   - One primary source link
3. **Paywall boundary**
   - Copy: "The rest of today's brief is for subscribers."
4. **Paid Section** (subscribers only)
   - Deeper context (historical, structural, conceptual)
   - "What to ignore today" section
   - One slower piece (essay, long read, cultural artifact)

### Example Headlines (Tone Reference)

- "We are quietly normalizing AI mediation of judgment"
- "The news is faster, but understanding is slower"
- "We are losing shared reference points"
- "When risk stops shocking and starts assimilating"
- "Collective memory vs algorithmic feed"

---

## 8. Pricing Model

- **€5 / month**
- **€50 / year** (default highlighted)

**One plan. No tiers. No trials.**

This signals confidence and restraint.

---

## 9. What NOT to Build (Critical Constraints)

AI assistants must **actively resist** these common feature requests:

### ✗ NEVER Add:

1. **Multiple posts per day** - The product IS scarcity
2. **Categories or tags** - No taxonomy, no organization beyond time
3. **Related stories** - No infinite scroll, no "you might like"
4. **Personalization** - Everyone sees the same brief
5. **Comments or social features** - No engagement metrics
6. **RSS feed with full content** - Undermines subscription model
7. **AI-generated prose** - Human voice only
8. **Real-time updates** - One brief, published once
9. **Trending sections** - Anti-pattern to the mission
10. **Share counts or metrics** - No virality optimization
11. **Email preferences beyond on/off** - No customization
12. **Multiple subscription tiers** - One plan only
13. **Free trial period** - Confidence, not conversion tricks
14. **Author bios or bylines** - Voice is institutional
15. **Search by topic** - Only chronological archive

**If a feature increases volume, attention, or complexity: say no.**

---

## 10. SEO Philosophy

Slow Brief does **not** compete on volume.

SEO is achieved through:
- Clean URLs (`/briefs/collective-memory-vs-algorithmic-feed`)
- One H1 per brief (the headline)
- Plain language headlines (not clickbait)
- Contextual relevance in free section
- Proper semantic HTML
- Fast page loads
- Mobile-first design

**Rank by clarity, not frequency.**

---

## 11. Development Workflows

### Git Workflow

#### Branch Strategy
- **Feature branches**: All development on feature branches
- **Branch naming**: `claude/feature-name-sessionid`
- **Current branch**: `claude/claude-md-mjh4ytjl39w25qmu-2rEXT`

#### Git Operations
```bash
# Push (retry up to 4 times with exponential backoff if network fails)
git push -u origin <branch-name>

# Fetch specific branch
git fetch origin <branch-name>

# Pull
git pull origin <branch-name>
```

**Critical**: Branch names must start with `claude/` and end with session ID, or push fails with 403.

### Commit Guidelines
- Clear, descriptive messages
- Imperative mood: "Add feature" not "Added feature"
- Include WHY, not just WHAT
- Reference issues when applicable

---

## 12. Code Quality Standards

### Security (OWASP Top 10)
- No command injection, XSS, SQL injection
- Validate at system boundaries (user input, Stripe webhooks)
- Trust internal code and Firebase guarantees
- Never expose paid content to non-subscribers
- Verify Stripe webhook signatures

### Simplicity
- Only make changes directly requested or clearly necessary
- Don't add unrequested features or refactoring
- Don't add error handling for impossible scenarios
- Don't create abstractions for one-time operations
- **Three similar lines > premature abstraction**

### Minimal Changes
- Don't add comments where logic is self-evident
- Don't add docstrings to unchanged code
- Don't add type annotations unnecessarily
- If something is unused, delete it completely
- No backwards-compatibility hacks

---

## 13. Key Conventions for AI Assistants

### File Operations
1. **Read before edit** - ALWAYS read a file before modifying
2. **Prefer Edit over Write** - Use Edit for existing files
3. **Use specialized tools**:
   - `Read` for reading (not cat/head/tail)
   - `Edit` for modifying (not sed/awk)
   - `Write` only for new files (not echo/heredoc)

### Task Management

**Use TodoWrite for**:
- Multi-step tasks (3+ steps)
- Non-trivial complex tasks
- Tracking implementation progress

**Todo states**:
- `pending` - Not started
- `in_progress` - Currently working (**limit to ONE at a time**)
- `completed` - Fully finished

**Rules**:
- Mark complete IMMEDIATELY after finishing
- Keep exactly ONE task in_progress
- Only mark complete when FULLY accomplished
- If blocked, keep as in_progress and create blocker task

### Communication Style
- Concise and direct
- No emojis unless requested
- Professional, objective tone
- Prioritize facts over validation
- Respectfully disagree when necessary
- **Never suggest timelines or estimates**

### Code References
Use pattern: `file_path:line_number`

Example: "Authentication logic is in lib/auth.ts:45"

---

## 14. Editorial Workflow (Day-to-Day)

### How Briefs Are Managed

1. **Write ahead**: 10–14 briefs in advance
2. **Store in Firestore**: Admin writes briefs as HTML
3. **Publish daily**: One brief becomes visible each day
4. **Email subscribers**: Daily email with title + free section + link

### Operational Rules

- **Never increase volume** - Always one per day
- **Never react to social media** - Judgment, not virality
- **Never add personalization** - Shared experience
- **Never allow AI prose** - Human voice only

---

## 15. Firebase Configuration

### App Hosting Setup
```bash
# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Firestore Rules (firestore.rules)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Briefs: public read of free content only
    match /briefs/{briefId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      // Deny client access to paid content
      allow get: if resource.data.keys().hasAny(['headline', 'freeHtml', 'publishDate', 'slug']);
    }

    // Users: admin only
    match /users/{userId} {
      allow read, write: if request.auth != null &&
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Cloud Functions (Stripe Webhook)
```typescript
// functions/stripe-webhook.ts
import { onRequest } from 'firebase-functions/v2/https';
import Stripe from 'stripe';
import { firestore } from './firebase-admin';

export const stripeWebhook = onRequest(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      await firestore.collection('users')
        .where('stripeCustomerId', '==', subscription.customer)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.update({
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive'
            });
          });
        });
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 16. Testing Strategy

### What to Test

1. **Paywall integrity**
   - Paid content never shipped to non-subscribers
   - Server-side rendering works correctly
   - Firestore rules deny client access

2. **Authentication flow**
   - Magic link email delivery
   - Session cookie creation
   - Redirect after login

3. **Stripe integration**
   - Checkout session creation
   - Webhook signature verification
   - Subscription status updates

4. **Brief display**
   - Free section visible to all
   - Paid section only to subscribers
   - Correct HTML rendering

### What NOT to Test
- Don't test Firebase SDK internals
- Don't test Stripe API behavior
- Don't over-test UI components

---

## 17. Deployment Process

### Pre-Deploy Checklist
1. All tests pass
2. No secrets in code
3. Environment variables set in Firebase
4. Firestore rules deployed
5. Cloud Functions deployed

### Deploy Commands
```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

---

## 18. Common Tasks Reference

### Starting New Work
1. Ensure on correct feature branch
2. Read relevant existing code
3. Use TodoWrite for multi-step tasks
4. Make minimal, focused changes
5. Test locally
6. Commit with clear message
7. Push to feature branch

### Creating Pull Requests
1. Review changes: `git diff`
2. Ensure all todos completed
3. Write comprehensive PR description
4. Include test plan
5. Push to feature branch
6. Create PR: `gh pr create`

### Adding a New Brief (Manual Process)
1. Write brief (headline + free + paid HTML)
2. Use Firebase Console to add to Firestore
3. Set publishDate to future date
4. Set status to 'published'
5. Brief appears automatically on publish date

---

## 19. Environment Variables

Required in Firebase App Hosting:

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
FIREBASE_PROJECT_ID=slow-brief
```

---

## 20. Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "firebase": "^10.0.0",
    "firebase-admin": "^12.0.0",
    "stripe": "^14.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

**Keep dependencies minimal. Don't add libraries for single-use cases.**

---

## 21. Quick Reference Commands

### Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests (when implemented)
npm test
```

### Git Operations
```bash
# Check status
git status

# Create feature branch
git checkout -b claude/feature-name-sessionid

# Stage changes
git add .

# Commit
git commit -m "Clear, descriptive message"

# Push
git push -u origin <branch-name>

# Create PR
gh pr create --title "Title" --body "Description"
```

### Firebase
```bash
# Login
firebase login

# Deploy
firebase deploy

# View logs
firebase functions:log

# Firestore console
firebase open hosting:site
```

---

## 22. Maintenance Notes

### Last Updated
2025-12-22 - Complete rewrite with Slow Brief product context

### Update Triggers
Update this document when:
- Project structure changes
- New pages added (rare, should be questioned)
- Editorial philosophy evolves
- Technical stack changes
- New constraints or boundaries established

### Document Maintenance
- Keep current with codebase reality
- Remove outdated information
- Maintain clarity and conciseness
- Update "Last Updated" date

---

## 23. Decision-Making Framework

When implementing ANY feature, ask:

1. **Does this increase volume?** → Say no
2. **Does this increase complexity?** → Minimize
3. **Does this personalize content?** → Say no
4. **Does this optimize for engagement?** → Say no
5. **Does this undermine scarcity?** → Say no
6. **Does this conflict with the manifesto?** → Say no
7. **Is this necessary for the core product?** → Proceed minimally

**When in doubt, do less.**

---

## 24. Philosophy Reminders for AI Assistants

### Product Philosophy
- Scarcity is a feature, not a bug
- Judgment > algorithm
- Understanding > information
- Calm > engagement
- One > many

### Technical Philosophy
- Simple > clever
- Delete > refactor
- Server-side > client-side (for paywall)
- Explicit > implicit
- Minimal > feature-rich

### Editorial Philosophy
- Human voice > AI voice
- Context > headlines
- Omission > inclusion
- Orientation > information
- Depth > breadth

---

## 25. Example Brief Structure (Reference)

### Headline
**Collective memory vs algorithmic feed**

### Free Section (Public, 120-180 words)
In earlier decades, people disagreed fiercely — but often about the same events and facts. Today, disagreement increasingly begins earlier: at what is even seen or acknowledged. Algorithmic feeds have fragmented attention itself. What matters is not polarization alone, but the erosion of shared reference points that make disagreement meaningful.

[Primary source link]

*The rest of today's brief is for subscribers.*

### Paid Section (Subscribers Only)
Shared reference points do not require consensus — only overlap. Historically, newspapers and broadcast schedules created this overlap by default. Today, it must be created deliberately. Personalization solves relevance but destroys collectivity.

**What to ignore today:** Calls for better personalization algorithms. The problem is not insufficient optimization — it's optimization itself.

**Something slower:** [Link to essay on the decline of mass culture, with 2-sentence framing of why it matters]

---

## 26. Status & Readiness

**Current State**: Repository initialized, CLAUDE.md complete

**Ready to Build**:
- ✓ Product vision defined
- ✓ Editorial constraints established
- ✓ Technical architecture designed
- ✓ Boundaries and anti-patterns documented
- ✓ Domain registered (slowbrief.com)

**Next Steps**:
1. Initialize Next.js project
2. Set up Firebase App Hosting
3. Configure Firestore
4. Implement authentication
5. Build server-side paywall
6. Integrate Stripe
7. Deploy to production

---

**This document is the constitution of Slow Brief development. It should evolve slowly and deliberately, like the product itself.**
