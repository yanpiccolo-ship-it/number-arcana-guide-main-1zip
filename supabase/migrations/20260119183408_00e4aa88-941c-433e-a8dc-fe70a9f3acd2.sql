-- ============================================
-- APP CONTENT TABLE - Stores all dynamic text
-- ============================================
CREATE TABLE public.app_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL CHECK (content_type IN ('ui_label', 'number_meaning', 'cta_text', 'step_text', 'tarot_meaning')),
  language TEXT NOT NULL DEFAULT 'en',
  content_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_key, language)
);

-- Enable RLS
ALTER TABLE public.app_content ENABLE ROW LEVEL SECURITY;

-- Public read access (content is publicly viewable)
CREATE POLICY "Anyone can read app content"
  ON public.app_content
  FOR SELECT
  USING (true);

-- Create role enum for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Admin-only write access to app_content
CREATE POLICY "Admins can insert app content"
  ON public.app_content
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update app content"
  ON public.app_content
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete app content"
  ON public.app_content
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_app_content_updated_at
  BEFORE UPDATE ON public.app_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_app_content_key_lang ON public.app_content(content_key, language);
CREATE INDEX idx_app_content_type ON public.app_content(content_type);