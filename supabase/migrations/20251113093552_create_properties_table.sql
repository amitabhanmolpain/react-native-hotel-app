/*
  # Create Properties Table

  1. New Tables
    - `properties`
      - `id` (uuid, primary key, auto-generated)
      - `owner_id` (uuid, foreign key to auth.users)
      - `name` (text, required) - Property name
      - `description` (text) - Property description
      - `type` (text, required) - 'hotel' or 'house'
      - `price` (decimal, required) - Price per night
      - `location` (text, required) - Full address
      - `city` (text, required) - City
      - `state` (text, required) - State
      - `bedrooms` (integer) - Number of bedrooms
      - `bathrooms` (integer) - Number of bathrooms
      - `guests` (integer) - Maximum guests
      - `amenities` (text) - Comma-separated amenities
      - `images` (jsonb) - Array of image URLs
      - `status` (text, default 'available') - 'available', 'occupied', 'maintenance'
      - `rating` (decimal, default 0) - Average rating
      - `reviews` (integer, default 0) - Number of reviews
      - `featured` (boolean, default false) - Is featured property
      - `total_rooms` (integer) - For hotels only
      - `square_feet` (integer) - For houses only
      - `year_built` (integer) - For houses only
      - `parking` (text) - Parking information
      - `garden` (boolean) - Has garden (for houses)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `properties` table
    - Policy for authenticated users to insert their own properties
    - Policy for everyone to read available properties
    - Policy for owners to update/delete their properties
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('hotel', 'house')),
  price decimal(10, 2) NOT NULL CHECK (price >= 0),
  location text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  bedrooms integer CHECK (bedrooms >= 0),
  bathrooms integer CHECK (bathrooms >= 0),
  guests integer CHECK (guests >= 0),
  amenities text,
  images jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  rating decimal(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews integer DEFAULT 0 CHECK (reviews >= 0),
  featured boolean DEFAULT false,
  total_rooms integer CHECK (total_rooms >= 0),
  square_feet integer CHECK (square_feet >= 0),
  year_built integer CHECK (year_built >= 1800 AND year_built <= EXTRACT(YEAR FROM CURRENT_DATE)),
  parking text,
  garden boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available properties
CREATE POLICY "Anyone can view available properties"
  ON properties
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert their own properties
CREATE POLICY "Users can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Property owners can update their properties
CREATE POLICY "Owners can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Property owners can delete their properties
CREATE POLICY "Owners can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_properties_updated_at();