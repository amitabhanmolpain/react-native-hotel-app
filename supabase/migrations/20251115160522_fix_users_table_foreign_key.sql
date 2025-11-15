/*
  # Fix Users Table Foreign Key Constraint
  
  1. Changes
    - Drop the incorrect self-referencing foreign key constraint
    - Add correct foreign key to auth.users table
  
  2. Security
    - Maintain existing RLS policies
*/

-- Drop the incorrect foreign key constraint
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Add the correct foreign key constraint to auth.users
ALTER TABLE public.users 
ADD CONSTRAINT users_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
