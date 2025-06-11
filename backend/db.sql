-- Drop existing tables if they exist
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    last_logout TIMESTAMP WITH TIME ZONE
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'generic',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON datasets(type);

-- Insert demo datasets
INSERT INTO datasets (user_id, name, data, type, is_public, created_at)
VALUES 
(NULL, 'Sales Performance 2024', 
'[{"month":"Jan","sales":1200,"revenue":15000,"profit":3000},
  {"month":"Feb","sales":1900,"revenue":23000,"profit":4600},
  {"month":"Mar","sales":3000,"revenue":35000,"profit":7000},
  {"month":"Apr","sales":5000,"revenue":58000,"profit":11600},
  {"month":"May","sales":4200,"revenue":48000,"profit":9600},
  {"month":"Jun","sales":3800,"revenue":42000,"profit":8400}]'::jsonb, 
'time_series', true, NOW()),

(NULL, 'Market Share by Category',
'[{"category":"Electronics","value":35,"growth":12},
  {"category":"Clothing","value":25,"growth":8},
  {"category":"Books","value":15,"growth":-2},
  {"category":"Home & Garden","value":15,"growth":15},
  {"category":"Sports","value":10,"growth":5}]'::jsonb,
'categorical', true, NOW()),

(NULL, 'Website Traffic Analytics',
'[{"date":"2024-01-01","visitors":1250,"pageViews":3200,"bounceRate":0.35},
  {"date":"2024-01-02","visitors":1180,"pageViews":2950,"bounceRate":0.42},
  {"date":"2024-01-03","visitors":1420,"pageViews":3800,"bounceRate":0.28},
  {"date":"2024-01-04","visitors":1650,"pageViews":4200,"bounceRate":0.31},
  {"date":"2024-01-05","visitors":1890,"pageViews":4850,"bounceRate":0.25},
  {"date":"2024-01-06","visitors":2100,"pageViews":5400,"bounceRate":0.22},
  {"date":"2024-01-07","visitors":1950,"pageViews":5100,"bounceRate":0.29}]'::jsonb,
'time_series', true, NOW())
ON CONFLICT DO NOTHING;