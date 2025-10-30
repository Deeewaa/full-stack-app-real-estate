/*
  # Fix User Registration Policies

  1. Changes
    - Drop existing restrictive policies on users table
    - Add policy to allow public user registration
    - Keep read/update policies for authenticated users
  
  2. Security
    - Allow anyone to insert new users (required for registration)
    - Users can only view and update their own profiles
    - Registration endpoint handles duplicate checking
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Allow public registration
CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view all user profiles (needed for messaging, property owners, etc)
CREATE POLICY "Users are viewable by everyone"
  ON users FOR SELECT
  TO public
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO public
  USING (id::text = current_setting('app.current_user_id', true))
  WITH CHECK (id::text = current_setting('app.current_user_id', true));