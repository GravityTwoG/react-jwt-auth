import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';

import { useAuthContext } from '@/contexts/AuthContext/context';

export type useLoginWithOAuthArgs = {
  provider: string;
  code: string;
  redirectPath: string;
};

export const useConnectOAuth = (args: useLoginWithOAuthArgs) => {
  const { connectOAuth } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function connect() {
      if (!args.code) {
        setIsLoading(false);
        setError('Invalid URL');
        return;
      }

      try {
        setError('');
        setIsLoading(true);
        await connectOAuth(args.provider, args.code, args.redirectPath);
        navigate('/');
      } catch (error) {
        console.error(error);
        setError(
          'Something went wrong. Please try again later. Error: ' + error
        );
      } finally {
        setIsLoading(false);
      }
    }

    connect();
  }, [args.code, args.provider, args.redirectPath, connectOAuth]);

  return [isLoading, error] as const;
};
