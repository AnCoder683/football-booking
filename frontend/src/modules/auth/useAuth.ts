import { createContext, useContext } from 'react';
import type { LoginData } from './auth.api';

type AuthContextValue = {
  session: LoginData | null;
  isRestoring: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
  logoutUnconfirmed: boolean;
  accountError: string;
  logoutError: string;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used within AuthProvider');
  return auth;
}
