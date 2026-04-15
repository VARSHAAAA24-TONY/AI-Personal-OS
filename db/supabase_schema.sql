-- Create tables for AI Personal OS

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3)
);

-- Notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  content JSONB DEFAULT '{}'::jsonb,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- YouTube Summaries table
CREATE TABLE IF NOT EXISTS public.summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_url TEXT NOT NULL,
  video_title TEXT,
  summary TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research Queries table
CREATE TABLE IF NOT EXISTS public.research_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  query TEXT NOT NULL,
  result TEXT,
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_queries ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Notes Policies
CREATE POLICY "Users can view their own notes" ON public.notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);

-- Summaries Policies
CREATE POLICY "Users can view their own summaries" ON public.summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries" ON public.summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Research Policies
CREATE POLICY "Users can view their own research" ON public.research_queries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own research" ON public.research_queries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profile trigger for automatic creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
