const { test } = require('node:test');
const assert = require('node:assert/strict');
const { replaceReferences } = require('./migrate-storage');

test('rewrites nested content and history, including preview URLs without a project query', () => {
  const base = 'https://sgp.cloud.appwrite.io/v1/storage/buckets/assets/files/photo';
  const input = { image: `${base}/view?project=portfolio`, history: [{ thumbnail: `${base}/preview` }], text: 'Uses Appwrite for another project', count: 2 };
  assert.deepEqual(replaceReferences(input, { 'assets/photo': 'https://store.public.blob.vercel-storage.com/photo.png' }), {
    image: 'https://store.public.blob.vercel-storage.com/photo.png',
    history: [{ thumbnail: 'https://store.public.blob.vercel-storage.com/photo.png' }],
    text: input.text, count: 2,
  });
  assert.equal(input.image, `${base}/view?project=portfolio`);
});

test('fails closed on unknown file IDs instead of silently leaving broken references', () => {
  assert.throws(() => replaceReferences('https://sgp.cloud.appwrite.io/v1/storage/buckets/assets/files/missing/download', {}), /Unmapped file reference/);
});

test('only clears a document when explicitly deferred', () => {
  assert.equal(replaceReferences('https://sgp.cloud.appwrite.io/v1/storage/buckets/docs/files/resume/view?project=portfolio', { 'docs/resume': '' }), '');
  assert.equal(replaceReferences(null, {}), null);
});
