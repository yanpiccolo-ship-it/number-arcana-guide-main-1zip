import { useNavigate } from 'react-router-dom';
import { Language } from '@/lib/translations';
import { AppContent } from '@/hooks/useAppContent';
import { AppSetting } from '@/hooks/useAppSettings';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PremiumUpsellProps {
  language: Language;
  dynamicContent?: AppContent[];
  settings?: AppSetting[];
}

export const PremiumUpsell = ({ language, dynamicContent, settings }: PremiumUpsellProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#800020]/10 to-amber-50 border border-[#800020]/20 text-center fade-in">
      <Sparkles className="w-8 h-8 mx-auto mb-4 text-[#800020]" />
      <h3 className="font-serif text-xl mb-2">Desbloquea tu Potencial Completo</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Obtén acceso a la Maestría: Desafíos Kármicos, Sueño Secreto, meditaciones personalizadas e IA ilimitada.
      </p>
      <Button 
        onClick={() => navigate('/pricing')}
        className="bg-[#800020] hover:bg-[#600018] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
      >
        Ver Planes de Membresía
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
