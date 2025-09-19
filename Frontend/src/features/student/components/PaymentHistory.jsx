import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  Search,
  Download,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for payment history
const paymentHistory = [
  {
    id: "INV-001",
    date: new Date(2025, 7, 15),
    description: "Curso de Desarrollo Web",
    amount: 99.99,
    status: "completed",
    paymentMethod: "Tarjeta de crédito",
    invoiceUrl: "#",
  },
  {
    id: "INV-002",
    date: new Date(2025, 6, 22),
    description: "Curso de React Avanzado",
    amount: 149.99,
    status: "completed",
    paymentMethod: "PayPal",
    invoiceUrl: "#",
  },
  {
    id: "INV-003",
    date: new Date(2025, 5, 10),
    description: "Membresía Premium",
    amount: 29.99,
    status: "refunded",
    paymentMethod: "Tarjeta de débito",
    invoiceUrl: "#",
  },
  {
    id: "INV-004",
    date: new Date(2025, 4, 5),
    description: "Curso de Node.js",
    amount: 79.99,
    status: "completed",
    paymentMethod: "Tarjeta de crédito",
    invoiceUrl: "#",
  },
  {
    id: "INV-005",
    date: new Date(2025, 3, 18),
    description: "Curso de Python",
    amount: 89.99,
    status: "pending",
    paymentMethod: "Transferencia bancaria",
    invoiceUrl: "#",
  },
];

const statusVariants = {
  completed: {
    text: "Completado",
    bg: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  refunded: { text: "Reembolsado", bg: "bg-red-100 text-red-800", icon: Clock },
  pending: {
    text: "Pendiente",
    bg: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  failed: { text: "Fallido", bg: "bg-red-100 text-red-800", icon: XCircle },
};

export default function PaymentHistory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
    loadPayments();
  };

  // Cargar datos de pagos
  const loadPayments = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);

      // Simular carga de datos
      setTimeout(() => {
        const filteredPayments = paymentHistory.filter((payment) => {
          const matchesSearch =
            payment.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter = filter === "all" || payment.status === filter;
          return matchesSearch && matchesFilter;
        });

        // Aplicar ordenamiento
        const sortedPayments = filteredPayments.sort((a, b) => {
          const { key, direction } = sortConfig;
          let aValue = a[key];
          let bValue = b[key];

          if (key === "date") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }

          if (direction === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        // Simular paginación
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPayments = sortedPayments.slice(startIndex, endIndex);

        setPayments(paginatedPayments);
        setSummary({
          totalSpent: sortedPayments.reduce(
            (sum, p) => (p.status === "completed" ? sum + p.amount : sum),
            0
          ),
          totalTransactions: sortedPayments.length,
          pendingTransactions: sortedPayments.filter(
            (p) => p.status === "pending"
          ).length,
          refundedTransactions: sortedPayments.filter(
            (p) => p.status === "refunded"
          ).length,
        });
        setPagination({
          currentPage,
          totalPages: Math.ceil(sortedPayments.length / itemsPerPage),
          totalItems: sortedPayments.length,
          itemsPerPage,
          hasPrevPage: currentPage > 1,
          hasNextPage:
            currentPage < Math.ceil(sortedPayments.length / itemsPerPage),
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Error de conexión. Por favor, intenta de nuevo.");
      console.error("Error loading payments:", err);
      setLoading(false);
    }
  }, [user?.email, searchTerm, filter, currentPage, itemsPerPage, sortConfig]);

  // Efectos
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filter, dateFrom, dateTo]);

  // Funciones de manejo
  async function handleDownloadInvoice(paymentId) {
    try {
      // Simular descarga
      const link = document.createElement("a");
      link.href = "#";
      link.download = `factura-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Factura descargada exitosamente");
    } catch (error) {
      alert("Error de conexión al descargar la factura");
      console.error("Error downloading invoice:", error);
    }
  }

  async function handleDownloadReceipt(paymentId) {
    try {
      // Simular descarga
      const link = document.createElement("a");
      link.href = "#";
      link.download = `recibo-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Recibo descargado exitosamente");
    } catch (error) {
      alert("Error de conexión al descargar el recibo");
      console.error("Error downloading receipt:", error);
    }
  }

  async function handleExport() {
    try {
      // Simular exportación
      const link = document.createElement("a");
      link.href = "#";
      link.download = "historial-pagos.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Historial exportado exitosamente");
    } catch (error) {
      alert("Error de conexión al exportar el historial");
      console.error("Error exporting payment history:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Historial de Pagos
          </h1>
          <p className="text-gray-600">Revisa tus transacciones y facturas</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleExport}
            disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button
            variant="outline"
            className="flex items-center"
            onClick={loadPayments}
            disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm">Total Gastado</CardDescription>
            <CardTitle className="text-2xl">
              {loading
                ? "..."
                : `$${summary?.totalSpent?.toFixed(2) || "0.00"}`}
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
              {loading ? "..." : summary?.totalTransactions || 0}
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
              {loading ? "..." : summary?.pendingTransactions || 0}
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
              {loading ? "..." : summary?.refundedTransactions || 0}
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
                  className="appearance-none bg-white border rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
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
                  <TableHead
                    className="w-[100px] cursor-pointer"
                    onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Fecha
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("amount")}>
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
                        <TableCell className="font-medium">
                          {payment.id}
                        </TableCell>
                        <TableCell>
                          {format(payment.date, "PPP", { locale: es })}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusVariants[payment.status].bg
                            }`}>
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
                              disabled={!payment.invoiceUrl}>
                              <FileText className="h-4 w-4 mr-1" />
                              Factura
                            </Button>
                            {payment.receiptUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() =>
                                  handleDownloadReceipt(payment.id)
                                }>
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
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500">
                      No se encontraron transacciones que coincidan con tu
                      búsqueda.
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
              Mostrando{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} a{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              de {pagination.totalItems} transacciones
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrevPage || loading}>
                Anterior
              </Button>
              <span className="flex items-center px-3 py-1 text-sm">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(pagination.totalPages, prev + 1)
                  )
                }
                disabled={!pagination.hasNextPage || loading}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
