-- Create licenses table for domain validation
CREATE TABLE public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  license_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active licenses" ON public.licenses
FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage licenses" ON public.licenses
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_licenses_updated_at
BEFORE UPDATE ON public.licenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert current domain as first license (lovable.app preview)
INSERT INTO public.licenses (domain, status) VALUES 
  ('id-preview--08ad4c71-ce50-4896-b910-d40a524312be.lovable.app', 'active'),
  ('number-arcana-guide.lovable.app', 'active'),
  ('localhost', 'active');