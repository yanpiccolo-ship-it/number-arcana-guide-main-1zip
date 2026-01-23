import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all settings using raw SQL query approach since types may not be updated
export const useAppSettings = () => {
  return useQuery({
    queryKey: ['app_settings'],
    queryFn: async () => {
      // Use type assertion since the new table might not be in generated types yet
      const { data, error } = await (supabase as any)
        .from('app_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      return (data || []) as AppSetting[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Update a setting (admin only)
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await (supabase as any)
        .from('app_settings')
        .update({ setting_value: value })
        .eq('setting_key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data as AppSetting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_settings'] });
    },
  });
};

// Helper to get a setting value
export const getSettingValue = (
  settings: AppSetting[] | undefined,
  key: string,
  fallback: string = ''
): string => {
  if (!settings) return fallback;
  const setting = settings.find(s => s.setting_key === key);
  return setting?.setting_value || fallback;
};

// Helper to get setting as boolean
export const getSettingBoolean = (
  settings: AppSetting[] | undefined,
  key: string,
  fallback: boolean = false
): boolean => {
  const value = getSettingValue(settings, key, String(fallback));
  return value === 'true';
};

// Helper to get setting as number
export const getSettingNumber = (
  settings: AppSetting[] | undefined,
  key: string,
  fallback: number = 0
): number => {
  const value = getSettingValue(settings, key, String(fallback));
  return parseFloat(value) || fallback;
};
