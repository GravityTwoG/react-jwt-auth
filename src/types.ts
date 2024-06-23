export type User = {
  id: number;
  email: string;
};

export enum AuthStatus {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  ANONYMOUS = 'ANONYMOUS',
}
