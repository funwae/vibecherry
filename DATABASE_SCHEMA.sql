-- 🍒 VibeCher Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  acidentiton_seed TEXT NOT NULL, -- For generating consistent avatar
  acidentiton_colors JSONB, -- Custom color palette
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Usage limits
  specs_generated_this_month INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_expires_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Specs table
CREATE TABLE specs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Core data
  title TEXT NOT NULL,
  description TEXT,
  spec_type TEXT NOT NULL, -- 'markdown' or 'json'
  content TEXT NOT NULL, -- The actual MD or JSON spec
  
  -- Metadata
  category TEXT NOT NULL, -- 'landing-page', 'saas-dashboard', 'api-docs', etc.
  difficulty TEXT NOT NULL, -- 'weekend', 'production', 'enterprise'
  tags TEXT[], -- ['react', 'tailwind', 'dashboard']
  vibe TEXT, -- 'minimal', 'playful', 'corporate', 'experimental'
  
  -- Engagement
  upvote_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  remix_count INTEGER DEFAULT 0, -- How many times it's been used as a base
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Screenshot
  screenshot_url TEXT,
  screenshot_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED
);

-- Index for full text search
CREATE INDEX specs_search_idx ON specs USING GIN (search_vector);

-- Indexes for common queries
CREATE INDEX specs_created_by_idx ON specs(created_by);
CREATE INDEX specs_category_idx ON specs(category);
CREATE INDEX specs_difficulty_idx ON specs(difficulty);
CREATE INDEX specs_created_at_idx ON specs(created_at DESC);
CREATE INDEX specs_upvote_count_idx ON specs(upvote_count DESC);
CREATE INDEX specs_public_featured_idx ON specs(is_public, is_featured);

-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX collections_created_by_idx ON collections(created_by);

-- Collection specs (many-to-many)
CREATE TABLE collection_specs (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  spec_id UUID NOT NULL REFERENCES specs(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (collection_id, spec_id)
);

-- Upvotes table
CREATE TABLE upvotes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spec_id UUID NOT NULL REFERENCES specs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, spec_id)
);

CREATE INDEX upvotes_spec_id_idx ON upvotes(spec_id);
CREATE INDEX upvotes_user_id_idx ON upvotes(user_id);

-- Renders queue table (for screenshot generation)
CREATE TABLE renders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spec_id UUID NOT NULL REFERENCES specs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX renders_spec_id_idx ON renders(spec_id);
CREATE INDEX renders_status_idx ON renders(status);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specs_updated_at BEFORE UPDATE ON specs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle upvote toggling
CREATE OR REPLACE FUNCTION toggle_upvote(p_user_id UUID, p_spec_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Check if upvote exists
  SELECT EXISTS(SELECT 1 FROM upvotes WHERE user_id = p_user_id AND spec_id = p_spec_id)
  INTO v_exists;
  
  IF v_exists THEN
    -- Remove upvote
    DELETE FROM upvotes WHERE user_id = p_user_id AND spec_id = p_spec_id;
    UPDATE specs SET upvote_count = upvote_count - 1 WHERE id = p_spec_id;
    RETURN FALSE;
  ELSE
    -- Add upvote
    INSERT INTO upvotes (user_id, spec_id) VALUES (p_user_id, p_spec_id);
    UPDATE specs SET upvote_count = upvote_count + 1 WHERE id = p_spec_id;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(p_spec_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE specs SET download_count = download_count + 1 WHERE id = p_spec_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE renders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Specs policies
CREATE POLICY "Public specs are viewable by everyone"
  ON specs FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create specs"
  ON specs FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own specs"
  ON specs FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own specs"
  ON specs FOR DELETE
  USING (auth.uid() = created_by);

-- Collections policies
CREATE POLICY "Public collections are viewable by everyone"
  ON collections FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  USING (auth.uid() = created_by);

-- Collection specs policies
CREATE POLICY "Collection specs viewable if collection is viewable"
  ON collection_specs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_id
      AND (is_public = true OR created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage own collection specs"
  ON collection_specs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_id
      AND created_by = auth.uid()
    )
  );

-- Upvotes policies
CREATE POLICY "Upvotes are viewable by everyone"
  ON upvotes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own upvotes"
  ON upvotes FOR ALL
  USING (auth.uid() = user_id);

-- Renders policies (admin only, managed via service role)
CREATE POLICY "Renders viewable by spec owner"
  ON renders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM specs
      WHERE id = spec_id
      AND created_by = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for screenshots
-- Run this in Supabase Dashboard > Storage
-- Name: spec-screenshots
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/png

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Create a system user for featured specs
-- INSERT INTO profiles (id, username, display_name, acidentiton_seed)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   'vibecherry',
--   'VibeCher Team',
--   'cherry-official'
-- );
