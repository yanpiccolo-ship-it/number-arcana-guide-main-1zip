import { NumerologyResult, numberMeanings } from '@/lib/numerology';
import { Language, translations } from '@/lib/translations';
import { TarotDisplay } from './TarotDisplay';

interface BasicResultCardProps {
  title: string;
  description: string;
  result: NumerologyResult;
  language: Language;
  showTarot: boolean;
  delay?: number;
}

export const BasicResultCard = ({
  title,
  description,
  result,
  language,
  showTarot,
  delay = 0,
}: BasicResultCardProps) => {
  const meaning = numberMeanings[result.finalNumber]?.[language] || '';
  
  // Get brief summary (first sentence only)
  const briefSummary = meaning.split('.')[0] + '.';

  return (
    <div
      className="card-elegant slide-up p-4 md:p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <span className="result-number text-4xl md:text-5xl">{result.finalNumber}</span>
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-serif text-lg md:text-xl font-medium text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          
          <p className="text-sm text-foreground/90 leading-relaxed">{briefSummary}</p>
          
          {showTarot && <TarotDisplay number={result.finalNumber} language={language} />}
        </div>
      </div>
    </div>
  );
};
