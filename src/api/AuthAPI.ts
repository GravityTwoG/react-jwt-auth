import { AxiosInstance } from 'axios';
import { getFingerprint } from '@thumbmarkjs/thumbmarkjs';

import { Session, User, UserAuthProvider } from '@/types';
import { AccessTokenService } from './AccessTokenService';

type AuthenticateResponseDTO = {
  user: User;
  accessToken: string;
};

export class AuthAPI {
  private readonly axios: AxiosInstance;
  private readonly accessTokenStorage: AccessTokenService;

  private refreshPromise: Promise<{
    accessToken: string;
    refreshToken: string;
  }> | null = null;

  private authStateListener?: (user: User | null) => void;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
    this.accessTokenStorage = new AccessTokenService();

    this.setInterceptors();
  }

  private setInterceptors = () => {
    this.axios.interceptors.request.use(async (config) => {
      const isExpired = this.accessTokenStorage.isExpiredOrAboutToExpire();
      const isRefresh = config.url === '/auth/refresh-tokens';

      // if token expired, try to refresh it
      if (isExpired && !isRefresh) {
        try {
          await this.refreshTokens();
          console.log('Tokens refreshed.');
        } catch (error) {
          console.error('Failed to refresh tokens', error);
          this.authStateListener && this.authStateListener(null);
          return config;
        }
      }

      // set Authorization header before each request
      const token = this.accessTokenStorage.get();
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      console.log('Authorization header set');

      return config;
    });
  };

  onAuthStateChange = async (callback: (user: User | null) => void) => {
    this.authStateListener = callback;
    try {
      const user = await this.me();
      this.authStateListener(user);
    } catch (error) {
      this.authStateListener(null);
    }
  };

  register = async (email: string, password: string, password2: string) => {
    const response = await this.axios.post<AuthenticateResponseDTO>(
      '/auth/register',
      {
        email,
        password,
        password2,
        fingerPrint: await getFingerPrint(),
      }
    );

    const accessToken = response.data.accessToken;
    this.accessTokenStorage.set(accessToken);

    return response.data.user;
  };

  login = async (email: string, password: string) => {
    const response = await this.axios.post<AuthenticateResponseDTO>(
      '/auth/login',
      {
        email,
        password,
        fingerPrint: await getFingerPrint(),
      }
    );

    const accessToken = response.data.accessToken;
    this.accessTokenStorage.set(accessToken);

    return response.data.user;
  };

  getConsentURL = async (provider: string, redirectURL: string) => {
    const response = await this.axios.get<{
      redirectURL: string;
      codeVerifier: string;
    }>(`/auth/${provider}/consent?redirectURL=${redirectURL}`);
    return response.data;
  };

  registerWithOAuth = async (
    provider: string,
    code: string,
    codeVerifier: string,
    deviceId: string,
    redirectURL: string
  ) => {
    const response = await this.axios.post<AuthenticateResponseDTO>(
      `/auth/${provider}/register-callback`,
      {
        code,
        codeVerifier,
        deviceId,
        fingerPrint: await getFingerPrint(),
        redirectURL,
      }
    );

    const accessToken = response.data.accessToken;
    this.accessTokenStorage.set(accessToken);

    return response.data.user;
  };

  loginWithOAuth = async (
    provider: string,
    code: string,
    codeVerifier: string,
    deviceId: string,
    redirectURL: string
  ) => {
    const response = await this.axios.post<AuthenticateResponseDTO>(
      `/auth/${provider}/login-callback`,
      {
        code,
        codeVerifier,
        deviceId,
        fingerPrint: await getFingerPrint(),
        redirectURL,
      }
    );

    const accessToken = response.data.accessToken;
    this.accessTokenStorage.set(accessToken);

    return response.data.user;
  };

  connectOAuth = async (
    provider: string,
    code: string,
    redirectURL: string
  ) => {
    await this.axios.post<{ message: string }>(
      `/auth/${provider}/connect-callback`,
      {
        code,
        fingerPrint: await getFingerPrint(),
        redirectURL,
      }
    );
  };

  refreshTokens = async () => {
    try {
      if (!this.refreshPromise) {
        this.refreshPromise = this._refreshTokens();
      }

      // await is important here for finally block
      const data = await this.refreshPromise;
      return data;
    } finally {
      this.refreshPromise = null;
    }
  };

  private _refreshTokens = async () => {
    const response = await this.axios.post<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh-tokens', {
      fingerPrint: await getFingerPrint(),
    });

    const accessToken = response.data.accessToken;
    this.accessTokenStorage.set(accessToken);
    console.log('Tokens refreshed.');

    return response.data;
  };

  logout = async () => {
    try {
      await this.axios.post('/auth/logout');
      this.accessTokenStorage.delete();
      console.log('Logged out.');
    } catch (error) {
      console.error('Failed to logout', error);
      this.accessTokenStorage.delete();
    }
  };

  logoutAll = async () => {
    await this.axios.post('/auth/logout-all');
    this.accessTokenStorage.delete();
  };

  deleteUser = async () => {
    await this.axios.post('/auth/delete-user');
    this.accessTokenStorage.delete();
  };

  me = async () => {
    const response = await this.axios.get<User>('/auth/me');
    return response.data;
  };

  getActiveSessions = async () => {
    const response = await this.axios.get<{
      sessions: Session[];
    }>('/auth/me/active-sessions');
    return response.data.sessions;
  };

  getAuthProviders = async () => {
    const response = await this.axios.get<UserAuthProvider[]>('/auth/me/auth-providers');
    return response.data;
  };

  getConfig = async () => {
    const response = await this.axios.get<{
      accessTokenTTLsec: number;
      refreshTokenTTLsec: number;
    }>('/auth/config');
    return response.data;
  };

  getSupportedAuthProviders = async () => {
    const response = await this.axios.get<string[]>(
      '/auth/oauth-providers'
    );
    return response.data;
  };
}

const getFingerPrint = async (): Promise<string> => {
  return getFingerprint(false) as Promise<string>;
};
