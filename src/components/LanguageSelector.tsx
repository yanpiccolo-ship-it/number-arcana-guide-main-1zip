import { Language, languageNames } from '@/lib/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageSelector = ({ language, onLanguageChange, className }: LanguageSelectorProps) => {
  return (
    <Select value={language} onValueChange={(value) => onLanguageChange(value as Language)}>
      <SelectTrigger className={`w-[140px] bg-white/50 backdrop-blur-sm border-border/50 text-sm font-medium shadow-sm rounded-lg ${className}`}>
        <Globe className="w-4 h-4 mr-2 opacity-60" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languageNames).map(([code, name]) => (
          <SelectItem key={code} value={code} className="text-sm">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
