# Firebase App Hosting - Manual Deployment Guide

## Step 1: Push Code to GitHub

```bash
# In your terminal, run:
git push origin claude/claude-md-mjh4ytjl39w25qmu-2rEXT
```

**If you get authentication errors:**
- Use GitHub CLI: `gh auth login` then retry
- Or use SSH: `git remote set-url origin git@github.com:ahipster/slow-brief.git`
- Or push from GitHub Desktop app

---

## Step 2: Set Up Firebase App Hosting

### 2.1: Go to Firebase Console
1. Open: https://console.firebase.google.com/project/slow-brief
2. In the left sidebar, click **"Hosting"**
3. Click **"Get Started"** or **"Add another site"**

### 2.2: Enable App Hosting (NOT Static Hosting)
1. Look for the **"App Hosting"** tab at the top
2. Click **"Get Started"** on App Hosting
3. If prompted to enable billing, click **"Enable billing"** (required for App Hosting)

---

## Step 3: Connect GitHub Repository

### 3.1: Link GitHub Account
1. Click **"Connect to GitHub"**
2. Authorize Firebase to access your GitHub account
3. Select your GitHub username/organization: **ahipster**

### 3.2: Select Repository
1. Find and select repository: **slow-brief**
2. Choose branch: **claude/claude-md-mjh4ytjl39w25qmu-2rEXT** (or **main** if you merge first)
3. Click **"Next"**

### 3.3: Configure Build Settings
When prompted for build configuration:

**Root directory:** `.` (leave default)

**Build command:** `npm run build`

**Output directory:** `.next`

**Framework:** Next.js

**Node version:** 18 or 20

Click **"Next"**

---

## Step 4: Configure Environment Variables

In the Firebase App Hosting setup wizard, you'll see "Environment Variables" section.

Click **"Add variable"** for each of these:

### Firebase (Client-Side - Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBLjb40CABoXQGoK_6k52kBz7YTGQmSObs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=slow-brief.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=slow-brief
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=slow-brief.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=59197597422
NEXT_PUBLIC_FIREBASE_APP_ID=1:59197597422:web:fb8c20248e6dca264335ff
```

### Firebase (Server-Side - Secret)
```
FIREBASE_PROJECT_ID=slow-brief
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@slow-brief.iam.gserviceaccount.com
```

**FIREBASE_PRIVATE_KEY** - Click "Add from Secret" or paste:
```
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCVsfq0fpEL1rEc
a1OqhIfLmg2rqBbEmjOm/Pb2mAa6tXVDWYGG7bIgJBxW92Noz9iDrsytl7rJvrTY
7NM5HKZY3Q+JYPu9FFjedHP/Q88/MG9vODS9cIB162A4ckJ0muStg+MYMv9zVJV7
BAfetsZMB5COGz0LMO3b41eS+Dz1C8SaDLZwtNVjj7qQ9QmY1SYamBc8Yph9D1vY
OWLOOB3yHUVa0jcfQKjS253IZDElun81DiOC+KG6V4nqkhRxuW6HMuvbW+AZLaqE
olbOnfeAg9r9Ckk3ZCApBdUQjD+GlELv9jfhHvrScA7F2z12vq+0ixqQ7TN5F2I9
MEZRS+DBAgMBAAECggEAO11XtRi0YOOFXWXayjbAu6eeYELKtLEKZuDO98AWexjX
Jhxq152QFFr9uidljv1OOfqqRPV1J+ivQ4+3vGB2P6t7K9oAO13EWIQKNGMp3z9Q
EeVSVQY2i40KnZgCbse2hHFXMBOZZp1WonBYxqPpQ+GEHDcFIFkJGzivVCOJ2Qt0
FKPf78a5y8wikQ8eOGnEIrV5bPihDFJtnIIVzTpnUyMFpLJqrxABja8cTnDe1Vl8
QO/B2K+UKi/X0gRHMJoCqCgZdoS0x8YJ5uSctX8Wwfr/gyc+aMQAKl8eUAR/l/im
hp5Zbm73OYC7xCedShAr/ecc5rduiKxyayJYYGyd+QKBgQDQ/6fgD6WJLKZTu0BJ
jyo9/eLPltrRz/s3NMQ9oPjFal+5+G17vy4/I6mTyZt87eoFww/9qiQYQ4f9yU7Z
wtJbUyYIIZSk5ouse900pjfBrmOsnx+msVwKh1WkDW0/yUj/A4+LSPkVRtQiNWKd
se7ngjuN0HPjGNvfnXhfa9/5uwKBgQC3XCSIBDUqRDW3KL6COWF/4BhtlY2gcu4G
RZIo/E+XwG7qH7VyzlhXYt8fUKAcEtquzuCrSiZNhQiyWV3uLg22uvyzMuQ3eEOI
2aSSzPldqcNXLvvlcahppd8mNJll8BPxcn1UHUuvNV0HkGsObRzyKBNb1rY2tLcx
7/LPNZcZswKBgDANV6+waULsvSErQFCpVfEC2o8YBB+RThUXULdKt2fMWU4MzD9T
aXKi5G5SQCmtGc1RV+/emoXpoO68xiBTJsJQj8H21pJDX4G8yNM+FDu3uLsLqt9M
j/jrvMkHPUMZKGtZijtf/8TgkA19cLsJGgCodMDaWIqyQHtdXTuzNb/ZAoGAKSZw
vGXVWKr+MyDdwHQIQZ6VXOKXak7gxF+QscoOQsxZGAoNuro8cUArOufpRuOkWF7t
ZQO7HOKiVQRhZDbJtRy54a2mMhy3a1sM6DVAMZkL0eElfxTG6w7iybw8QPhkQWek
YOBCQAwF2NC8dfxe5qm/znidZCGii36CS6aHRqkCgYAYZA+9MsbTkO/EZAoS73T8
O4YYLLy3f2SJaYwUL7UfcB0HhkSkv1NohkHb5wbsX4vUMC9Lsu0wrGhzMmidO/sH
hpC8VyBdFHYFDhAT4FBgsGTAwm3XB0Pgfu5vGqaK9gBPVHVrhskMhu8rOtABDmEd
P/Cg4Jtts+Ufc/RRiPtAxQ==
-----END PRIVATE KEY-----
```

### Stripe (PRODUCTION KEYS - IMPORTANT!)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51Qfzg3JaSaBbBvGJ9uPtT4HppCVKPl1TQu4wx2NMGhWy4Kz7DvFgJ89O6Oqsa61gIgiAgUrQW97qDWq2zdC05sZ300MMV2ycoP
STRIPE_SECRET_KEY=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
STRIPE_MONTHLY_PRICE_ID=price_1ShHpgJaSaBbBvGJQXlMpyWl
STRIPE_ANNUAL_PRICE_ID=price_1ShHqHJaSaBbBvGJxe2iEOza
```

**STRIPE_WEBHOOK_SECRET** - Leave empty for now (we'll set this after deployment)

### Optional
```
NEXT_PUBLIC_BASE_URL=https://slow-brief.web.app
```

Click **"Next"** or **"Create"**

---

## Step 5: Deploy

1. Firebase will automatically trigger the first deployment
2. Wait for build to complete (5-10 minutes)
3. You'll see build logs in the console
4. Once complete, you'll get a URL like: `https://slow-brief-<hash>.web.app`

---

## Step 6: Configure Stripe Production Webhook

### 6.1: Get Your Production URL
After deployment completes, note your production URL (e.g., `https://slow-brief.web.app`)

### 6.2: Create Stripe Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://slow-brief.web.app/api/webhook/stripe`
4. Click **"Select events"**
5. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Click **"Add events"**
7. Click **"Add endpoint"**

### 6.3: Get Webhook Secret
1. Click on the webhook you just created
2. Click **"Reveal"** next to **"Signing secret"**
3. Copy the secret (starts with `whsec_`)

### 6.4: Add Webhook Secret to Firebase
1. Go back to Firebase Console → App Hosting
2. Click on your app
3. Go to **"Settings"** or **"Environment Variables"**
4. Add or update:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_SECRET
   ```
5. Save and redeploy

---

## Step 7: Test Production Deployment

1. Visit your production URL
2. Test login flow: `/login`
3. Create test subscription with Stripe test card: `4242 4242 4242 4242`
4. Verify webhook is working in Stripe Dashboard → Webhooks → Logs
5. Verify subscription gives access to paid content

---

## Step 8: Custom Domain (Optional)

### 8.1: Add Custom Domain in Firebase
1. In Firebase Console → Hosting
2. Click **"Add custom domain"**
3. Enter: `slowbrief.com`
4. Follow DNS configuration steps

### 8.2: Configure DNS
At your domain registrar (e.g., Namecheap, GoDaddy):

Add these DNS records:
```
A     @    199.36.158.100
CNAME www  slow-brief.web.app
```

Wait for DNS propagation (can take 24-48 hours)

---

## Troubleshooting

### Build Fails
- Check build logs in Firebase Console
- Verify all environment variables are set
- Ensure Node version is 18 or 20

### Webhook Not Working
- Check webhook secret matches in both Stripe and Firebase
- Verify webhook URL is correct: `https://YOUR-DOMAIN.web.app/api/webhook/stripe`
- Check Stripe Dashboard → Webhooks → Logs for errors

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing variables
- Check for typos in variable names

---

## Alternative: Using Firebase CLI

If you prefer command-line deployment:

```bash
# Login to Firebase
firebase login

# Initialize App Hosting (one-time setup)
firebase init apphosting

# Deploy
firebase deploy --only hosting
```

---

## Summary Checklist

- [ ] Push code to GitHub
- [ ] Enable Firebase App Hosting
- [ ] Connect GitHub repository
- [ ] Add all environment variables
- [ ] Deploy (automatic after setup)
- [ ] Configure Stripe production webhook
- [ ] Add webhook secret to Firebase
- [ ] Test production deployment
- [ ] (Optional) Add custom domain

---

Your production Slow Brief app will be live at: **https://slow-brief.web.app** 🎉
