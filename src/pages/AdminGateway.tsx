import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminGateway = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Dresstyle2026!') {
      sessionStorage.setItem('admin_access', 'true');
      toast.success('Acceso concedido');
      navigate('/admin');
    } else {
      toast.error('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Acceso Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Ingrese la contraseña maestra"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar al Panel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGateway;
