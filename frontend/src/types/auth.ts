export type UserRole = 'customer' | 'staff' | 'store_owner';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  tenant_id: number;
  tenant_name: string;
  role: UserRole;
  user_id: number;
  username: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  role: UserRole;
  tenant: number;
  tenant_name?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  tenant_id?: number;
  store_name?: string;
}
