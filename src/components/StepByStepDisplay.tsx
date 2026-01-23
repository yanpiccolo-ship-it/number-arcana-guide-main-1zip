import { NumerologyResult } from '@/lib/numerology';
import { Language, translations } from '@/lib/translations';

interface StepByStepDisplayProps {
  result: NumerologyResult;
  language: Language;
  type: 'letters' | 'vowels' | 'consonants' | 'personal';
}

export const StepByStepDisplay = ({ result, language, type }: StepByStepDisplayProps) => {
  const t = translations[language];
  
  const getLabel = () => {
    switch (type) {
      case 'letters': return t.letterValues;
      case 'vowels': return t.vowelValues;
      case 'consonants': return t.consonantValues;
      case 'personal': return t.stepByStep;
    }
  };

  return (
    <div className="mt-4 p-4 bg-secondary/30 rounded-lg space-y-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {t.stepByStep}
      </p>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{getLabel()}:</p>
        <div className="flex flex-wrap gap-1.5">
          {result.steps.map((step, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded text-sm"
            >
              <span className="font-medium">{step.letter}</span>
              <span className="text-muted-foreground">=</span>
              <span className="gold-accent font-semibold">{step.value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border/50">
        <p className="text-sm">
          <span className="text-muted-foreground">{t.sum}: </span>
          <span className="font-medium">{result.intermediateSum}</span>
        </p>
        
        {result.reductionSteps.length > 1 && (
          <p className="text-sm mt-1">
            <span className="text-muted-foreground">{t.reduceTo}: </span>
            <span className="font-medium">
              {result.reductionSteps.slice(1).map((step, idx) => (
                <span key={idx}>
                  {idx > 0 && ' → '}
                  {step}
                </span>
              ))}
            </span>
          </p>
        )}
        
        <p className="text-sm mt-1">
          <span className="text-muted-foreground">{t.finalNumber}: </span>
          <span className="gold-accent font-bold text-lg">{result.finalNumber}</span>
        </p>
      </div>
    </div>
  );
};
