// src/shared/hooks/useNotifications.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services';

/**
 * Hook personalizado para manejar notificaciones
 * Proporciona queries y mutations para notificaciones
 */
export const useNotifications = (filters = {}) => {
  const queryClient = useQueryClient();

  // Query para obtener notificaciones
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    error: notificationsError,
    refetch: refetchNotifications
  } = useQuery({
    queryKey: ['notifications', 'list', filters],
    queryFn: () => userService.getNotifications(filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
    retry: 2,
    refetchInterval: 30 * 1000 // Refrescar cada 30 segundos
  });

  // Mutation para marcar notificación como leída
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) =>
      userService.markNotificationAsRead(notificationId),
    onSuccess: (data, notificationId) => {
      // Actualizar la notificación específica en el cache
      queryClient.setQueryData(['notifications', 'list', filters], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          notifications: oldData.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        };
      });
    },
    onError: (error) => {
      console.error('Error al marcar notificación como leída:', error);
    }
  });

  // Mutation para marcar todas las notificaciones como leídas
  const markAllAsReadMutation = useMutation({
    mutationFn: () => userService.markAllNotificationsAsRead(),
    onSuccess: () => {
      // Actualizar todas las notificaciones en el cache
      queryClient.setQueryData(['notifications', 'list', filters], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          notifications: oldData.notifications.map(notification => ({
            ...notification,
            read: true
          }))
        };
      });
    },
    onError: (error) => {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  });

  // Calcular notificaciones no leídas
  const unreadCount = notificationsData?.notifications?.filter(
    notification => !notification.read
  ).length || 0;

  return {
    // Datos
    notifications: notificationsData?.notifications || [],
    pagination: notificationsData?.pagination,
    unreadCount,

    // Estados de carga
    isLoadingNotifications,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    // Errores
    notificationsError,
    markAsReadError: markAsReadMutation.error,
    markAllAsReadError: markAllAsReadMutation.error,

    // Mutations
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,

    // Utilidades
    refetchNotifications
  };
};

/**
 * Hook para obtener estadísticas de notificaciones
 */
export const useNotificationStats = () => {
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2
  });

  return {
    stats: statsData?.stats,
    isLoadingStats,
    statsError
  };
};
