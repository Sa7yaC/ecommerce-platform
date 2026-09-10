export interface ProductSize {
  id?: number;
  size: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  image_url: string;
  is_active: boolean;
  sizes?: ProductSize[];
  created_by?: number;
  created_by_username?: string;
  tenant?: number;
  tenant_store_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  stock: number;
  category: string;
  image_url: string;
  is_active: boolean;
  sizes?: ProductSize[];
}

export interface ProductFilters {
  category?: string;
  is_active?: boolean;
  search?: string;
}
