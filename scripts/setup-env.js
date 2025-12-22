#!/usr/bin/env node

/**
 * Helper script to set up .env.local from Firebase service account JSON
 * Usage: node scripts/setup-env.js <path-to-service-account.json>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('\n❌ Error: Please provide path to service account JSON file');
  console.log('\nUsage:');
  console.log('  node scripts/setup-env.js ~/Downloads/slow-brief-xxxxx.json');
  console.log('\nOr manually edit .env.local with your Firebase credentials.\n');
  process.exit(1);
}

const serviceAccountPath = args[0];

try {
  // Read service account JSON
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  console.log('\n✅ Service account JSON loaded successfully!\n');
  console.log('📋 Please copy these values to your .env.local file:\n');
  console.log('─'.repeat(70));

  // Server-side (Admin SDK) credentials
  console.log('\n# Firebase Admin SDK (Server-side)');
  console.log(`FIREBASE_PROJECT_ID=${serviceAccount.project_id}`);
  console.log(`FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`);
  console.log(`FIREBASE_PRIVATE_KEY="${serviceAccount.private_key}"`);

  console.log('\n─'.repeat(70));
  console.log('\n⚠️  IMPORTANT: You still need to add these from Firebase Console:\n');
  console.log('# Firebase Client SDK (from Firebase Console → Web Config)');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=slow-brief.firebaseapp.com');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=slow-brief');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=slow-brief.appspot.com');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>');

  console.log('\n# Stripe (use test keys for now)');
  console.log('STRIPE_SECRET_KEY=sk_test_...');
  console.log('STRIPE_WEBHOOK_SECRET=whsec_... (can leave as placeholder for now)');
  console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...');
  console.log('STRIPE_MONTHLY_PRICE_ID=price_...');
  console.log('STRIPE_ANNUAL_PRICE_ID=price_...');

  console.log('\n─'.repeat(70));
  console.log('\n📝 Next steps:');
  console.log('  1. Copy the values above to .env.local');
  console.log('  2. Get the NEXT_PUBLIC_* values from Firebase Console');
  console.log('  3. Add Stripe keys (optional for local testing)');
  console.log('  4. Run: npm run dev\n');

} catch (error) {
  console.error('\n❌ Error reading service account file:', error.message);
  console.log('\nMake sure the file path is correct and the file is valid JSON.\n');
  process.exit(1);
}
