import { createContext, useContext } from 'react';
import { AuthStatus, Session, User } from '@/types';

interface IAuthContext {
  user: User;
  authStatus: AuthStatus;

  register: (
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;

  requestConsentURL: (provider: string, redirectURL: string) => Promise<string>;
  registerWithOAuth: (
    provider: string,
    code: string,
    deviceId: string,
    redirectURL: string
  ) => Promise<void>;
  loginWithOAuth: (
    provider: string,
    code: string,
    deviceId: string,
    redirectURL: string
  ) => Promise<void>;
  connectOAuth: (
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
  register: async () => {},
  login: async () => {},

  registerWithOAuth: async () => {},

  requestConsentURL: async () => '',
  loginWithOAuth: async () => {},
  connectOAuth: async () => {},

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
