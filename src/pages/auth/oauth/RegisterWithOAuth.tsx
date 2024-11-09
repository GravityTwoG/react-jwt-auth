import { useLocation, useParams } from 'wouter';

import classes from '../auth.module.css';

import { getRedirectURL } from '@/utils';
import { useRegisterWithOAuth } from '@/hooks/useRegisterWithOAuth';

import { H1 } from '@/components/Typography';
import { Container } from '@/components/Container/Container';

export const RegisterWithOAuthPage = () => {
  const [location] = useLocation();
  const provider = useParams<{ provider: string }>().provider;

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code') || '';
  const deviceId = searchParams.get('deviceId') || '';

  const [isLoading, error] = useRegisterWithOAuth({
    provider,
    code,
    deviceId,
    redirectPath: getRedirectURL(location),
  });

  return (
    <Container className={classes.AuthPage}>
      <H1>Registration with {(provider || '').toUpperCase()}</H1>

      {isLoading && <p className="text-gray-500 m-8">...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <p className="text-green-500">Registration successful.</p>
      )}
    </Container>
  );
};
