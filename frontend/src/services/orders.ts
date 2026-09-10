import { api } from './api';
import type { Order, OrderListItem, OrderCreatePayload, OrderStatus } from '../types/order';

export interface StaffMember {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
}

export const orderService = {
  async getOrders(status?: OrderStatus): Promise<OrderListItem[]> {
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    const response = await api.get<OrderListItem[]>('/orders/', { params });
    return response.data;
  },

  async getMyOrders(): Promise<OrderListItem[]> {
    const response = await api.get<OrderListItem[]>('/orders/my_orders/');
    return response.data;
  },

  async getOrder(id: number | string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}/`);
    return response.data;
  },

  async createOrder(payload: OrderCreatePayload): Promise<Order> {
    const response = await api.post<Order>('/orders/', payload);
    return response.data;
  },

  async updateOrderStatus(id: number | string, status: OrderStatus): Promise<Order> {
    const response = await api.post<Order>(`/orders/${id}/update_status/`, { status });
    return response.data;
  },

  async assignStaff(
    id: number | string,
    params: { staffId?: number; username?: string } | number
  ): Promise<Order> {
    const payload =
      typeof params === 'number'
        ? { staff_id: params }
        : { staff_id: params.staffId, username: params.username };
    const response = await api.post<Order>(`/orders/${id}/assign_staff/`, payload);
    return response.data;
  },

  async getStaffMembers(): Promise<StaffMember[]> {
    const response = await api.get<StaffMember[]>('/orders/staff_members/');
    return response.data;
  },
};
