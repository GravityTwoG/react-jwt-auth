import { useForm, useFormState } from 'react-hook-form';

import classes from '../auth.module.css';

import { APIError } from '@/api/APIError';
import { useAuthContext } from '@/contexts/AuthContext/context';

import { Container } from '@/components/Container/Container';
import { H1 } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Form } from '@/components/Form';
import { Label } from '@/components/Label';
import { GoogleOAuthButton, GithubOAuthButton } from '@/components/oauth';

type FormData = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { login, loginWithOAuth: oauthLogin } = useAuthContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<FormData>();
  const { isSubmitting } = useFormState<FormData>({ control });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);

      if (error instanceof APIError) {
        setError('root', {
          type: 'custom',
          message: mapError(error),
        });
      } else {
        setError('root', {
          type: 'custom',
          message: 'Something went wrong. Please try again later.',
        });
      }
    }
  });

  const loginWithOAuth = async (provider: string) => {
    try {
      await oauthLogin(provider);
    } catch (error) {
      console.error(error);

      if (error instanceof APIError) {
        setError('root', {
          type: 'custom',
          message: mapError(error),
        });
      } else {
        setError('root', {
          type: 'custom',
          message: 'Something went wrong. Please try again later.',
        });
      }
    }
  }

  return (
    <Container className={classes.AuthPage}>
      <H1>Login</H1>

      <Form onSubmit={onSubmit}>
        <div>
          <Label label="Email">
            <input
              type="text"
              {...register('email', { required: 'Email is required' })}
            />
          </Label>
          <p className="text-red-500">{errors.email?.message}</p>
        </div>

        <div>
          <Label label="Password">
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
          </Label>
          <p className="text-red-500">{errors.password?.message}</p>
          <p className="text-red-500">{errors.root?.message}</p>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          Login
        </Button>

        <GoogleOAuthButton
          disabled={isSubmitting}
          children="Login with Google"
          provider="google"
          onClick={loginWithOAuth}
        />
        <GithubOAuthButton
          disabled={isSubmitting}
          children="Login with Github"
          provider="github"
          onClick={loginWithOAuth}
        />

        <p>
          Don't have an account?{' '}
          <a
            href="/register"
            className="underline font-bold hover:no-underline"
          >
            Register
          </a>
        </p>
      </Form>
    </Container>
  );
};

const mapError = (error: APIError) => {
  switch (error.code) {
    case 'INCORRECT_EMAIL_OR_PASSWORD':
      return 'Incorrect email or password';
    default:
      return `${error.code}: ${error.message}`;
  }
};
