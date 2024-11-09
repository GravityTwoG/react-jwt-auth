import { useEffect } from 'react';

import { useAuthContext } from '@/contexts/AuthContext/context';

export type useConnectOAuthArgs = {
  provider: string;
};

export const useConnectOAuth = ({ provider }: useConnectOAuthArgs) => {
  const {
    connectOAuthFallback,
    isOAuthPending,
    setOAuthIsPending,
    oauthError,
    setOAuthError,
  } = useAuthContext();

  useEffect(() => {
    setOAuthIsPending(true);

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code') || '';
    const deviceId = searchParams.get('deviceId') || '';

    if (!code) {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_ERROR',
            error,
            errorDescription,
          },
          '*'
        );
        window.close();
      }

      setOAuthIsPending(false);
      setOAuthError(`${error}: ${errorDescription}`);
      return;
    }

    if (window.opener) {
      // Pass the authorization code to the original tab
      window.opener.postMessage(
        {
          type: 'OAUTH_CODE',
          code,
          deviceId,
          provider,
        },
        '*'
      );
      // Close the new tab
      window.close();
    } else {
      connectOAuthFallback(provider, code, deviceId);
    }
  }, [provider, connectOAuthFallback, setOAuthError, setOAuthIsPending]);

  return [isOAuthPending, oauthError] as const;
};
