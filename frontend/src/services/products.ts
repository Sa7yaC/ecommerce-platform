import { api } from './api';
import type { Product, ProductFilters, ProductFormData } from '../types/product';

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.is_active !== undefined) {
      params.append('is_active', filters.is_active ? 'true' : 'false');
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get<Product[]>('/products/', { params });
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get<{ categories: string[] }>('/products/categories/');
    const raw = response.data.categories || [];
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const c of raw) {
      if (!c) continue;
      const clean = c.trim();
      if (clean && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        unique.push(clean);
      }
    }
    return unique;
  },

  async getProduct(id: number | string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}/`);
    return response.data;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const payload = {
      ...data,
      category: data.category?.trim() || '',
    };
    const response = await api.post<Product>('/products/', payload);
    return response.data;
  },

  async updateProduct(id: number | string, data: Partial<ProductFormData>): Promise<Product> {
    const payload = {
      ...data,
      ...(data.category !== undefined ? { category: data.category.trim() } : {}),
    };
    const response = await api.patch<Product>(`/products/${id}/`, payload);
    return response.data;
  },

  async deleteProduct(id: number | string): Promise<void> {
    await api.delete(`/products/${id}/`);
  },
};
