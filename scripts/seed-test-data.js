#!/usr/bin/env node

/**
 * Seed Firestore with test brief data
 * Usage: node scripts/seed-test-data.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function seedTestBrief() {
  console.log('\n🌱 Seeding test data to Firestore...\n');

  try {
    // Create a test brief
    const briefData = {
      slug: 'testing-slow-brief-paywall',
      headline: 'Testing the Slow Brief Paywall',
      freeHtml: `
        <p>This is the <strong>free section</strong> of the test brief. Everyone can read this part, regardless of subscription status.</p>
        <p>The free section typically contains 120-180 words that establish credibility and provide enough context to understand why this matters.</p>
        <p>Source: <a href="https://example.com" target="_blank">Example News Source</a></p>
      `.trim(),
      paidHtml: `
        <p>This is the <strong>paid section</strong>. Only subscribers should see this content.</p>
        <p><strong>Deeper context:</strong> This section provides the historical, structural, and conceptual context that helps readers truly understand what's happening beyond the headlines.</p>
        <h3>What to ignore today</h3>
        <p>The noise. The outrage. The endless feed of content designed to capture your attention without adding understanding.</p>
        <h3>Something slower</h3>
        <p>For deeper reading: <a href="https://example.com/essay" target="_blank">An essay on the decline of deliberate attention</a> - This explores why scarcity and judgment matter more than volume.</p>
      `.trim(),
      publishDate: admin.firestore.Timestamp.now(),
      status: 'published',
    };

    const docRef = await db.collection('briefs').add(briefData);
    console.log('✅ Test brief created successfully!');
    console.log(`   Document ID: ${docRef.id}`);
    console.log(`   Slug: ${briefData.slug}`);
    console.log(`   URL: http://localhost:3000/briefs/${briefData.slug}\n`);

    // Create another brief for archive testing
    const archiveBriefData = {
      slug: 'collective-memory-vs-algorithmic-feed',
      headline: 'Collective memory vs algorithmic feed',
      freeHtml: `
        <p>In earlier decades, people disagreed fiercely — but often about the same events and facts. Today, disagreement increasingly begins earlier: at what is even seen or acknowledged. Algorithmic feeds have fragmented attention itself.</p>
        <p>What matters is not polarization alone, but the erosion of shared reference points that make disagreement meaningful.</p>
        <p>Source: <a href="https://example.com/fragmentation" target="_blank">The Fragmentation of Collective Attention</a></p>
      `.trim(),
      paidHtml: `
        <p>Shared reference points do not require consensus — only overlap. Historically, newspapers and broadcast schedules created this overlap by default. Today, it must be created deliberately. Personalization solves relevance but destroys collectivity.</p>
        <h3>What to ignore today</h3>
        <p>Calls for better personalization algorithms. The problem is not insufficient optimization — it's optimization itself.</p>
        <h3>Something slower</h3>
        <p><a href="https://example.com/mass-culture" target="_blank">Essay on the decline of mass culture</a> - Why shared cultural moments matter more than personalized feeds.</p>
      `.trim(),
      publishDate: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      ),
      status: 'published',
    };

    const archiveDocRef = await db.collection('briefs').add(archiveBriefData);
    console.log('✅ Archive brief created successfully!');
    console.log(`   Document ID: ${archiveDocRef.id}`);
    console.log(`   Slug: ${archiveBriefData.slug}`);
    console.log(`   URL: http://localhost:3000/briefs/${archiveBriefData.slug}\n`);

    console.log('─'.repeat(70));
    console.log('\n🎉 Test data seeded successfully!\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open: http://localhost:3000');
    console.log('  3. Navigate to /archive to see both briefs');
    console.log('  4. Click on a brief to test the paywall\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding data:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedTestBrief();
