const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { load } = require('cheerio');
const exec = promisify(execFile);
const base = process.argv[2];
if (!base) throw new Error('Usage: node scripts/verify-deployment.js https://deployment-url');

async function request(path, options = {}) {
  if (process.env.USE_VERCEL_CURL === '1') {
    const args = ['curl', path, '--deployment', base, '--scope', 'insanprihatin', '--', '--silent', '--write-out', '\nHTTP_STATUS=%{http_code}'];
    if (options.method) args.push('--request', options.method);
    for (const [key, value] of Object.entries(options.headers || {})) args.push('--header', `${key}: ${value}`);
    if (options.body) args.push('--data', options.body);
    const { stdout } = await exec('vercel', args, { maxBuffer: 5 * 1024 * 1024 });
    const match = stdout.match(/\nHTTP_STATUS=(\d+)$/);
    assert(match, 'Missing HTTP status');
    return { status: Number(match[1]), text: stdout.slice(0, match.index) };
  }
  const response = await fetch(new URL(path, base), { ...options, redirect: 'manual' });
  return { status: response.status, text: await response.text() };
}

async function main() {
  const home = await request('/');
  assert.equal(home.status, 200, 'Homepage must render');
  assert(!/https?:[^\s"<>]*appwrite\.io/i.test(home.text), 'Homepage still references old storage');
  const $ = load(home.text);
  assert($('title').text().includes('Suzaril'), 'Missing portfolio metadata');
  const assets = new Set();
  $('img[src], link[rel="icon"], meta[name="twitter:image"]').each((_, el) => {
    const url = $(el).attr('src') || $(el).attr('href') || $(el).attr('content');
    if (url?.includes('.public.blob.vercel-storage.com')) assets.add(url);
  });
  assert(assets.size >= 3, 'Expected migrated profile, favicon, and social-preview images');
  for (const url of assets) {
    const response = await fetch(url, { method: 'HEAD' });
    assert.equal(response.status, 200, `Asset unavailable: ${url}`);
    assert(response.headers.get('content-type')?.startsWith('image/'), 'Asset MIME type must be an image');
  }
  console.log(`Homepage and ${assets.size} referenced Blob images are healthy.`);

  for (const path of ['/api/cms/projects', '/api/cms/settings', '/sitemap.xml', '/robots.txt', '/handler/sign-in', '/opengraph-image']) {
    const response = await request(path);
    assert.equal(response.status, 200, `${path} must respond successfully`);
    if (path.startsWith('/api/cms/')) assert(!response.text.includes('cloud.appwrite.io'), `${path} still references old storage`);
    if (path === '/api/cms/projects') {
      const projects = JSON.parse(response.text);
      assert(Array.isArray(projects), 'Projects API must return an array');
      for (const project of projects.filter(p => p.thumbnail_url)) {
        const image = await fetch(project.thumbnail_url, { method: 'HEAD' });
        assert.equal(image.status, 200, `${project.title} thumbnail must load`);
      }
    }
    console.log(`${path}: ${response.status}`);
  }

  const upload = await request('/api/upload', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: new URL(base).origin },
    body: JSON.stringify({ type: 'blob.generate-client-token', payload: { pathname: 'portfolio-assets/test.png', multipart: false } }),
  });
  assert.equal(upload.status, 401, 'Anonymous clients must not receive upload tokens');
  const callback = await request('/api/upload', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'blob.upload-completed', payload: {} }),
  });
  assert.equal(callback.status, 400, 'Unsigned callbacks must be rejected');
  console.log('Anonymous token issuance and unsigned callbacks are rejected.');
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
