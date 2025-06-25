-- Create service table for storing steps as services
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS service (
  id text NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  developer_id text REFERENCES developer(id)
);

