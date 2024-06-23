import { useForm, useFormState } from 'react-hook-form';

import { APIError } from '../APIError';
import { useAuthContext } from '../contexts/AuthContext/context';

import { Container } from '../components/Container/Container';

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
          message: mapError(error.message),
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
    <Container>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>
            <p>Email</p>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
          </label>
          <p className="error">{errors.email?.message}</p>
        </div>

        <div>
          <label>
            <p>Password</p>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
          </label>
          <p className="error">{errors.password?.message}</p>
          <p className="error">{errors.root?.message}</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          Login
        </button>

        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </Container>
  );
};

const mapError = (message: string) => {
  switch (message) {
    case 'INCORRECT_EMAIL_OR_PASSWORD':
      return 'Incorrect email or password';
    default:
      return message;
  }
};
