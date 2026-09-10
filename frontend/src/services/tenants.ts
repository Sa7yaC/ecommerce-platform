import { api } from './api';
import type { Tenant } from '../types/tenant';

export const tenantService = {
  async getTenants(): Promise<Tenant[]> {
    const response = await api.get<Tenant[]>('/tenants/');
    return response.data;
  },
};
