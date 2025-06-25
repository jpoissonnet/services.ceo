-- Update clientId to reference developers table
ALTER TABLE service DROP CONSTRAINT IF EXISTS service_client_id_fkey;
ALTER TABLE service ADD CONSTRAINT service_client_id_fkey FOREIGN KEY (client_id) REFERENCES developer(id);

