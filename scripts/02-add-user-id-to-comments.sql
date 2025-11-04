-- Add user_id to blog_comments if not exists
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update existing comments to have a default user_id (optional, for migration)
-- This is just for reference - you may want to handle this differently
