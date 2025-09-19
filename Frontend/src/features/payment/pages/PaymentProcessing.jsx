// Frontend/src/features/payment/pages/PaymentProcessing.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/ui/card';
import { Progress } from '@/ui/progress';
import PaymentService from '@/services/paymentService';

const PaymentProcessing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Procesando tu pago...');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      monitorPaymentStatus(sessionIdParam);
    }

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(progressInterval);
  }, [searchParams]);

  const monitorPaymentStatus = async (sessionId) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos máximo

    const checkStatus = async () => {
      try {
        attempts++;

        // Aquí iría la lógica real de verificación del estado
        // const sessionData = await PaymentService.getPaymentSessionById(sessionId);

        // Simular verificación por ahora
        if (attempts < 10) {
          setMessage('Verificando con el banco...');
        } else if (attempts < 20) {
          setMessage('Confirmando transacción...');
        } else {
          setProgress(100);
          setStatus('completed');
          setMessage('¡Pago confirmado!');

          setTimeout(() => {
            navigate('/payment/success');
          }, 1500);
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 1000);
        } else {
          setStatus('timeout');
          setMessage('Tiempo de espera agotado');
          setTimeout(() => {
            navigate('/payment/cancel?error=timeout');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error verificando el pago');
        setTimeout(() => {
          navigate('/payment/cancel?error=verification_failed');
        }, 2000);
      }
    };

    checkStatus();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'timeout':
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
      default:
        return <Clock className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-blue-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={status === 'processing' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6"
            >
              {getStatusIcon()}
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'completed' ? '¡Pago Exitoso!' :
               status === 'error' || status === 'timeout' ? 'Problema con el Pago' :
               'Procesando Pago'}
            </h2>

            <p className="text-gray-600 mb-6">{message}</p>

            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500">{Math.round(progress)}% completado</p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Pago seguro con Stripe</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <CreditCard className="w-4 h-4" />
                <span>Transacción encriptada</span>
              </div>
            </div>

            {status === 'processing' && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-xs text-gray-400"
              >
                Por favor, no cierres esta ventana
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentProcessing;