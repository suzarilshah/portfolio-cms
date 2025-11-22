import { Pool } from 'pg';

declare global {
  var pool: Pool | undefined;
}

let pool: Pool;

if (!global.pool) {
  global.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}
pool = global.pool;

export default pool;
