import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext/context';

export type useRegisterWithOAuthArgs = {
  provider: string;
  code: string;
  redirectPath: string;
};

export const useRegisterWithOAuth = (args: useRegisterWithOAuthArgs) => {
  const { registerWithOAuth } = useAuthContext();

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
        await registerWithOAuth(args.provider, args.code, args.redirectPath);
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
  }, [args.code, args.provider, args.redirectPath, registerWithOAuth]);

  return [isLoading, error] as const;
};
