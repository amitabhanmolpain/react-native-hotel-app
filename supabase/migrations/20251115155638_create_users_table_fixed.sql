/*
  # Create Users Table with Correct Constraints
  
  1. New Tables
    - `users` table to store user profile information
      - `id` (uuid, primary key) - references auth.users
      - `name` (text) - user's full name
      - `email` (text, unique) - user's email address
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
