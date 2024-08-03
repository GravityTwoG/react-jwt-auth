import { useParams } from 'wouter';

import classes from '../auth.module.css';

import { getRedirectURL } from '../../../getRedirectURL';

import { Container } from '../../../components/Container/Container';
import { useRegisterWithOAuth } from '../../../hooks/useRegisterWithOAuth';
import { H1 } from '../../../components/Typography';

export const RegisterWithOAuthPage = () => {
  const provider = useParams<{ provider: string }>().provider;

  const code = new URLSearchParams(window.location.search).get('code') || '';

  const [isLoading, error] = useRegisterWithOAuth({
    provider,
    code,
    redirectPath: getRedirectURL(`/register/${provider}`),
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
