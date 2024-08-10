import { useEffect } from 'react';
import { navigate } from 'wouter/use-browser-location';

import { useAuthContext } from '@/contexts/AuthContext/context';
import { AuthStatus } from '@/types';

export const anonymousPage = (Component: React.FunctionComponent) => {
  return () => {
    const { authStatus } = useAuthContext();
    useEffect(() => {
      if (authStatus === AuthStatus.AUTHENTICATED) {
        navigate('/');
      }
    }, [authStatus]);

    if (
      authStatus === AuthStatus.LOADING ||
      authStatus === AuthStatus.AUTHENTICATED
    ) {
      return null;
    }

    return <Component />;
  };
};
