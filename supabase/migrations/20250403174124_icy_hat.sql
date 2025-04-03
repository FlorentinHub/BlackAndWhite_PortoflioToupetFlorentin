/*
  # Create project details tables

  1. New Tables
    - `project_details`
      - `id` (uuid, primary key)
      - `repo_name` (text, unique)
      - `images` (text array)
      - `languages` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `project_details` table
    - Add policies for authenticated users to manage their data
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS project_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_name text UNIQUE NOT NULL,
  images text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE project_details ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON project_details
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage their data
CREATE POLICY "Allow authenticated users to manage data"
  ON project_details
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_project_details_updated_at
  BEFORE UPDATE ON project_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();