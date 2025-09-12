import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Search, Download, Filter, Calendar, FileText, CheckCircle, XCircle, Clock, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data for payment history
const paymentHistory = [
  {
    id: 'INV-001',
    date: new Date(2025, 7, 15),
    description: 'Curso de Desarrollo Web',
    amount: 99.99,
    status: 'completed',
    paymentMethod: 'Tarjeta de crédito',
    invoiceUrl: '#',
  },
  {
    id: 'INV-002',
    date: new Date(2025, 6, 22),
    description: 'Curso de React Avanzado',
    amount: 149.99,
    status: 'completed',
    paymentMethod: 'PayPal',
    invoiceUrl: '#',
  },
  {
    id: 'INV-003',
    date: new Date(2025, 5, 10),
    description: 'Membresía Premium',
    amount: 29.99,
    status: 'refunded',
    paymentMethod: 'Tarjeta de débito',
    invoiceUrl: '#',
  },
  {
    id: 'INV-004',
    date: new Date(2025, 4, 5),
    description: 'Curso de Node.js',
    amount: 79.99,
    status: 'completed',
    paymentMethod: 'Tarjeta de crédito',
    invoiceUrl: '#',
  },
  {
    id: 'INV-005',
    date: new Date(2025, 3, 18),
    description: 'Curso de Diseño UX/UI',
    amount: 119.99,
    status: 'pending',
    paymentMethod: 'Transferencia bancaria',
    invoiceUrl: '#',
  },
];

const statusVariants = {
  completed: { text: 'Completado', bg: 'bg-green-100 text-green-800', icon: CheckCircle },
  refunded: { text: 'Reembolsado', bg: 'bg-blue-100 text-blue-800', icon: Clock },
  pending: { text: 'Pendiente', bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
  failed: { text: 'Fallido', bg: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredPayments = paymentHistory
    .filter(payment => {
      const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || payment.status === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const totalSpent = paymentHistory
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
          <p className="text-gray-600">Revisa tus transacciones y facturas</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Total Gastado</CardDescription>
            <CardTitle className="text-2xl">${totalSpent.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">+5.2% respecto al mes pasado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Cursos Comprados</CardDescription>
            <CardTitle className="text-2xl">{paymentHistory.filter(p => p.status === 'completed').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">+2 cursos este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Pendientes</CardDescription>
            <CardTitle className="text-2xl">
              {paymentHistory.filter(p => p.status === 'pending').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600">Revisar pagos pendientes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Reembolsos</CardDescription>
            <CardTitle className="text-2xl">
              {paymentHistory.filter(p => p.status === 'refunded').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">Ver detalles</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar facturas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="completed">Completados</option>
                  <option value="pending">Pendientes</option>
                  <option value="refunded">Reembolsados</option>
                  <option value="failed">Fallidos</option>
                </select>
                <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center">
                      Fecha
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center">
                      Monto
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Método de pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => {
                    const StatusIcon = statusVariants[payment.status].icon;
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          {format(payment.date, 'PPP', { locale: es })}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariants[payment.status].bg}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusVariants[payment.status].text}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <FileText className="h-4 w-4 mr-1" />
                            Factura
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron transacciones que coincidan con tu búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}