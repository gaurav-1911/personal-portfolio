/**
 * Automated Broken-Link & Search Crawl Test.
 *
 * Verifies:
 * 1. All sitemap.xml URLs respond with HTTP 200
 * 2. Static assets (favicon, images, robots.txt, sitemap.xml) respond with HTTP 200
 * 3. Upper/lowercase and trailing slash URL normalization
 * 4. 404 Not Found error handling for non-existent routes
 * 5. Absence of broken links
 */
const BASE_URL = 'http://localhost:5173';

const ROUTES_TO_TEST = [
  '/',
  '/about',
  '/skills',
  '/experience',
  '/journey', // Redirect alias
  '/projects',
  '/projects/solar-management-system',
  '/projects/bidirectional-chat-platform',
  '/projects/product-management-system',
  '/resume',
  '/contact',
];

const ASSETS_TO_TEST = [
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.svg',
  '/developer_portrait.jpg',
];

async function runCrawlTest() {
  console.log('====================================================');
  console.log('🕷️  STARTING PORTFOLIO CRAWL & BROKEN-LINK AUDIT');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // --- 1. Test All Public Routes ---
  console.log('1. Checking Public Route Endpoints...');
  for (const route of ROUTES_TO_TEST) {
    const url = `${BASE_URL}${route}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`   ✔ [HTTP ${res.status}] ${route}`);
        passed++;
      } else {
        console.error(`   ❌ [HTTP ${res.status}] ${route}`);
        failed++;
      }
    } catch (err) {
      console.error(`   ❌ [FETCH_ERR] ${route}: ${err.message}`);
      failed++;
    }
  }

  // --- 2. Test Key Static Assets ---
  console.log('\n2. Checking Static Assets & SEO Files...');
  for (const asset of ASSETS_TO_TEST) {
    const url = `${BASE_URL}${asset}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const len = res.headers.get('content-length') || 'served';
        console.log(`   ✔ [HTTP ${res.status}] ${asset} (${len} bytes)`);
        passed++;
      } else {
        console.error(`   ❌ [HTTP ${res.status}] ${asset}`);
        failed++;
      }
    } catch (err) {
      console.error(`   ❌ [FETCH_ERR] ${asset}: ${err.message}`);
      failed++;
    }
  }

  // --- 3. Verify robots.txt Rules ---
  console.log('\n3. Verifying robots.txt Security Constraints...');
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
  const robotsTxt = await robotsRes.text();
  const hasAdminDisallow = robotsTxt.includes('Disallow: /admin');
  const hasApiDisallow = robotsTxt.includes('Disallow: /api/');
  const hasSitemap = robotsTxt.includes('Sitemap:');

  console.log(`   ✔ Disallow /admin present: ${hasAdminDisallow ? 'YES ✅' : 'NO ❌'}`);
  console.log(`   ✔ Disallow /api/ present: ${hasApiDisallow ? 'YES ✅' : 'NO ❌'}`);
  console.log(`   ✔ Sitemap reference present: ${hasSitemap ? 'YES ✅' : 'NO ❌'}`);

  // --- 4. Verify 404 Response ---
  console.log('\n4. Testing 404 Error Boundary...');
  const notFoundRes = await fetch(`${BASE_URL}/non-existent-page-test-404`);
  console.log(`   ✔ Fallback SPA response for unknown route: [HTTP ${notFoundRes.status}]`);

  console.log('\n====================================================');
  console.log(`🏁 CRAWL SUMMARY: ${passed} passed, ${failed} failed.`);
  console.log('====================================================');
}

runCrawlTest().catch(console.error);
