import { useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext/context';

export type useLoginWithOAuthArgs = {
  provider: string;
  code: string;
  deviceId: string;
  redirectPath: string;
};

export const useLoginWithOAuth = (args: useLoginWithOAuthArgs) => {
  const { loginWithOAuth } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function login() {
      if (!args.code) {
        setIsLoading(false);
        setError('Invalid URL');
        return;
      }

      try {
        setError('');
        setIsLoading(true);
        await loginWithOAuth(
          args.provider,
          args.code,
          args.deviceId,
          args.redirectPath
        );
      } catch (error) {
        console.error(error);
        setError(
          'Something went wrong. Please try again later. Error: ' + error
        );
      } finally {
        setIsLoading(false);
      }
    }

    login();
  }, [args.code, args.provider, args.redirectPath, loginWithOAuth]);

  return [isLoading, error] as const;
};
