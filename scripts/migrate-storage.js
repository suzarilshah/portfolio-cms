// Run from the repository root. State and database backups stay in ignored .migration/.
require('dotenv').config({ path: process.env.MIGRATION_ENV_FILE || '.env.local', quiet: true });
const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { Pool } = require('pg');
const { put, head, BlobNotFoundError } = require('@vercel/blob');

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const quote = (identifier) => `"${identifier.replace(/"/g, '""')}"`;
const mimeTypes = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', ico: 'image/x-icon',
  svg: 'image/svg+xml', webp: 'image/webp', pdf: 'application/pdf',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const legacyUrlPattern = /https?:\/\/[a-z0-9.-]*appwrite\.io\/v1\/storage\/buckets\/([^/\s"<>]+)\/files\/([^/\s"<>]+)\/(?:view|preview|download)(?:\?[^\s"<>]*)?/gi;

async function verifyAsset(asset) {
  const response = await fetch(asset.url);
  if (!response.ok) throw new Error(`Asset verification failed: ${asset.filename} (${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== asset.size || hash(bytes) !== asset.sha256) {
    throw new Error(`Asset checksum mismatch: ${asset.filename}`);
  }
}

function replaceReferences(value, mapping) {
  if (typeof value === 'string') {
    return value.replace(legacyUrlPattern, (url, bucket, id) => {
      const replacement = mapping[`${bucket}/${id}`];
      if (replacement === undefined) throw new Error(`Unmapped file reference: ${bucket}/${id}`);
      return replacement;
    });
  }
  if (Array.isArray(value)) return value.map(v => replaceReferences(v, mapping));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replaceReferences(v, mapping)]));
  }
  return value;
}

async function main() {
  const mode = process.argv[2] || 'inventory';
  const exportDirectory = path.resolve(process.env.STORAGE_EXPORT_DIR || 'Exported');
  const stateDirectory = path.resolve('.migration');
  await fs.mkdir(stateDirectory, { recursive: true });
  const manifestPath = path.join(stateDirectory, 'assets.json');

  if (mode === 'upload') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is required');
    const assets = [];
    const files = (await fs.readdir(exportDirectory, { withFileTypes: true })).filter(f => f.isFile() && !f.name.startsWith('.'));
    for (const file of files) {
      const bytes = await fs.readFile(path.join(exportDirectory, file.name));
      const sha256 = hash(bytes);
      const contentType = mimeTypes[path.extname(file.name).slice(1).toLowerCase()];
      if (!contentType) throw new Error(`Unsupported export file: ${file.name}`);
      const pathname = `portfolio-assets/migrated/${sha256}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      let blob;
      try {
        blob = await head(pathname);
      } catch (error) {
        if (!(error instanceof BlobNotFoundError)) throw error;
        blob = await put(pathname, bytes, { access: 'public', contentType, addRandomSuffix: false, allowOverwrite: false });
      }
      const asset = { filename: file.name, pathname, url: blob.url, size: bytes.length, sha256, contentType };
      await verifyAsset(asset);
      assets.push(asset);
      await fs.writeFile(manifestPath, JSON.stringify(assets, null, 2), { mode: 0o600 });
      console.log(`Verified ${file.name} (${bytes.length} bytes)`);
    }
    console.log(`${assets.length} exported files migrated and checksum verified.`);
    return;
  }

  if (mode === 'verify') {
    const assets = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    for (const asset of assets) await verifyAsset(asset);
    console.log(`Verified ${assets.length} public assets against original SHA-256 checksums.`);
    return;
  }

  if (!['inventory', 'rewrite'].includes(mode)) throw new Error('Mode must be inventory, upload, verify, or rewrite');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: columns } = await client.query(
      'SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = $1 AND data_type = ANY($2) ORDER BY table_name, ordinal_position',
      ['public', ['text', 'character varying', 'json', 'jsonb']]
    );
    const tables = [...new Set(columns.map(c => c.table_name))];
    let mapping;
    if (mode === 'rewrite') {
      const assets = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
      for (const asset of assets) await verifyAsset(asset);
      const filenames = JSON.parse(await fs.readFile(path.join(stateDirectory, 'reference-map.json'), 'utf8'));
      mapping = Object.fromEntries(Object.entries(filenames).map(([id, filename]) => {
        if (filename === null) return [id, '']; // Explicitly deferred document, preserved in backup.
        const asset = assets.find(a => a.filename === filename);
        if (!asset) throw new Error(`Export file missing for ${id}: ${filename}`);
        return [id, asset.url];
      }));
    }

    const backup = {};
    const updates = [];
    const references = new Set();
    for (const table of tables) {
      const { rows } = await client.query(`SELECT * FROM ${quote(table)}${mode === 'rewrite' ? ' FOR UPDATE' : ''}`);
      const relevantColumns = columns.filter(c => c.table_name === table);
      for (const row of rows) {
        for (const col of relevantColumns) {
          const value = row[col.column_name];
          const serialized = typeof value === 'string' ? value : JSON.stringify(value);
          for (const match of (serialized || '').matchAll(legacyUrlPattern)) {
            references.add(`${match[1]}/${match[2]}`);
          }
          if (mode !== 'rewrite') continue;
          const replacement = replaceReferences(value, mapping);
          if (JSON.stringify(value) !== JSON.stringify(replacement)) {
            if (row.id === undefined) throw new Error(`Cannot update table without id: ${table}`);
            (backup[table] ||= {})[row.id] = row;
            updates.push({ table, id: row.id, column: col.column_name, value: col.data_type.startsWith('json') ? JSON.stringify(replacement) : replacement });
          }
        }
      }
    }
    console.log('Legacy file references:', [...references]);
    if (mode === 'rewrite') {
      // Finish all mapping checks and write rollback data before touching any records.
      const backupPath = path.join(stateDirectory, `database-before-rewrite-${Date.now()}.json`);
      await fs.writeFile(backupPath, JSON.stringify(backup, null, 2), { mode: 0o600 });
      for (const update of updates) {
        await client.query(`UPDATE ${quote(update.table)} SET ${quote(update.column)} = $1 WHERE id = $2`, [update.value, update.id]);
      }
      await client.query('COMMIT');
      console.log(`Rewrote ${updates.length} fields transactionally. Backup: ${backupPath}`);
    } else {
      await client.query('ROLLBACK');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { replaceReferences, verifyAsset };
