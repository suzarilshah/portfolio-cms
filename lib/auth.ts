import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function verifyAdminToken(cookieStore: any) {
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return null;
    }

    const token = jwt.sign(
      { email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user: { email: user.email, name: user.name }, token };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function createAdminUser(email: string, password: string, name: string) {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    
    await pool.query(
      'INSERT INTO admin_users (email, password_hash, name, is_active, created_at) VALUES ($1, $2, $3, true, NOW()) ON CONFLICT (email) DO UPDATE SET password_hash = $2, name = $3',
      [email, passwordHash, name]
    );

    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
}
