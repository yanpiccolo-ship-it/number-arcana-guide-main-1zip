import { ShieldX, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccessDeniedProps {
  domain: string;
}

export const AccessDenied = ({ domain }: AccessDeniedProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-background to-red-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-500/50 bg-card/90 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-red-500/20">
            <ShieldX className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-400">Acceso Denegado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium">Dominio no autorizado</span>
          </div>
          <p className="text-muted-foreground">
            El dominio <strong className="text-foreground">{domain}</strong> no tiene una licencia activa para esta aplicación.
          </p>
          <p className="text-sm text-muted-foreground">
            Contacte al administrador para obtener una licencia válida.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
