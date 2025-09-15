'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Search, Download, Filter, Calendar, FileText, CheckCircle, XCircle, Clock, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockPaymentService } from '../../../interfaces/api/__mocks__/mockPaymentService';
import { useAuth } from '../../../contexts/AuthContext';

const statusVariants = {
  completed: { text: 'Completado', bg: 'bg-green-100 text-green-800', icon: CheckCircle },
  refunded: { text: 'Reembolsado', bg: 'bg-red-100 text-red-800', icon: Clock },
  pending: { text: 'Pendiente', bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
  failed: { text: 'Fallido', bg: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function PaymentHistoryEnhanced() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
    loadPayments();
  };

  // Cargar datos de pagos
  const loadPayments = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        status: filter,
        search: searchTerm,
        dateFrom,
        dateTo,
        sortBy: sortConfig.key,
        sortDirection: sortConfig.direction,
        page: currentPage,
        limit: itemsPerPage
      };
      
      const result = await mockPaymentService.getPaymentHistory(user.email, filters);
      
      if (result.success) {
        setPayments(result.data.payments);
        setSummary(result.data.summary);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || 'Error al cargar el historial de pagos');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta de nuevo.');
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadPayments();
  }, [user, currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      loadPayments();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filter, dateFrom, dateTo]);

  // Funciones de manejo
  async function handleDownloadInvoice(paymentId) {
    try {
      const result = await mockPaymentService.downloadInvoice(user.email, paymentId);
      if (result.success) {
        // Simular descarga
        const link = document.createElement('a');
        link.href = result.data.url;
        link.download = result.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Mostrar notificación de éxito
        alert('Factura descargada exitosamente');
      } else {
        alert(result.error || 'Error al descargar la factura');
      }
    } catch (error) {
      alert('Error de conexión al descargar la factura');
    }
  }

  async function handleDownloadReceipt(paymentId) {
    try {
      const result = await mockPaymentService.downloadReceipt(user.email, paymentId);
      if (result.success) {
        // Simular descarga
        const link = document.createElement('a');
        link.href = result.data.url;
        link.download = result.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Recibo descargado exitosamente');
      } else {
        alert(result.error || 'Error al descargar el recibo');
      }
    } catch (error) {
      alert('Error de conexión al descargar el recibo');
    }
  }

  async function handleExport() {
    try {
      const filters = {
        status: filter,
        search: searchTerm,
        dateFrom,
        dateTo
      };
      
      const result = await mockPaymentService.exportPaymentHistory(user.email, 'csv', filters);
      if (result.success) {
        // Simular descarga
        const link = document.createElement('a');
        link.href = result.data.url;
        link.download = result.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Historial exportado exitosamente');
      } else {
        alert(result.error || 'Error al exportar el historial');
      }
    } catch (error) {
      alert('Error de conexión al exportar el historial');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
          <p className="text-gray-600">Revisa tus transacciones y facturas</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleExport}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={loadPayments}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Total Gastado</CardDescription>
            <CardTitle className="text-2xl">
              {loading ? '...' : `$${summary?.totalSpent?.toFixed(2) || '0.00'}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">Pagos completados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Transacciones</CardDescription>
            <CardTitle className="text-2xl">
              {loading ? '...' : summary?.totalTransactions || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">Total de transacciones</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Pendientes</CardDescription>
            <CardTitle className="text-2xl">
              {loading ? '...' : summary?.pendingTransactions || 0}
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
              {loading ? '...' : summary?.refundedTransactions || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600">Ver detalles</p>
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
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Fecha desde"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Fecha hasta"
                />
              </div>
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white border rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Cargando transacciones...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payments.length > 0 ? (
                  payments.map((payment) => {
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
                          <div className="flex space-x-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8"
                              onClick={() => handleDownloadInvoice(payment.id)}
                              disabled={!payment.invoiceUrl}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Factura
                            </Button>
                            {payment.receiptUrl && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8"
                                onClick={() => handleDownloadReceipt(payment.id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Recibo
                              </Button>
                            )}
                          </div>
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
        
        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} transacciones
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrevPage || loading}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 py-1 text-sm">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNextPage || loading}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
