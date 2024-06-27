import { AxiosInstance } from 'axios';
import { User } from './types';
import { AccessTokenService } from './AccessTokenService';

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
    const response = await this.axios.post('/auth/register', {
      email,
      password,
      password2,
    });
    return response.data;
  };

  login = async (email: string, password: string) => {
    const response = await this.axios.post<{
      user: User;
      accessToken: string;
    }>('/auth/login', {
      email,
      password,
    });

    const accessToken = response.data.accessToken;

    this.accessTokenStorage.set(accessToken);

    return response.data.user;
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
    }>('/auth/refresh-tokens');

    const accessToken = response.data.accessToken;
    this.accessTokenStorage.set(accessToken);
    console.log('Tokens refreshed.');

    return response.data;
  };

  logout = async () => {
    await this.axios.post('/auth/logout');
    this.accessTokenStorage.delete();
  };

  logoutAll = async () => {
    await this.axios.post('/auth/logout-all');
    this.accessTokenStorage.delete();
  };

  me = async () => {
    const response = await this.axios.get<User>('/auth/me');
    return response.data;
  };

  getActiveSessions = async () => {
    const response = await this.axios.get<{
      sessions: {
        ip: string;
        userAgent: string;
        createdAt: string;
      }[];
    }>('/auth/active-sessions');
    return response.data.sessions;
  };

  getConfig = async () => {
    const response = await this.axios.get<{
      accessTokenTTLsec: number;
      refreshTokenTTLsec: number;
    }>('/auth/config');
    return response.data;
  };
}
