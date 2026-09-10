import { api } from './api';
import type { LoginResponse, RegisterPayload, User } from '../types/auth';

export const authService = {
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<User> {
    const response = await api.post<User>('/auth/register/', payload);
    return response.data;
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response = await api.post<{ access: string }>('/auth/refresh/', { refresh });
    return response.data;
  },
};
