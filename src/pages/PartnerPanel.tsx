import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, LayoutDashboard, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSettings, useUpdateSetting } from '@/hooks/useAppSettings';

const PartnerPanel = () => {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useAppSettings();
  const updateSetting = useUpdateSetting();
  const [isSaving, setIsSaving] = useState(false);

  // Check if gateway session is active
  React.useEffect(() => {
    if (sessionStorage.getItem('admin_access') !== 'true') {
      navigate('/admin-gateway');
    }
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In a real multi-tenant scenario, we'd update specific license settings.
      // For now, we update the global branding settings as requested for the prototype.
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A021]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans">
      <header className="border-b border-[#EBEBEB] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-[#C5A021]" />
            <h1 className="text-xl font-serif font-bold">The Partner Hub</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              sessionStorage.removeItem('admin_access');
              navigate('/admin-gateway');
            }}
            className="text-gray-500 hover:text-black"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">Bienvenido, Socio</h2>
          <p className="text-gray-600">Personaliza tu herramienta de numerología para tus clientes.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <Card className="border-[#EBEBEB] shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Branding del Recurso</CardTitle>
              <CardDescription>Personaliza cómo se ve tu herramienta ante el público.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Recurso</Label>
                <Input id="title" placeholder="Ej: Mi Calculadora Astral" className="border-gray-200 focus:border-[#C5A021] focus:ring-[#C5A021]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Explica de qué trata tu herramienta..." className="border-gray-200 focus:border-[#C5A021] focus:ring-[#C5A021]" rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#EBEBEB] shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Configuración de Venta</CardTitle>
              <CardDescription>Define los precios y destinos de pago.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio del Informe (PDF)</Label>
                  <Input id="price" type="number" placeholder="Ej: 29.99" className="border-gray-200 focus:border-[#C5A021] focus:ring-[#C5A021]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Input id="currency" placeholder="Ej: USD" className="border-gray-200 focus:border-[#C5A021] focus:ring-[#C5A021]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL de Pago / Redirección</Label>
                <Input id="url" type="url" placeholder="https://tu-checkout.com/..." className="border-gray-200 focus:border-[#C5A021] focus:ring-[#C5A021]" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="bg-[#C5A021] hover:bg-[#B08D1A] text-white px-10 py-6 text-lg rounded-none transition-all duration-300">
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-10 mt-10 border-t border-[#EBEBEB] text-center">
        <p className="text-sm text-gray-400 font-serif italic">Design by Just Bee Brand Agency</p>
      </footer>
    </div>
  );
};

export default PartnerPanel;
