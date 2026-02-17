import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Shield, FileText } from 'lucide-react';
import { useAppSettings, getSettingNumber } from '@/hooks/useAppSettings';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Language, translations } from '@/lib/translations';

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: settings } = useAppSettings();
  
  // Get language from state or default to 'es'
  const [language, setLanguage] = React.useState<Language>((location.state?.language as Language) || 'es');
  const t = translations[language];

  const tiers = [
    {
      id: 'informe_completo',
      name: t.fullReportTitle || 'Informe Numerológico Completo',
      price: 59.99,
      description: t.fullReportDescription || 'El mapa más detallado de tu alma',
      features: [
        'Camino de Vida y Propósito',
        'Alma y Personalidad',
        'Ciclos de Vida, Pináculos y Desafíos',
        'Compatibilidad Energética',
        'Numerología Financiera y Espiritual',
        'Proyección de 12 meses',
        'Plan de Alineación Personalizado',
        'Mini guía de 30 días',
        'PDF de 40-60 páginas'
      ],
      icon: <FileText className="w-6 h-6 text-amber-600" />,
      color: 'border-amber-200 shadow-sm',
      footerNote: t.fullReportDelivery || '💡 Forma de entrega: Una vez confirmado tu pago, recibirás el Informe Numerológico Completo en el email que registraste. La entrega se realiza de forma manual, generalmente en minutos.'
    },
    {
      id: 'esencia',
      name: 'Plan Personal Inteligente',
      price: 0,
      description: 'Claridad y dirección mensual',
      features: ['Plan estratégico PDF', 'Calendario semanal', 'Ejercicios prácticos', 'Activador mental', 'Informe evolutivo'],
      icon: <Zap className="w-6 h-6 text-gray-400" />,
      color: 'border-gray-200'
    },
    {
      id: 'accion',
      name: 'Sistema de Acción Continua',
      price: getSettingNumber(settings, 'tier_accion_price', 29),
      description: 'Estructura y disciplina semanal',
      features: ['Todo lo del Plan Personal', 'Foco semanal', 'Plan de acción 5 pasos', 'Desbloqueo mental', 'Mini-reporte', 'Hoja de implementación'],
      icon: <Shield className="w-6 h-6 text-gray-400" />,
      color: 'border-gray-200',
      period: '/ mes'
    },
    {
      id: 'maestria',
      name: 'Plan Profesional',
      price: getSettingNumber(settings, 'tier_maestria_price', 99),
      description: 'Para Coaches y Consultores',
      features: ['Plan mensual estratégico', 'Seguimiento semanal', 'Lecturas personalizadas', 'Cursos y material extra', 'Sistema de Booking', 'Panel profesional'],
      icon: <Sparkles className="w-6 h-6 text-gray-400" />,
      color: 'border-gray-200',
      period: '/ mes'
    }
  ];

  const handlePurchase = (tierId: string) => {
    if (tierId === 'esencia') {
      navigate('/auth?mode=signup');
      return;
    }
    
    const paymentLinks: Record<string, string> = {
      'accion': 'https://buy.stripe.com/test_accion_monthly',
      'maestria': 'https://buy.stripe.com/test_maestria_monthly',
      'informe_completo': 'https://revolut.me/yanpiccolo'
    };

    const checkoutUrl = paymentLinks[tierId];
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    } else {
      alert('Configuración de pago en proceso. Contacte al administrador.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto flex justify-end mb-8">
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`flex flex-col transition-all duration-300 hover:shadow-lg border rounded-xl overflow-hidden ${tier.color}`}
          >
            <CardHeader className="pb-4">
              <div className="mb-2 opacity-80">{tier.icon}</div>
              <CardTitle className="font-serif text-xl leading-tight">{tier.name}</CardTitle>
              <CardDescription className="font-sans text-sm">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
              <div className="text-3xl font-bold mb-4">
                €{tier.price}
                <span className="text-xs font-normal text-gray-500 ml-1"> {tier.period || '/ acceso'}</span>
              </div>
              <ul className="space-y-2.5">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                    <Check className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pb-6">
              <Button 
                onClick={() => handlePurchase(tier.id)}
                className={`w-full py-5 text-sm transition-all duration-300 font-medium rounded-lg ${
                  tier.id === 'informe_completo' 
                    ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-black shadow-sm' 
                    : 'bg-black hover:bg-gray-900 text-white'
                }`}
              >
                {tier.id === 'esencia' ? 'Empezar Gratis' : tier.id === 'informe_completo' ? `Comprar Informe – ${tier.price} €` : 'Suscribirse Ahora'}
              </Button>
              {tier.footerNote && (
                <p className="text-[10px] text-muted-foreground text-center italic leading-relaxed px-1">
                  {tier.footerNote}
                </p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <footer className="mt-16 text-center text-gray-300 font-sans text-xs">
        Design by Brand Agency
      </footer>
    </div>
  );
};

export default Pricing;
