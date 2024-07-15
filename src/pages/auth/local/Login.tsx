import { useForm, useFormState } from 'react-hook-form';

import classes from '../auth.module.css';

import { APIError } from '../../../APIError';
import { useAuthContext } from '../../../contexts/AuthContext/context';

import { Container } from '../../../components/Container/Container';
import { Label } from '../../../components/Label';
import { GoogleConsentURLButton } from '../../../components/GoogleConsentURLButton';

type FormData = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { login } = useAuthContext();

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

  return (
    <Container className={classes.AuthPage}>
      <h1 className="text-5xl leading-snug">Login</h1>

      <form onSubmit={onSubmit}>
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

        <button type="submit" disabled={isSubmitting} className="bg-blue-500">
          Login
        </button>

        <GoogleConsentURLButton
          disabled={isSubmitting}
          redirectPath="/login/google"
          children="Login with Google"
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
      </form>
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
