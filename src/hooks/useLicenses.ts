import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface License {
  id: string;
  domain: string;
  license_code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useLicenses = () => {
  return useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('licenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as License[];
    },
  });
};

export const useCreateLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (domain: string) => {
      const { data, error } = await (supabase as any)
        .from('licenses')
        .insert({ domain })
        .select()
        .single();
      
      if (error) throw error;
      return data as License;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    },
  });
};

export const useUpdateLicenseStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await (supabase as any)
        .from('licenses')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as License;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    },
  });
};

export const useDeleteLicense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('licenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    },
  });
};
