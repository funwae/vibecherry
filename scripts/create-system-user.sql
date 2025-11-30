-- Create System User for Seeding
-- Run this in Supabase SQL Editor BEFORE running seed scripts
-- This creates a system user that can own seeded specs

-- Option 1: Create via Supabase Auth Admin API (recommended)
-- Use the Supabase Dashboard > Authentication > Users > Add User
-- Email: system@vibecherry.local
-- Password: (generate a secure password, you won't need it)
-- Then get the user ID and use it below

-- Option 2: If you already have a user, use their ID
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users

-- Insert system profile (replace YOUR_USER_ID_HERE with actual UUID)
INSERT INTO profiles (id, username, display_name, acidentiton_seed, is_pro)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID from auth.users
  'vibecherry',
  'VibeCherry',
  'vibecherry-system',
  true
)
ON CONFLICT (id) DO UPDATE
SET username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    is_pro = true;

-- Alternative: If you want to allow system user without auth.users reference
-- You'll need to modify the profiles table constraint first:
-- ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
-- Then you can use any UUID for the system user

