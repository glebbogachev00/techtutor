-- Add new columns to portfolio_items table
-- Run this in Supabase SQL Editor

ALTER TABLE portfolio_items
  ADD COLUMN IF NOT EXISTS video_link TEXT,
  ADD COLUMN IF NOT EXISTS download_link TEXT,
  ADD COLUMN IF NOT EXISTS image_link TEXT;

-- The project_link column should already exist

-- Update any existing items to ensure they have null values for new columns
UPDATE portfolio_items
SET
  video_link = NULL,
  download_link = NULL,
  image_link = NULL
WHERE video_link IS NULL OR download_link IS NULL OR image_link IS NULL;
