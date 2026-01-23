import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LicenseStatus {
  isValid: boolean;
  isLoading: boolean;
  domain: string;
}

export const useLicenseCheck = (): LicenseStatus => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const domain = window.location.hostname;

  useEffect(() => {
    const checkLicense = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('licenses')
          .select('id, status')
          .eq('domain', domain)
          .eq('status', 'active')
          .maybeSingle();

        if (error) {
          console.error('License check error:', error);
          setIsValid(false);
        } else {
          setIsValid(data !== null);
        }
      } catch (err) {
        console.error('License check failed:', err);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLicense();
  }, [domain]);

  return { isValid, isLoading, domain };
};
