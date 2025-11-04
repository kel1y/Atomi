-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user metadata
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update blog_posts table to add photo_url and user_id
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Update team_members table to ensure it has all needed fields
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create admin_users table to track who can manage content
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Blog Posts RLS Policies
CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all blog posts" ON blog_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can create blog posts" ON blog_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can update blog posts" ON blog_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can delete blog posts" ON blog_posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- Team Members RLS Policies
CREATE POLICY "Anyone can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Admins can create team members" ON team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can update team members" ON team_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can delete team members" ON team_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- Blog Comments RLS Policies
CREATE POLICY "Anyone can view approved comments" ON blog_comments FOR SELECT USING (approved = true);
CREATE POLICY "Admins can view all comments" ON blog_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Authenticated users can create comments" ON blog_comments FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);
CREATE POLICY "Admins can approve comments" ON blog_comments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can delete comments" ON blog_comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);

-- Blog Likes RLS Policies
CREATE POLICY "Anyone can view likes" ON blog_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can create likes" ON blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete likes" ON blog_likes FOR DELETE USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team-images', 'team-images', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('blog-images', 'team-images'));
CREATE POLICY "Authenticated users can upload to blog-images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can upload to team-images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'team-images' AND auth.role() = 'authenticated'
);
CREATE POLICY "Admins can delete from blog-images" ON storage.objects FOR DELETE USING (
  bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
CREATE POLICY "Admins can delete from team-images" ON storage.objects FOR DELETE USING (
  bucket_id = 'team-images' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
);
