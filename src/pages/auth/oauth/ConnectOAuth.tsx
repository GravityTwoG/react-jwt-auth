import { useLocation, useParams } from 'wouter';

import classes from '../auth.module.css';

import { getRedirectURL } from '@/utils';
import { useConnectOAuth } from '@/hooks/useConnectOAuth';

import { Container } from '@/components/Container/Container';
import { H1 } from '@/components/Typography';

export const ConnectOAuthPage = () => {
  const [location] = useLocation();
  const provider = useParams<{ provider: string }>().provider;

  const code = new URLSearchParams(window.location.search).get('code') || '';

  const [isLoading, error] = useConnectOAuth({
    provider,
    code,
    redirectPath: getRedirectURL(location),
  });

  return (
    <Container className={classes.AuthPage}>
      <H1>Connecting {(provider || '').toUpperCase()}</H1>

      {isLoading && <p className="text-gray-500 m-8">...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Container>
  );
};
