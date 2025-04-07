/*
  # Update project_details RLS policies

  1. Security Changes
    - Drop existing RLS policies
    - Add new RLS policies for:
      - Public read access to all rows
      - Only authenticated users can insert/update/delete data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to manage data" ON project_details;
DROP POLICY IF EXISTS "Allow public read access" ON project_details;
DROP POLICY IF EXISTS "Allow authenticated users to insert and update" ON project_details;

-- Create new policies
CREATE POLICY "Allow public read access"
ON project_details
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to insert"
ON project_details
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update"
ON project_details
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete"
ON project_details
FOR DELETE
TO authenticated
USING (true);