# Slow Brief - Development Tasks

Last Updated: 2025-12-22

## ✅ Completed Tasks

- [x] Initialize Next.js 14 project with TypeScript
- [x] Set up Firebase Admin SDK
- [x] Set up Firebase Client SDK
- [x] Create Firestore security rules with paywall enforcement
- [x] Implement authentication helpers (magic link email)
- [x] Build brief fetching logic with server-side paywall
- [x] Create Brief component
- [x] Create Paywall component
- [x] Create SubscribeCTA component
- [x] Build all 6 required pages (home, archive, briefs, about, subscribe, manifesto)
- [x] Implement Stripe checkout session creation
- [x] Implement Stripe webhook handler (subscription sync)
- [x] Install Stripe CLI
- [x] Set up local Stripe webhook forwarding
- [x] Test login flow end-to-end
- [x] Test payment flow with webhook
- [x] Verify paywall enforcement works

## 🔄 In Progress

- [ ] Commit all project files to git
- [ ] Add test briefs to Firestore
- [ ] Polish UI/typography
- [ ] Deploy to Firebase App Hosting

## 📝 Todo - Git & Version Control

- [ ] Stage all untracked files
- [ ] Create initial commit with proper message
- [ ] Push to remote repository
- [ ] Create .gitignore updates if needed

## 📝 Todo - Content & Testing

- [ ] Create 3-5 test briefs in Firestore
  - [ ] Test brief 1: Published today
  - [ ] Test brief 2: Published yesterday
  - [ ] Test brief 3: Published last week
  - [ ] Test brief 4: Draft (not visible)
  - [ ] Test brief 5: Future date (not visible)
- [ ] Verify archive page displays briefs correctly
- [ ] Test brief navigation
- [ ] Test paywall on different briefs

## 📝 Todo - UI Polish

- [ ] Review typography and spacing
- [ ] Ensure responsive design on mobile
- [ ] Test dark mode compatibility (if applicable)
- [ ] Add loading states where needed
- [ ] Improve error messages
- [ ] Add favicon

## 📝 Todo - Production Deployment

- [ ] Set up Firebase App Hosting
  - [ ] Initialize hosting in Firebase project
  - [ ] Configure build settings
  - [ ] Set up environment variables
- [ ] Deploy Firestore security rules to production
- [ ] Deploy Cloud Functions to production
- [ ] Configure production Stripe webhook
  - [ ] Get production webhook secret
  - [ ] Set webhook URL to production domain
  - [ ] Update production env vars
- [ ] Set up custom domain (slowbrief.com)
  - [ ] Configure DNS records
  - [ ] Set up SSL certificate
  - [ ] Verify domain ownership
- [ ] Test production deployment
  - [ ] Test login flow in production
  - [ ] Test payment flow in production
  - [ ] Verify paywall works in production

## 📝 Todo - Future Enhancements (Optional)

- [ ] Email notifications for subscribers
- [ ] Daily email with brief summary
- [ ] Unsubscribe flow
- [ ] Account management page
- [ ] Analytics (privacy-focused)
- [ ] RSS feed (title + free section only)
- [ ] Sitemap generation
- [ ] robots.txt optimization

## 🚫 Never Add (Per CLAUDE.md)

- ❌ Multiple posts per day
- ❌ Categories or tags
- ❌ Related stories
- ❌ Personalization
- ❌ Comments or social features
- ❌ AI-generated prose
- ❌ Real-time updates
- ❌ Trending sections
- ❌ Share counts or metrics
- ❌ Multiple subscription tiers
- ❌ Free trial period

## 📊 Project Status

**Overall Progress**: 75%

- Core Features: ✅ 100%
- Testing: ✅ 100%
- Content: ⏳ 0%
- UI Polish: ⏳ 0%
- Deployment: ⏳ 0%

**Blocking Issues**: None

**Next Milestone**: Production deployment
