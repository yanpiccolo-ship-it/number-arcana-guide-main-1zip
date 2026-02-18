import { useNavigate } from 'react-router-dom';
import { Language, translations } from '@/lib/translations';
import { AppContent } from '@/hooks/useAppContent';
import { AppSetting } from '@/hooks/useAppSettings';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PremiumUpsellProps {
  language: Language;
  dynamicContent?: AppContent[];
  settings?: AppSetting[];
}

export const PremiumUpsell = ({ language, dynamicContent, settings }: PremiumUpsellProps) => {
  const navigate = useNavigate();
  const t = translations[language];
  
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-amber-100 shadow-xl p-8 max-w-4xl mx-auto my-12 overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            {t.premiumTitle}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t.premiumDescription}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
              <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>{t.premiumFeature1}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
              <Check className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>{t.premiumFeature2}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            <Button 
              size="lg" 
              onClick={() => navigate('/pricing', { state: { language } })}
              className="bg-black hover:bg-gray-900 text-white px-8 py-6 rounded-lg font-bold transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              {t.buyFullReport}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
