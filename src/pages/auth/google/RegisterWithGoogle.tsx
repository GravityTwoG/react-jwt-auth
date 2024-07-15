import { useEffect, useState } from 'react';

import classes from '../auth.module.css';

import { useAuthContext } from '../../../contexts/AuthContext/context';
import { getRedirectURL } from '../../../getRedirectURL';

import { Container } from '../../../components/Container/Container';

export const RegisterWithGooglePage = () => {
  const { registerWithGoogle } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    async function login() {
      if (!code) {
        setIsLoading(false);
        setError('Invalid URL');
        return;
      }

      try {
        setError('');
        setIsLoading(true);
        await registerWithGoogle(code, getRedirectURL('/register/google'));
      } catch (error) {
        console.error(error);
        setError('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    login();
  }, [code, registerWithGoogle]);

  return (
    <Container className={classes.AuthPage}>
      <h1 className="text-5xl leading-snug">Registration with Google</h1>

      {isLoading && <p className="text-gray-500 m-8">...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <p className="text-green-500">
          Registration successful. You can login now.
        </p>
      )}
    </Container>
  );
};
