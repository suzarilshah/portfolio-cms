-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create default admin user (password: admin123 - change this!)
-- This will only run if the user doesn't already exist
INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES (
  'suzarilshah@gmail.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe', -- admin123
  'Muhammad Suzaril Shah',
  true
) ON CONFLICT (email) DO NOTHING;
