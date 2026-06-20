-- Add a generated tsvector column for full-text search on products
ALTER TABLE "products"
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(extra_attributes::text, '')), 'C')
) STORED;

-- Create a GIN index to make searches fast
CREATE INDEX idx_products_search ON "products" USING GIN (search_vector);