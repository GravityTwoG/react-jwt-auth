import { createContext, useContext } from 'react';
import { AuthStatus, Session, User } from '@/types';

interface IAuthContext {
  user: User;
  authStatus: AuthStatus;

  oauthError: string;
  isOAuthPending: boolean;

  setOAuthError: (error: string) => void;
  setOAuthIsPending: (isPending: boolean) => void;

  register: (
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;

  registerWithOAuth: (provider: string) => Promise<void>;
  loginWithOAuth: (provider: string) => Promise<void>;
  connectOAuth: (provider: string) => Promise<void>;

  registerWithOAuthFallback: (
    provider: string,
    code: string,
    deviceId: string
  ) => Promise<void>;
  loginWithOAuthFallback: (
    provider: string,
    code: string,
    deviceId: string
  ) => Promise<void>;
  connectOAuthFallback: (
    provider: string,
    code: string,
    redirectURL: string
  ) => Promise<void>;

  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  deleteUser: () => Promise<void>;

  getActiveSessions: () => Promise<Session[]>;
}

export const AuthContext = createContext<IAuthContext>({
  user: {
    id: 0,
    email: '',
  },
  authStatus: AuthStatus.LOADING,

  oauthError: '',
  isOAuthPending: false,

  setOAuthError: () => {},
  setOAuthIsPending: () => {},

  register: async () => {},
  login: async () => {},

  registerWithOAuth: async () => {},
  loginWithOAuth: async () => {},
  connectOAuth: async () => {},

  loginWithOAuthFallback: async () => {},
  registerWithOAuthFallback: async () => {},
  connectOAuthFallback: async () => {},

  logout: async () => {},
  logoutAll: async () => {},
  deleteUser: async () => {},

  getActiveSessions: async () => {
    return [];
  },
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
