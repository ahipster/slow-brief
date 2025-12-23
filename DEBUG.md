# Debugging Slow Brief Payment Flow

## Quick Checklist

- [ ] Dev server running on `localhost:3000`
- [ ] `stripe listen` running in separate terminal
- [ ] Webhook secret updated in `.env.local`
- [ ] Dev server restarted after updating webhook secret
- [ ] User logged in (check browser console: `localStorage.getItem('emailForSignIn')`)
- [ ] Session cookie exists (check browser DevTools → Application → Cookies → `session`)

## Test Stripe Locally

### 1. Start Stripe CLI listener
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copy the webhook signing secret (starts with `whsec_`)

### 2. Update `.env.local`
```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

### 3. Restart dev server
```bash
# Kill existing server (Ctrl+C)
npm run dev
```

## Test Flow

1. **Login**: http://localhost:3000/login
   - Enter email
   - Check email for magic link
   - Click link → redirects to `/verify-email` → creates session cookie → redirects to `/subscribe`

2. **Subscribe**: http://localhost:3000/subscribe
   - Click monthly or annual plan
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout
   - Watch `stripe listen` terminal for webhook events

3. **Check Paywall**: http://localhost:3000
   - Should now see paid content!

## Debugging Steps

### Check Session Cookie
```javascript
// In browser console
document.cookie
// Should see: session=...
```

### Check Firestore User Document
```bash
# Check if user exists and has subscription
firebase firestore:get users/{your-uid}
```

Should see:
```json
{
  "email": "your@email.com",
  "subscriptionStatus": "active",
  "stripeCustomerId": "cus_...",
  "subscriptionId": "sub_..."
}
```

### Check Webhook Logs
In the terminal running `stripe listen`, you should see:
```
2025-12-22 23:00:00  --> checkout.session.completed [evt_...]
2025-12-22 23:00:01  --> customer.subscription.created [evt_...]
```

### Check Dev Server Logs
In the terminal running `npm run dev`, look for:
```
Stripe session created: cs_test_...
Linked customer cus_... to user {uid}
Updated subscription status to active for customer cus_...
```

## Common Issues

### Issue: No webhook events received
**Solution**: Make sure `stripe listen` is running and webhook secret is correct in `.env.local`

### Issue: Paywall still showing after payment
**Check**:
1. Is session cookie set? (check browser DevTools)
2. Is user logged in? (Firebase Auth state)
3. Was webhook received? (check `stripe listen` logs)
4. Is Firestore user document updated? (check Firebase Console)

### Issue: Session cookie not created after login
**Check**: Browser console for errors when calling `/api/session`

### Issue: Stripe checkout fails
**Check**:
- Are price IDs correct in `.env.local`?
- Is Stripe in test mode?
- Check dev server logs for errors
