import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import type { UserRole, LoginResponse, RegisterPayload } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: number;
    username: string;
    role: UserRole;
  } | null;
  role: UserRole | null;
  tenantId: number | null;
  tenantName: string | null;
  login: (credentials: { username: string; password: string }) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ id: number; username: string; role: UserRole } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [tenantName, setTenantName] = useState<string | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('tenant_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_username');

    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    setTenantId(null);
    setTenantName(null);
  }, []);

  useEffect(() => {
    // Restore session from localStorage
    const token = localStorage.getItem('access_token');
    const storedRole = localStorage.getItem('user_role') as UserRole | null;
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('user_username');
    const storedTenantId = localStorage.getItem('tenant_id');
    const storedTenantName = localStorage.getItem('tenant_name');

    if (token && storedRole && storedUserId && storedUsername) {
      setIsAuthenticated(true);
      setRole(storedRole);
      setUser({
        id: parseInt(storedUserId, 10),
        username: storedUsername,
        role: storedRole,
      });
      if (storedTenantId) setTenantId(parseInt(storedTenantId, 10));
      const effectiveName = (!storedTenantName || storedTenantName.toLowerCase().includes('test store') || storedTenantName.toLowerCase() === 'aura') ? 'Curio' : storedTenantName;
      localStorage.setItem('tenant_name', effectiveName);
      setTenantName(effectiveName);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    }
    setIsLoading(false);

    // Listen to token expiry events
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [logout]);

  const login = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    const data = await authService.login(credentials);

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('tenant_id', data.tenant_id.toString());
    localStorage.setItem('tenant_name', data.tenant_name);
    localStorage.setItem('user_role', data.role);
    localStorage.setItem('user_id', data.user_id.toString());
    localStorage.setItem('user_username', data.username);

    setIsAuthenticated(true);
    setRole(data.role);
    setUser({
      id: data.user_id,
      username: data.username,
      role: data.role,
    });
    setTenantId(data.tenant_id);
    setTenantName(data.tenant_name);

    return data;
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    await authService.register(payload);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        role,
        tenantId,
        tenantName,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
