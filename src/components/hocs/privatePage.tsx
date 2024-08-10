import { useEffect } from 'react';
import { navigate } from 'wouter/use-browser-location';

import { useAuthContext } from '@/contexts/AuthContext/context';
import { AuthStatus } from '@/types';

export const privatePage = (Component: React.FunctionComponent) => {
  return () => {
    const { authStatus } = useAuthContext();
    useEffect(() => {
      if (authStatus === AuthStatus.ANONYMOUS) {
        navigate('/login');
      }
    }, [authStatus]);

    if (
      authStatus === AuthStatus.LOADING ||
      authStatus === AuthStatus.ANONYMOUS
    ) {
      return null;
    }

    return <Component />;
  };
};
