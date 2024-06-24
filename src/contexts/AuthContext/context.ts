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
  logout: () => Promise<void>;
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
  logout: async () => {},
  getActiveSessions: async () => {
    return [];
  },
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
