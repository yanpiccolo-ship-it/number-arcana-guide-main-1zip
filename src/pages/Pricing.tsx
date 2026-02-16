import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';
import { useAppSettings, getSettingNumber } from '@/hooks/useAppSettings';

const Pricing = () => {
  const navigate = useNavigate();
  const { data: settings } = useAppSettings();

  const tiers = [
    {
      id: 'esencia',
      name: 'Esencia',
      price: 0,
      description: 'Diagnóstico Básico',
      features: ['Camino de Vida', 'Personalidad', 'Tarot básico'],
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      color: 'border-blue-200'
    },
    {
      id: 'accion',
      name: 'Acción',
      price: getSettingNumber(settings, 'tier_accion_price', 29),
      description: 'Ejecución y Orientación',
      features: ['5 Números Principales', 'Orientación de Carrera', 'Sincronización Universal'],
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      color: 'border-purple-200',
      period: '/ mes'
    },
    {
      id: 'maestria',
      name: 'Maestría',
      price: getSettingNumber(settings, 'tier_maestria_price', 99),
      description: 'Transformación Total',
      features: ['Desafíos Kármicos (13, 14, 16, 19)', 'Sueño Secreto', 'Meditaciones', 'IA ilimitada'],
      icon: <Sparkles className="w-6 h-6 text-[#800020]" />,
      color: 'border-[#800020]',
      highlight: true,
      period: '/ mes'
    }
  ];

  const handlePurchase = (tierId: string) => {
    if (tierId === 'esencia') {
      navigate('/auth?mode=signup');
      return;
    }
    console.log(`Starting purchase for ${tierId}`);
    
    const paymentLinks: Record<string, string> = {
      'accion': 'https://buy.stripe.com/test_accion_monthly',
      'maestria': 'https://buy.stripe.com/test_maestria_monthly'
    };

    const checkoutUrl = paymentLinks[tierId];
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    } else {
      alert('Configuración de pago en proceso. Contacte al administrador.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Just Bee Selection</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto font-sans">
          Elige el nivel de potencia que tu negocio necesita para escalar con numerología y tecnología de punta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`flex flex-col transition-all duration-300 hover:shadow-xl ${tier.color} ${tier.highlight ? 'ring-2 ring-[#800020] scale-105' : ''}`}
          >
            <CardHeader>
              <div className="mb-4">{tier.icon}</div>
              <CardTitle className="font-serif text-2xl">{tier.name}</CardTitle>
              <CardDescription className="font-sans">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-4xl font-bold mb-6">
                €{tier.price}
                <span className="text-sm font-normal text-gray-500"> {tier.period || '/ acceso'}</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePurchase(tier.id)}
                className={`w-full py-6 text-lg ${tier.highlight ? 'bg-[#800020] hover:bg-[#600018]' : 'bg-black hover:bg-gray-800'}`}
              >
                {tier.id === 'esencia' ? 'Empezar Gratis' : 'Suscribirse Ahora'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <footer className="mt-20 text-center text-gray-400 font-serif italic text-sm">
        Design by Just Bee Brand Agency
      </footer>
    </div>
  );
};

export default Pricing;
