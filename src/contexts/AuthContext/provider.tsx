import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './context';

import { AuthStatus, User } from '@/types';
import { useAPIContext } from '../APIContext/context';
import { getRedirectURL, popUpWasBlocked, withResolvers } from '@/utils';

let unsubscribeMessageListener: () => void = () => {};

const defaultUser: User = {
  id: 0,
  email: '',
};

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const { authAPI } = useAPIContext();

  const [user, setUser] = useState<User>(defaultUser);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  const [oauthError, setOAuthError] = useState<string>('');
  const [isOAuthPending, setOAuthIsPending] = useState(false);

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

  const openConsentURL = useCallback(
    async (provider: string, callbackURL: string) => {
      // Open popup immediately
      // Popup blockers will not block this popup if it is created from
      // a function that is executed when the user clicks a button.
      // Popup blockers only block windows if there was no user input provided to create it.
      const newWindow = window.open(undefined, '_blank');

      try {
        const { redirectURL, codeVerifier } = await authAPI.getConsentURL(
          provider,
          callbackURL
        );
        localStorage.setItem('oauth_code_verifier', codeVerifier);

        if (popUpWasBlocked(newWindow)) {
          window.location.href = redirectURL;
        } else {
          newWindow.location.href = redirectURL;
        }
      } catch (e) {
        if (newWindow) {
          newWindow.close();
        }
        throw e;
      }
    },
    [authAPI]
  );

  const handleOAuthRequest = useCallback(
    async (request: () => Promise<void>) => {
      try {
        setOAuthError('');
        setOAuthIsPending(true);
        return await request();
      } catch (error) {
        setOAuthError(
          'Something went wrong. Please try again later. Error: ' + error
        );
        throw error;
      } finally {
        setOAuthIsPending(false);
      }
    },
    []
  );

  const registerWithOAuthFallback = useCallback(
    (provider: string, code: string, deviceId: string) =>
      handleOAuthRequest(async () => {
        const callbackURL = getRedirectURL(`/oauth/${provider}/register`);
        const codeVerifier = localStorage.getItem('oauth_code_verifier') || '';

        const user = await authAPI.registerWithOAuth(
          provider,
          code,
          codeVerifier,
          deviceId,
          callbackURL
        );
        setUser(user);
        setAuthStatus(AuthStatus.AUTHENTICATED);
      }),
    [authAPI, handleOAuthRequest]
  );

  const registerWithOAuth = useCallback(
    async (provider: string) => {
      const callbackURL = getRedirectURL(`/oauth/${provider}/register`);
      await openConsentURL(provider, callbackURL);

      const { promise, resolve, reject } = withResolvers<void>();

      const onOAuthCode = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'OAUTH_ERROR') {
          unsubscribeMessageListener();

          reject({
            error: event.data.error,
            errorDescription: event.data.errorDescription,
          });
          return;
        }

        if (event.data.type === 'OAUTH_CODE') {
          unsubscribeMessageListener();

          const code = event.data.code as string;
          const deviceId = event.data.deviceId as string;
          const provider = event.data.provider as string;

          registerWithOAuthFallback(provider, code, deviceId)
            .then(resolve)
            .catch(reject);
        }
      };

      unsubscribeMessageListener();

      window.addEventListener('message', onOAuthCode);

      unsubscribeMessageListener = () =>
        window.removeEventListener('message', onOAuthCode);

      return promise;
    },
    [openConsentURL, registerWithOAuthFallback]
  );

  const loginWithOAuthFallback = useCallback(
    (provider: string, code: string, deviceId: string) =>
      handleOAuthRequest(async () => {
        const callbackURL = getRedirectURL(`/oauth/${provider}/login`);
        const codeVerifier = localStorage.getItem('oauth_code_verifier') || '';

        const user = await authAPI.loginWithOAuth(
          provider,
          code,
          codeVerifier,
          deviceId,
          callbackURL
        );
        setUser(user);
        setAuthStatus(AuthStatus.AUTHENTICATED);
      }),
    [authAPI, handleOAuthRequest]
  );

  const loginWithOAuth = useCallback(
    async (provider: string) => {
      const callbackURL = getRedirectURL(`/oauth/${provider}/login`);
      await openConsentURL(provider, callbackURL);

      const { promise, resolve, reject } = withResolvers<void>();

      const onOAuthCode = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'OAUTH_ERROR') {
          unsubscribeMessageListener();

          reject({
            error: event.data.error,
            errorDescription: event.data.errorDescription,
          });
          return;
        }

        if (event.data.type === 'OAUTH_CODE') {
          unsubscribeMessageListener();

          const code = event.data.code as string;
          const deviceId = event.data.deviceId as string;
          const provider = event.data.provider as string;

          loginWithOAuthFallback(provider, code, deviceId)
            .then(resolve)
            .catch(reject);
        }
      };

      unsubscribeMessageListener();
      window.addEventListener('message', onOAuthCode);

      unsubscribeMessageListener = () =>
        window.removeEventListener('message', onOAuthCode);

      return promise;
    },
    [openConsentURL, loginWithOAuthFallback]
  );

  const connectOAuthFallback = useCallback(
    (provider: string, code: string, deviceId: string) =>
      handleOAuthRequest(async () => {
        const callbackURL = getRedirectURL(`/oauth/${provider}/connect`);
        const codeVerifier = localStorage.getItem('oauth_code_verifier') || '';

        await authAPI.connectOAuth(
          provider,
          code,
          codeVerifier,
          deviceId,
          callbackURL
        );
      }),
    [authAPI, handleOAuthRequest]
  );

  const connectOAuth = useCallback(
    async (provider: string) => {
      const callbackURL = getRedirectURL(`/oauth/${provider}/connect`);
      await openConsentURL(provider, callbackURL);

      const { promise, resolve, reject } = withResolvers<void>();

      const onOAuthCode = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'OAUTH_ERROR') {
          unsubscribeMessageListener();

          reject({
            error: event.data.error,
            errorDescription: event.data.errorDescription,
          });
          return;
        }

        if (event.data.type === 'OAUTH_CODE') {
          unsubscribeMessageListener();

          const code = event.data.code as string;
          const deviceId = event.data.deviceId as string;
          const provider = event.data.provider as string;

          connectOAuthFallback(provider, code, deviceId)
            .then(resolve)
            .catch(reject);
        }
      };

      unsubscribeMessageListener();

      window.addEventListener('message', onOAuthCode);

      unsubscribeMessageListener = () =>
        window.removeEventListener('message', onOAuthCode);

      return promise;
    },
    [openConsentURL, connectOAuthFallback]
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

        oauthError,
        isOAuthPending,

        setOAuthError,
        setOAuthIsPending,

        register,
        login,

        registerWithOAuth: registerWithOAuth,
        loginWithOAuth: loginWithOAuth,
        connectOAuth: connectOAuth,

        registerWithOAuthFallback: registerWithOAuthFallback,
        loginWithOAuthFallback: loginWithOAuthFallback,
        connectOAuthFallback: connectOAuthFallback,

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
