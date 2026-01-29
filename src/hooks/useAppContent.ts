import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/lib/translations';

export interface AppContent {
  id: string;
  content_key: string;
  content_type: 'ui_label' | 'number_meaning' | 'cta_text' | 'step_text' | 'tarot_meaning';
  language: string;
  content_value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all content for a specific language
export const useAppContent = (language: Language) => {
  return useQuery({
    queryKey: ['app_content', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_content')
        .select('*')
        .eq('language', language);
      
      if (error) throw error;
      return data as AppContent[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Fetch all content (for admin panel)
export const useAllAppContent = () => {
  return useQuery({
    queryKey: ['app_content', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_content')
        .select('*')
        .order('content_type')
        .order('content_key')
        .order('language');
      
      if (error) throw error;
      return data as AppContent[];
    },
  });
};

// Update content (admin only)
export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, content_value }: { id: string; content_value: string }) => {
      // Usar eq() con id y select() sin single() para evitar errores 406
      const { data, error } = await supabase
        .from('app_content')
        .update({ content_value, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Supabase update content error:', error);
        throw error;
      }
      
      // Retornamos el objeto actualizado
      const updatedData = data?.[0] || { id, content_value };
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_content'] });
    },
  });
};

// Create new content (admin only)
export const useCreateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (content: Omit<AppContent, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('app_content')
        .insert(content)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_content'] });
    },
  });
};

// Delete content (admin only)
export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('app_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_content'] });
    },
  });
};

// Helper to get content value by key
export const getContentValue = (
  content: AppContent[] | undefined,
  key: string,
  fallback: string = ''
): string => {
  if (!content) return fallback;
  const item = content.find(c => c.content_key === key);
  return item?.content_value || fallback;
};

// Helper to get number meaning
export const getNumberMeaning = (
  content: AppContent[] | undefined,
  number: number
): string => {
  if (!content) return '';
  const key = `number_meaning_${number}`;
  const item = content.find(c => c.content_key === key);
  return item?.content_value || '';
};
