import { useForm, useFormState } from 'react-hook-form';

import { APIError } from '../APIError';
import { useAuthContext } from '../contexts/AuthContext/context';

import { Container } from '../components/Container/Container';

type FormData = {
  email: string;
  password: string;
  password2: string;
};

export const RegisterPage = () => {
  const { register: authRegister } = useAuthContext();

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
      await authRegister(data.email, data.password, data.password2);
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
      <h1>Register</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label>
            <p>Email</p>
            <input
              type="text"
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
        </div>

        <div>
          <label>
            <p>Confirm Password</p>
            <input
              type="password"
              {...register('password2', { required: 'Confirm password' })}
            />
          </label>
          <p className="error">{errors.password2?.message}</p>
          <p className="error">{errors.root?.message}</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          Register
        </button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </Container>
  );
};

function mapError(error: string) {
  switch (error) {
    case 'EMAIL_EXISTS':
      return 'Email already exists';
    case 'PASSWORDS_DONT_MATCH':
      return 'Passwords do not match';
    default:
      return error;
  }
}