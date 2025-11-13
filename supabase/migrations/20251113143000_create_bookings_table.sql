/*
  # Create Bookings Table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key, auto-generated)
      - `property_id` (uuid, foreign key to properties)
      - `user_id` (uuid, foreign key to auth.users)
      - `check_in` (date, required) - Check-in date
      - `check_out` (date, required) - Check-out date
      - `guests` (integer, required) - Number of guests
      - `nights` (integer, required) - Number of nights
      - `total_cost` (decimal, required) - Total booking cost
      - `status` (text, default 'confirmed') - 'confirmed', 'pending', 'checked-in', 'checked-out', 'cancelled'
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `bookings` table
    - Policy for authenticated users to insert their own bookings
    - Policy for users to view their own bookings
    - Policy for property owners to view bookings for their properties
    - Policy for users to update/cancel their own bookings
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL CHECK (guests >= 1),
  nights integer NOT NULL CHECK (nights >= 1),
  total_cost decimal(10, 2) NOT NULL CHECK (total_cost >= 0),
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'checked-in', 'checked-out', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own bookings
CREATE POLICY "Users can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Property owners can view bookings for their properties
CREATE POLICY "Owners can view property bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Policy: Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete/cancel their own bookings
CREATE POLICY "Users can delete own bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();
