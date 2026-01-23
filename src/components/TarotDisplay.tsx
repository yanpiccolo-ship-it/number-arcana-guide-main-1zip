import { getTarotCard } from '@/lib/tarot';
import { Language, translations } from '@/lib/translations';
import { Sparkles } from 'lucide-react';

interface TarotDisplayProps {
  number: number;
  language: Language;
}

export const TarotDisplay = ({ number, language }: TarotDisplayProps) => {
  const card = getTarotCard(number);
  const t = translations[language];
  
  if (!card) return null;

  return (
    <div className="mt-4 tarot-card p-4 text-primary-foreground">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wider opacity-80">{t.tarotCard}</span>
      </div>
      <p className="font-serif text-lg font-medium mb-1">{card.name[language]}</p>
      <p className="text-sm opacity-90">{card.description[language]}</p>
    </div>
  );
};
