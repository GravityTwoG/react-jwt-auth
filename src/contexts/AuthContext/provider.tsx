import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './context';

import { AuthStatus, User } from '../../types';
import { useAPIContext } from '../APIContext/context';

const defaultUser: User = {
  id: 0,
  email: '',
};

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const { authAPI } = useAPIContext();

  const [user, setUser] = useState<User>(defaultUser);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  useEffect(() => {
    authAPI.onAuthStateChange((user) => {
      if (!user) {
        setUser(defaultUser);
        setAuthStatus(AuthStatus.ANONYMOUS);
      } else {
        setUser(user);
        setAuthStatus(AuthStatus.AUTHENTICATED);
      }
    });
  }, [authAPI]);

  const register = useCallback(
    async (email: string, password: string, password2: string) => {
      await authAPI.register(email, password, password2);
      const user = await authAPI.login(email, password);
      setUser(user);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    [authAPI]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const user = await authAPI.login(email, password);
      setUser(user);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    [authAPI]
  );

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(defaultUser);
    setAuthStatus(AuthStatus.ANONYMOUS);
  }, [authAPI]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authStatus,
        register,
        login,
        logout,
        getActiveSessions: authAPI.getActiveSessions,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
