import type { Product } from './product';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  size?: string | null;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  customer_name: string;
  status: OrderStatus;
  total_amount: string;
  shipping_address: string;
  notes: string;
  assigned_staff?: number | null;
  assigned_staff_name?: string | null;
  store_name?: string | null;
  tenant_id?: number | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  customer_name: string;
  status: OrderStatus;
  total_amount: string;
  items_count: number;
  store_name?: string | null;
  tenant_id?: number | null;
  created_at: string;
}

export interface OrderCreateItem {
  product: number;
  quantity: number;
  size?: string;
}

export interface OrderCreatePayload {
  shipping_address: string;
  notes?: string;
  items: OrderCreateItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}
