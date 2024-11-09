import { useParams } from 'wouter';

import classes from '../auth.module.css';

import { useRegisterWithOAuth } from '@/contexts/AuthContext/hooks/useRegisterWithOAuth';

import { H1 } from '@/components/Typography';
import { Container } from '@/components/Container/Container';

export const RegisterWithOAuthPage = () => {
  const provider = useParams<{ provider: string }>().provider;

  const [isLoading, error] = useRegisterWithOAuth({
    provider,
  });

  return (
    <Container className={classes.AuthPage}>
      <H1>Registration with {(provider || '').toUpperCase()}</H1>

      {isLoading && <p className="text-gray-500 m-8">...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <p className="text-green-500">You are successfully registered.</p>
      )}
    </Container>
  );
};
