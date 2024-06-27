import { AxiosInstance } from 'axios';
import { User } from './types';

const accessTokenStorage = {
  get: () => localStorage.getItem('accessToken'),
  set: (token: string) => localStorage.setItem('accessToken', token),
};

export class AuthAPI {
  private readonly axios: AxiosInstance;
  private authStateListener?: (user: User | null) => void;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;

    this.setInterceptors();
  }

  private setInterceptors = () => {
    this.axios.interceptors.request.use(function (config) {
      // set Authorization header before each request
      const token = accessTokenStorage.get();
      config.headers.Authorization = token ? `Bearer ${token}` : '';

      console.log('Authorization header set');

      return config;
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    this.axios.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;

        // intercept 401 responses
        const message = error?.response?.data?.error || '';
        const isAccessTokenExpired = message === 'Invalid or expired token';
        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          isAccessTokenExpired
        ) {
          try {
            originalRequest._retry = true;
            console.log('Access token expired. Refreshing...');

            const { accessToken } = await that.refreshTokens();

            accessTokenStorage.set(accessToken);
            console.log('Access token refreshed.');
          } catch (error) {
            console.error('Failed to refresh access token', error);
            that.authStateListener && that.authStateListener(null);
          }

          return that.axios(originalRequest);
        }

        return Promise.reject(error);
      }
    );
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
    const response = await this.axios.post('/register', {
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
    }>('/login', {
      email,
      password,
    });

    const accessToken = response.data.accessToken;

    accessTokenStorage.set(accessToken);

    return response.data.user;
  };

  refreshTokens = async () => {
    const response = await this.axios.post<{ accessToken: string }>(
      '/refresh-tokens'
    );
    return response.data;
  };

  logout = async () => {
    await this.axios.post('/logout');
    accessTokenStorage.set('');
  };

  logoutAll = async () => {
    await this.axios.post('/logout-all');
    accessTokenStorage.set('');
  };

  me = async () => {
    const response = await this.axios.get<User>('/me');
    return response.data;
  };

  getActiveSessions = async () => {
    const response = await this.axios.get<{
      sessions: {
        ip: string;
        userAgent: string;
        createdAt: string;
      }[];
    }>('/active-sessions');
    return response.data.sessions;
  };

  getConfig = async () => {
    const response = await this.axios.get<{
      accessTokenTTLsec: number;
      refreshTokenTTLsec: number;
    }>('/config');
    return response.data;
  };
}
