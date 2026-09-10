import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orders';
import type { OrderCreatePayload, OrderStatus } from '../types/order';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (status?: OrderStatus) => [...orderKeys.lists(), status] as const,
  myOrders: () => [...orderKeys.all, 'my-orders'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...orderKeys.details(), id] as const,
};

export function useOrders(status?: OrderStatus, enabled: boolean = true) {
  return useQuery({
    queryKey: orderKeys.list(status),
    queryFn: () => orderService.getOrders(status),
    enabled,
  });
}

export function useMyOrders(enabled: boolean = true) {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: () => orderService.getMyOrders(),
    enabled,
  });
}

export function useOrder(id: number | string, enabled: boolean = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: enabled && !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderCreatePayload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useAssignStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      staffId,
      username,
    }: {
      id: number | string;
      staffId?: number;
      username?: string;
    }) => orderService.assignStaff(id, { staffId, username }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

export function useStaffMembers(enabled: boolean = true) {
  return useQuery({
    queryKey: ['staff-members'],
    queryFn: () => orderService.getStaffMembers(),
    enabled,
  });
}
