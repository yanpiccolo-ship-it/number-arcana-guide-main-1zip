import { useState } from 'react';
import { Copy, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useLicenses, useCreateLicense, useUpdateLicenseStatus, useDeleteLicense } from '@/hooks/useLicenses';

export const LicensesPanel = () => {
  const [newDomain, setNewDomain] = useState('');
  const { data: licenses, isLoading } = useLicenses();
  const createLicense = useCreateLicense();
  const updateStatus = useUpdateLicenseStatus();
  const deleteLicense = useDeleteLicense();

  const handleCreate = async () => {
    if (!newDomain.trim()) {
      toast({ title: 'Error', description: 'Ingresa un dominio válido', variant: 'destructive' });
      return;
    }

    try {
      await createLicense.mutateAsync(newDomain.trim().toLowerCase());
      setNewDomain('');
      toast({ title: 'Licencia creada', description: `Dominio ${newDomain} autorizado` });
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message?.includes('duplicate') ? 'El dominio ya existe' : error.message, 
        variant: 'destructive' 
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast({ title: 'Estado actualizado', description: `Licencia ${newStatus === 'active' ? 'activada' : 'desactivada'}` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLicense.mutateAsync(id);
      toast({ title: 'Licencia eliminada' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado', description: 'Código de licencia copiado al portapapeles' });
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando licencias...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Nuevo Dominio
          </CardTitle>
          <CardDescription>
            Ingresa el dominio que deseas autorizar (ej: midominio.com)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="ejemplo.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={createLicense.isPending}>
              {createLicense.isPending ? 'Creando...' : 'Crear Licencia'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dominios Autorizados</CardTitle>
          <CardDescription>
            Gestiona las licencias de dominio para tu aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dominio</TableHead>
                <TableHead>Código de Licencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses?.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">{license.domain}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {license.license_code.substring(0, 12)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(license.license_code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={license.status === 'active' ? 'default' : 'secondary'}>
                      {license.status === 'active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(license.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(license.id, license.status)}
                        title={license.status === 'active' ? 'Desactivar' : 'Activar'}
                      >
                        {license.status === 'active' ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(license.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!licenses || licenses.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No hay licencias registradas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
