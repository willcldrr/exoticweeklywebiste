-- Exotics Weekly Database Schema
-- Run this in your Supabase SQL Editor

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('News', 'Reviews', 'Auctions', 'Heritage', 'Motorsport', 'Collecting')),
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_caption TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  source_url TEXT, -- Original source URL for automated content
  source_name TEXT, -- e.g., "Hagerty", "RM Sotheby's"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published stories
CREATE POLICY "Public can view published stories" ON stories
  FOR SELECT
  USING (status = 'published');

-- Policy: Service role can do everything (for n8n automation)
CREATE POLICY "Service role has full access" ON stories
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for published stories (for cleaner queries)
CREATE OR REPLACE VIEW published_stories AS
SELECT * FROM stories WHERE status = 'published' ORDER BY published_at DESC;

-- Optional: Create a view for featured stories
CREATE OR REPLACE VIEW featured_stories AS
SELECT * FROM stories WHERE status = 'published' AND featured = true ORDER BY published_at DESC;

-- Insert sample story (optional - remove if you want to start fresh)
-- INSERT INTO stories (slug, title, subtitle, excerpt, content, author, category, tags, featured, status) VALUES
-- ('welcome-to-exotics-weekly', 'Welcome to Exotics Weekly', 'The beginning of a new chapter in automotive journalism', 'Exotics Weekly launches as the definitive source for exotic car news and analysis.', '<p>Welcome to Exotics Weekly...</p>', 'Editorial Team', 'News', ARRAY['Launch', 'Announcement'], true, 'published');
