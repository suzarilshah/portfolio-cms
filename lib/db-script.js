const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env.local manually since we are in a script
const envPath = path.join(__dirname, '..', '.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/^DATABASE_URL=['"]?([^'"\n]+)['"]?/m);
  if (match) {
    databaseUrl = match[1];
  }
}

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

module.exports = pool;
