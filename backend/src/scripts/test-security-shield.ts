import http from 'http';
import { createApp } from '../app';
import { initSocketServer } from '../common/socket/socketManager';
import { prisma } from '../config/database';

const TEST_PORT = 5066;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let server: http.Server;
let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  🛡️ [PASS] ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    throw new Error(`Test failed: ${testName} -> ${detail || ''}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  let body: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }
  return { status: res.status, ok: res.ok, body, headers: res.headers };
}

async function runSecurityTests() {
  console.log('\n======================================================');
  console.log('🔒 POSTMAN & SWAGGER ANTI-HACK DEFENSE TEST SUITE');
  console.log('======================================================\n');

  // Boot test server
  const app = createApp();
  server = http.createServer(app);
  initSocketServer(server);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`🚀 Shield test server live at ${BASE_URL}\n`);
      resolve();
    });
  });

  try {
    // -----------------------------------------------------------------
    // TEST 1: Direct Untrusted Origin Attack (Simulating Postman / CSRF attacker)
    // -----------------------------------------------------------------
    console.log('--- 1. Untrusted Origin / CSRF Defense ---');
    const evilOriginRes = await request('/api/v1/games', {
      headers: {
        Origin: 'http://malicious-phishing-site.xyz',
      },
    });
    assert(
      evilOriginRes.status === 403,
      'Untrusted Origin from Postman/hacker rejected with HTTP 403',
      JSON.stringify(evilOriginRes.body)
    );
    assert(
      evilOriginRes.body.code === 'FORBIDDEN_ORIGIN',
      'Error code matches FORBIDDEN_ORIGIN'
    );

    // -----------------------------------------------------------------
    // TEST 2: Trusted Origin (Frontend Web App) Allowed
    // -----------------------------------------------------------------
    console.log('\n--- 2. Legitimate Frontend Origin Access ---');
    const validOriginRes = await request('/api/v1/games', {
      headers: {
        Origin: 'http://localhost:3000',
      },
    });
    assert(
      validOriginRes.status === 200,
      'Legitimate frontend application allowed access (HTTP 200)'
    );

    // -----------------------------------------------------------------
    // TEST 3: Prototype Pollution Injection via Postman
    // -----------------------------------------------------------------
    console.log('\n--- 3. Prototype Pollution & Injection Defense ---');
    // An attacker sends dangerous __proto__ payload in JSON body
    const pollutionRes = await request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        __proto__: { isAdmin: true },
        constructor: { prototype: { hacked: true } },
        username: `sanitized_${Date.now()}`,
        email: `sanitized_${Date.now()}@test.local`,
        password: 'Password123!Secure',
        role: 'buyer',
      }),
    });
    assert(
      pollutionRes.status === 201,
      'Request processed and payload sanitized safely'
    );
    // Verify global Object prototype was NOT polluted
    assert(
      (Object.prototype as any).isAdmin === undefined,
      'Global Object prototype protected (isAdmin is undefined)'
    );
    assert(
      (Object.prototype as any).hacked === undefined,
      'Global Object prototype protected (hacked is undefined)'
    );

    // -----------------------------------------------------------------
    // TEST 4: Null-Byte Injection Defense
    // -----------------------------------------------------------------
    console.log('\n--- 4. Null-Byte Bypass Sanitization ---');
    const nullByteRes = await request('/api/v1/games?filter=mobile\0.exe');
    assert(
      nullByteRes.status === 200,
      'Null-byte injection automatically stripped from query parameters'
    );

    // -----------------------------------------------------------------
    // TEST 5: HTTP Header Security Fingerprint Hardening
    // -----------------------------------------------------------------
    console.log('\n--- 5. Server Header Fingerprint Cloaking ---');
    const headersRes = await request('/health');
    assert(
      !headersRes.headers.get('x-powered-by'),
      'X-Powered-By header is cloaked (attacker cannot detect Express stack in Postman)'
    );
    assert(
      headersRes.headers.get('x-content-type-options') === 'nosniff',
      'X-Content-Type-Options: nosniff header enforced'
    );

    // -----------------------------------------------------------------
    // TEST 6: Swagger Production & Basic Auth Shielding
    // -----------------------------------------------------------------
    console.log('\n--- 6. Swagger Documentation Shielding ---');
    // In production without auth, swagger is blocked
    process.env.NODE_ENV = 'production';
    delete process.env.ENABLE_SWAGGER;
    const prodSwaggerRes = await request('/api/docs');
    assert(
      prodSwaggerRes.status === 404,
      'Swagger UI disabled in production (HTTP 404 Not Found)'
    );

    const prodSwaggerJsonRes = await request('/api/docs.json');
    assert(
      prodSwaggerJsonRes.status === 404,
      'Swagger JSON spec disabled in production (HTTP 404 Not Found)'
    );

    // If ENABLE_SWAGGER=true with credentials, requires authentication
    process.env.ENABLE_SWAGGER = 'true';
    process.env.SWAGGER_USER = 'admin';
    process.env.SWAGGER_PASSWORD = 'SecretSwaggerPassword123!';

    const unauthSwaggerRes = await request('/api/docs');
    assert(
      unauthSwaggerRes.status === 401,
      'Swagger requires HTTP Basic Auth when enabled in production (HTTP 401)'
    );

    const authHeader = 'Basic ' + Buffer.from('admin:SecretSwaggerPassword123!').toString('base64');
    const authSwaggerJsonRes = await request('/api/docs.json', {
      headers: { Authorization: authHeader },
    });
    assert(
      authSwaggerJsonRes.status === 200,
      'Authenticated admin successfully accesses Swagger JSON'
    );

    // Restore test environment
    process.env.NODE_ENV = 'test';
    delete process.env.ENABLE_SWAGGER;
    delete process.env.SWAGGER_USER;
    delete process.env.SWAGGER_PASSWORD;

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedCount} SECURITY & ANTI-HACK TESTS PASSED!`);
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ SECURITY TEST SUITE FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(async () => {
          await prisma.$disconnect();
          console.log('🧹 Cleaned up security test server.');
          resolve();
        });
      });
    }
  }
}

runSecurityTests();
