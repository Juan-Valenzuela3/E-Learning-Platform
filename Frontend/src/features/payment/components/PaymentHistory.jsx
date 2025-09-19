// Frontend/src/features/student/components/PaymentHistory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Badge } from "@/ui/badge";
import {
  Search,
  Download,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  BookOpen,
  Eye,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from 'sonner';
import PaymentService from '@/services/paymentService';
import { useAuth } from '@/contexts/useAuth';

const statusConfig = {
  COMPLETED: {
    text: 'Completado',
    bg: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  PENDING: {
    text: 'Pendiente',
    bg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    color: 'text-yellow-600'
  },
  FAILED: {
    text: 'Fallido',
    bg: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    color: 'text-red-600'
  },
  REFUNDED: {
    text: 'Reembolsado',
    bg: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: RefreshCw,
    color: 'text-blue-600'
  }
};

const PaymentHistory = () => {
  const { user } = useAuth();

  // Estados principales
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Estados de paginación y ordenamiento
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // === FUNCIONES DE CARGA DE DATOS ===

  const loadPaymentData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar historial con filtros
      const filters = {
        status: statusFilter,
        dateFrom,
        dateTo,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      };

      const [historyResult, statsResult] = await Promise.all([
        PaymentService.getPaymentHistory(user.id, filters),
        PaymentService.getPaymentStatistics(user.id)
      ]);

      if (historyResult.success) {
        setPayments(historyResult.payments || []);
        setTotalPages(historyResult.pagination?.totalPages || 1);
      } else {
        throw new Error(historyResult.error);
      }

      if (statsResult.success) {
        setStatistics(statsResult.data);
      }

    } catch (err) {
      console.error('❌ Error cargando datos de pagos:', err);
      setError(err.message || 'Error al cargar el historial de pagos');
      toast.error('Error al cargar el historial de pagos');
    } finally {
      setLoading(false);
    }
  }, [user?.id, statusFilter, dateFrom, dateTo, currentPage, searchTerm]);

  // === EFECTOS ===

  useEffect(() => {
    loadPaymentData();
  }, [loadPaymentData]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter, dateFrom, dateTo]);

  // === FUNCIONES DE MANEJO ===

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleDownloadInvoice = async (paymentId) => {
    try {
      await PaymentService.downloadInvoice(paymentId);
    } catch (error) {
      toast.error('Error al descargar la factura');
    }
  };

  const handleExportHistory = async (format = 'csv') => {
    try {
      await PaymentService.exportPaymentHistory(user.id, format);
    } catch (error) {
      toast.error('Error al exportar el historial');
    }
  };

  const handleRefresh = () => {
    loadPaymentData();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  // === FUNCIONES DE FORMATO ===

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return isValid(date) ? format(date, 'dd/MM/yyyy HH:mm', { locale: es }) : 'Fecha inválida';
    } catch {
      return 'Fecha inválida';
    }
  };

  // === COMPONENTES DE ESTADÍSTICAS ===

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "text-gray-600" }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 text-sm">
          <Icon className={`w-4 h-4 ${color}`} />
          {title}
        </CardDescription>
        <CardTitle className="text-2xl font-bold">
          {loading ? '...' : value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-xs ${color}`}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );

  // === RENDERIZADO ===

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Historial de Pagos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus transacciones y descargas facturas
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => handleExportHistory('csv')}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gastado"
          value={formatCurrency(statistics?.totalSpent)}
          subtitle="En cursos completados"
          icon={DollarSign}
          color="text-green-600"
        />
        <StatCard
          title="Transacciones"
          value={statistics?.totalTransactions || 0}
          subtitle="Total de transacciones"
          icon={TrendingUp}
          color="text-blue-600"
        />
        <StatCard
          title="Cursos Adquiridos"
          value={statistics?.coursesOwned || 0}
          subtitle="Cursos en tu biblioteca"
          icon={BookOpen}
          color="text-purple-600"
        />
        <StatCard
          title="Promedio por Compra"
          value={formatCurrency(statistics?.averagePayment)}
          subtitle="Gasto promedio"
          icon={TrendingUp}
          color="text-orange-600"
        />
      </div>

      {/* Tabla principal */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por curso o ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Fecha desde"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Fecha hasta"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todos los estados</option>
                <option value="COMPLETED">Completados</option>
                <option value="PENDING">Pendientes</option>
                <option value="FAILED">Fallidos</option>
                <option value="REFUNDED">Reembolsados</option>
              </select>
              {(searchTerm || statusFilter !== 'all' || dateFrom || dateTo) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      ID
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Fecha
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-2">
                      Monto
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Cargando transacciones...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payments.length > 0 ? (
                  payments.map((payment) => {
                    const status = statusConfig[payment.status] || statusConfig.PENDING;
                    const StatusIcon = status.icon;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          #{payment.id}
                        </TableCell>
                        <TableCell>
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {payment.course?.title || 'Curso no disponible'}
                            </div>
                            {payment.course?.instructor && (
                              <div className="text-sm text-gray-500">
                                Por {payment.course.instructor.userName} {payment.course.instructor.lastName}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={status.bg}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.text}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDownloadInvoice(payment.id)}
                                disabled={payment.status !== 'COMPLETED'}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Descargar factura
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                        <p>No tienes transacciones aún</p>
                        <p className="text-sm">
                          Cuando compres un curso, aparecerá aquí tu historial
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentHistory;