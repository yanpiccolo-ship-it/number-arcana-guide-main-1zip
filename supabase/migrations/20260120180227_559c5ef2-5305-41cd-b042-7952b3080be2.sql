-- Drop the incorrect unique constraint on content_key alone
ALTER TABLE public.app_content DROP CONSTRAINT IF EXISTS app_content_content_key_key;

-- The UNIQUE(content_key, language) constraint already exists from initial migration