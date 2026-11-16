import type { AxiosInstance } from 'axios';
import { api } from '../../lib/api';

export type LoginData = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
    isBookingBlocked: boolean;
  };
};

export type LoginResponse = {
  success: boolean;
  data?: LoginData;
  error?: { message: string; details?: { field: string; message: string }[] };
};

export function loginApi(credentials: { email: string; password: string }) {
  return api.post<LoginResponse>('/auth/login', credentials, {
    headers: { 'X-CSRF-Protection': '1' },
  });
}

export function getMeApi(accountApi: AxiosInstance) {
  return accountApi.get<{ data: LoginData['user'] }>('/auth/me');
}

export function refreshApi() {
  return api.post<{ success: true; data: Omit<LoginData, 'user'> }>('/auth/refresh', undefined, {
    headers: { 'X-CSRF-Protection': '1' },
  });
}

export function logoutApi() {
  return api.post('/auth/logout', undefined, {
    headers: { 'X-CSRF-Protection': '1' },
  });
}
