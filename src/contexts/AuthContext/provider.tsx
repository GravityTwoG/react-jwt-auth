import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './context';

import { AuthStatus, User } from '@/types';
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
      const user = await authAPI.register(email, password, password2);
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

  const registerWithOAuth = useCallback(
    async (provider: string, code: string, redirectURL: string) => {
      const user = await authAPI.registerWithOAuth(provider, code, redirectURL);
      setUser(user);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    [authAPI]
  );

  const requestConsentURL = useCallback(
    async (provider: string, redirectURL: string) => {
      const googleRedirectURL = await authAPI.getConsentURL(
        provider,
        redirectURL
      );

      return googleRedirectURL;
    },
    [authAPI]
  );

  const loginWithOAuth = useCallback(
    async (provider: string, code: string, redirectURL: string) => {
      const user = await authAPI.loginWithOAuth(provider, code, redirectURL);
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

  const logoutAll = useCallback(async () => {
    try {
      await authAPI.logoutAll();
      setUser(defaultUser);
      setAuthStatus(AuthStatus.ANONYMOUS);
    } catch (error) {
      console.error(error);
      alert(`Failed to logout from all sessions: ${error}`);
    }
  }, [authAPI]);

  const deleteUser = useCallback(async () => {
    await authAPI.deleteUser();
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

        registerWithOAuth: registerWithOAuth,

        requestConsentURL: requestConsentURL,
        loginWithOAuth: loginWithOAuth,
        connectOAuth: authAPI.connectOAuth,

        logout,
        logoutAll,
        deleteUser,

        getActiveSessions: authAPI.getActiveSessions,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
