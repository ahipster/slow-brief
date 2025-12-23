# Testing Slow Brief - Critical Paywall Security Test

## 🚀 Your Application is Running!

**URL:** http://localhost:3001

---

## ✅ Quick Functionality Tests

### 1. Homepage Test
- [ ] Visit http://localhost:3001
- [ ] Should show today's brief: "Testing the Slow Brief Paywall"
- [ ] Free section is visible
- [ ] Paywall message appears: "The rest of today's brief is for subscribers"
- [ ] Subscribe button is visible

### 2. Navigation Test
- [ ] Click "Archive" in navigation
- [ ] Should show 2 briefs in chronological order
- [ ] Both brief titles and dates are visible

### 3. Individual Brief Test
- [ ] Click on "Testing the Slow Brief Paywall" from archive
- [ ] Free section is visible
- [ ] Paywall boundary shows
- [ ] Paid section is **NOT** visible (this is correct!)

### 4. Static Pages Test
- [ ] Visit http://localhost:3001/about
- [ ] Should show "What Slow Brief IS and IS NOT"
- [ ] Visit http://localhost:3001/manifesto
- [ ] Should show the editorial manifesto
- [ ] Visit http://localhost:3001/subscribe
- [ ] Should show pricing: €5/month, €50/year

---

## 🔒 CRITICAL: Paywall Security Test

This is the most important test - verifying paid content is NEVER sent to the client!

### Step-by-Step Instructions:

1. **Open Chrome DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to the **Network** tab
   - Make sure "Preserve log" is checked

2. **Navigate to a Brief**
   - Visit: http://localhost:3001/briefs/testing-slow-brief-paywall
   - Wait for page to fully load

3. **Find Firestore Request**
   - In Network tab, filter by "firestore"
   - OR search for "googleapis" in the filter box
   - Look for requests to `firestore.googleapis.com`

4. **Inspect Response**
   - Click on the Firestore request
   - Go to "Response" or "Preview" tab
   - Look at the response data

### ✅ PASS Criteria:

The response should contain:
- ✅ `slug: "testing-slow-brief-paywall"`
- ✅ `headline: "Testing the Slow Brief Paywall"`
- ✅ `freeHtml: "<p>This is the..."`
- ✅ `publishDate: {...}`
- ✅ `status: "published"`

The response should **NOT** contain:
- ❌ `paidHtml` field **must be missing or undefined**

### ❌ FAIL Criteria:

If you see `paidHtml` in the response:
- **SECURITY ISSUE**: Paid content is being leaked to client!
- This means the Firestore security rules are not working
- Contact immediately for debugging

---

## 🧪 Alternative Paywall Test (Server-Side)

Since we're using server-side rendering, you can also verify this way:

1. **View Page Source**
   - Right-click on brief page → "View Page Source"
   - Search for text from paid section: "What to ignore today"

2. **Expected Result**
   - ❌ Should **NOT** find "What to ignore today" in source
   - ✅ Should only find free section text

If paid content appears in page source:
- The server-side paywall logic has an issue
- Check `lib/briefs.ts:enrichBriefWithPaywall` function

---

## 📊 Test Briefs Available

We've created 2 test briefs for you:

### Brief 1: Today's Brief
- **Slug:** `testing-slow-brief-paywall`
- **URL:** http://localhost:3001/briefs/testing-slow-brief-paywall
- **Publish Date:** Today
- **Purpose:** Homepage and paywall testing

### Brief 2: Archive Brief
- **Slug:** `collective-memory-vs-algorithmic-feed`
- **URL:** http://localhost:3001/briefs/collective-memory-vs-algorithmic-feed
- **Publish Date:** Yesterday
- **Purpose:** Archive list testing

---

## 🎯 Expected Behavior Summary

### For Non-Subscribers (Everyone Right Now):
✅ Can see:
- Homepage with free section
- Archive list (all brief titles)
- Free section of any brief
- Paywall message
- Subscribe button
- About, Manifesto pages

❌ Cannot see:
- Paid section content
- "What to ignore today" section
- "Something slower" section

### After Subscribing (Stripe Integration):
✅ Can see everything above PLUS:
- Full paid section
- All subscriber-only content

---

## 🐛 Common Issues & Solutions

### Issue: "No brief published today"
**Solution:** The test brief was just created. Check the Archive page instead.

### Issue: Blank page or errors
**Solution:**
1. Check console for errors (F12 → Console tab)
2. Check server logs in terminal
3. Verify `.env.local` has all Firebase credentials

### Issue: Styles look broken
**Solution:** This is normal - we haven't added complex styling yet. Focus on functionality.

### Issue: Firestore permission denied
**Solution:**
1. Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
2. Check Firebase Console → Firestore → Rules

---

## 📸 Screenshots for Verification

Take screenshots of:
1. Homepage with today's brief
2. Archive page showing 2 briefs
3. Individual brief page with paywall
4. Chrome DevTools → Network tab showing Firestore response (proving `paidHtml` is missing)

---

## ✅ Success Checklist

Before deploying to production, verify:
- [ ] Homepage loads without errors
- [ ] Archive shows all briefs
- [ ] Individual briefs show paywall
- [ ] **CRITICAL:** Firestore responses do NOT include `paidHtml`
- [ ] Navigation works between all 6 pages
- [ ] Mobile responsive (resize browser window)
- [ ] No console errors in DevTools

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Set up Stripe** (for payment testing)
   - Create Stripe products
   - Add price IDs to `.env.local`
   - Test subscription flow

2. **Deploy to Production**
   - Run: `npm run build`
   - Deploy: `firebase deploy`
   - Test on live URL

3. **Configure Custom Domain**
   - Point slowbrief.com to Firebase
   - Set up SSL certificate

---

## 🆘 Need Help?

If anything doesn't work as expected:
1. Check server logs in terminal
2. Check browser console for errors (F12)
3. Review QUICK_START.md for setup steps
4. Review SETUP.md for troubleshooting

---

**Remember:** Scarcity is the product. One brief per day. Always.
