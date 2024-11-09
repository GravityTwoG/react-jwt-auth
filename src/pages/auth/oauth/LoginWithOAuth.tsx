import { useParams } from 'wouter';

import classes from '../auth.module.css';

import { useLoginWithOAuth } from '@/contexts/AuthContext/hooks/useLoginWithOAuth';

import { Container } from '@/components/Container/Container';
import { H1 } from '@/components/Typography';

export const OAuthLoginCallbackPage = () => {
  const provider = useParams<{ provider: string }>().provider;

  const [isLoading, error] = useLoginWithOAuth({
    provider,
  });

  return (
    <Container className={classes.AuthPage}>
      <H1>Logging in with {(provider || '').toUpperCase()}</H1>

      {isLoading && <p className="text-gray-500 m-8">...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Container>
  );
};
