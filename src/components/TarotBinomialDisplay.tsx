import { getTarotCard, tarotCards } from '@/lib/tarot';
import { Language, translations } from '@/lib/translations';
import { reduceForTarot } from '@/lib/numerology';
import { Sparkles } from 'lucide-react';

interface TarotBinomialDisplayProps {
  number: number;
  language: Language;
}

export const TarotBinomialDisplay = ({ number, language }: TarotBinomialDisplayProps) => {
  const t = translations[language];
  const { masterNumber, reducedNumber } = reduceForTarot(number);
  
  // Get the primary card (always from reduced number for Tarot)
  const primaryCard = getTarotCard(reducedNumber);
  
  // For master numbers, get both cards for the binomial
  const masterCard = masterNumber ? getTarotCard(masterNumber) : null;
  
  if (!primaryCard) return null;

  // If we have a master number, show binomial format
  if (masterNumber && masterCard) {
    return (
      <div className="mt-4 tarot-card p-4 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider opacity-80">
            {t.tarotCard} - Binomio Arquetípico
          </span>
        </div>
        
        {/* Binomial Display */}
        <div className="space-y-3">
          {/* Master Card */}
          <div className="border-b border-white/20 pb-3">
            <p className="font-serif text-lg font-medium">
              {masterCard.name[language]} ({masterNumber})
            </p>
            <p className="text-sm opacity-90">{masterCard.description[language]}</p>
          </div>
          
          {/* Reduced Card */}
          <div>
            <p className="font-serif text-lg font-medium">
              {primaryCard.name[language]} ({reducedNumber})
            </p>
            <p className="text-sm opacity-90">{primaryCard.description[language]}</p>
          </div>
        </div>
        
        <p className="text-xs opacity-70 mt-3 italic">
          El arquetipo {masterNumber} se complementa con su par {reducedNumber} para revelar la dualidad de tu camino.
        </p>
      </div>
    );
  }

  // Regular single card display
  return (
    <div className="mt-4 tarot-card p-4 text-primary-foreground">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider opacity-80">{t.tarotCard}</span>
      </div>
      <p className="font-serif text-lg font-medium mb-1">{primaryCard.name[language]}</p>
      <p className="text-sm opacity-90">{primaryCard.description[language]}</p>
    </div>
  );
};
