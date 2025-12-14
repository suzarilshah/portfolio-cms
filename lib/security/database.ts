import { Pool, PoolClient } from 'pg';

export interface DatabaseConfig {
  connectionString: string;
  ssl?: boolean;
  maxConnections?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export class SecureDatabase {
  private pool: Pool;
  private static instance: SecureDatabase;

  private constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      connectionString: config.connectionString,
      ssl: config.ssl ?? true,
      max: config.maxConnections ?? 20,
      idleTimeoutMillis: config.idleTimeoutMillis ?? 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis ?? 10000,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Database pool error:', err);
    });
  }

  public static getInstance(config?: DatabaseConfig): SecureDatabase {
    if (!SecureDatabase.instance) {
      if (!config) {
        throw new Error('Database configuration required for first initialization');
      }
      SecureDatabase.instance = new SecureDatabase(config);
    }
    return SecureDatabase.instance;
  }

  public async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    
    try {
      // Validate query to prevent SQL injection
      this.validateQuery(text);
      
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private validateQuery(query: string): void {
    // Basic SQL injection protection
    const dangerousPatterns = [
      /drop\s+table/i,
      /delete\s+from\s+\w+\s+where\s+1\s*=\s*1/i,
      /union\s+select/i,
      /exec\s*\(/i,
      /script\s*>/i,
      /--/,
      /\/\*/,
      /\*\//
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(query)) {
        throw new Error('Potentially dangerous SQL query detected');
      }
    }

    // Ensure parameterized queries for user input
    const hasPlaceholders = /\$\d+/.test(query) || query.includes('?');
    if (!hasPlaceholders && /select|insert|update|delete/i.test(query)) {
      throw new Error('All SQL queries must use parameterized queries. Query without parameters detected.');
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Get pool stats
  public getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }
}

// SQL query builder with parameterization
export class QueryBuilder {
  private query: string = '';
  private params: any[] = [];
  private paramIndex: number = 1;

  select(columns: string): this {
    this.query = `SELECT ${columns}`;
    return this;
  }

  from(table: string): this {
    this.validateIdentifier(table);
    this.query += ` FROM ${table}`;
    return this;
  }

  where(condition: string, value?: any): this {
    this.query += ` WHERE ${condition}`;
    if (value !== undefined) {
      this.params.push(value);
      this.query = this.query.replace('?', `$${this.paramIndex++}`);
    }
    return this;
  }

  insert(table: string, data: Record<string, any>): this {
    this.validateIdentifier(table);
    
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    this.query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
    this.params.push(...values);
    
    // Replace placeholders with PostgreSQL syntax
    for (let i = 0; i < this.params.length; i++) {
      this.query = this.query.replace('?', `$${i + 1}`);
    }
    
    return this;
  }

  update(table: string, data: Record<string, any>): this {
    this.validateIdentifier(table);
    
    const columns = Object.keys(data);
    const values = Object.values(data);
    
    this.query = `UPDATE ${table} SET ${columns.map(col => `${col} = ?`).join(', ')}`;
    this.params.push(...values);
    
    // Replace placeholders with PostgreSQL syntax
    for (let i = 0; i < this.params.length; i++) {
      this.query = this.query.replace('?', `$${i + 1}`);
    }
    
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.validateIdentifier(column);
    this.query += ` ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): this {
    this.query += ` LIMIT ${count}`;
    return this;
  }

  build(): { query: string; params: any[] } {
    return {
      query: this.query,
      params: [...this.params]
    };
  }

  private validateIdentifier(identifier: string): void {
    if (!/^[a-zA-Z0-9_-]+$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
  }
}

// Initialize secure database instance
export const secureDb = SecureDatabase.getInstance({
  connectionString: process.env.DATABASE_URL!,
  ssl: true,
  maxConnections: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});
