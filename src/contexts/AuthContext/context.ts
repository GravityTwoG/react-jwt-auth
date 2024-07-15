import { createContext, useContext } from 'react';
import { AuthStatus, Session, User } from '../../types';

interface IAuthContext {
  user: User;
  authStatus: AuthStatus;

  register: (
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;

  registerWithGoogle: (code: string, redirectURL: string) => Promise<void>;

  requestLoginWithGoogle: (redirectURL: string) => Promise<string>;
  loginWithGoogle: (code: string, redirectURL: string) => Promise<void>;

  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;

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

  registerWithGoogle: async () => {},

  requestLoginWithGoogle: async () => '',
  loginWithGoogle: async () => {},

  logout: async () => {},
  logoutAll: async () => {},

  getActiveSessions: async () => {
    return [];
  },
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
