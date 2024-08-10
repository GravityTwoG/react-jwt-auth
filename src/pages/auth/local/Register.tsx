import { useForm, useFormState } from 'react-hook-form';

import classes from '../auth.module.css';

import { APIError } from '@/api/APIError';
import { useAuthContext } from '@/contexts/AuthContext/context';

import { H1 } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container/Container';
import { Label } from '@/components/Label';
import { Form } from '@/components/Form';
import { GoogleConsentURLButton } from '@/components/GoogleConsentURLButton';
import { GithubConsentURLButton } from '@/components/GithubConsentURLButton';

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
      <H1>Register</H1>

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
        </div>

        <div>
          <Label label="Confirm Password">
            <input
              type="password"
              {...register('password2', { required: 'Confirm password' })}
            />
          </Label>
          <p className="text-red-500">{errors.password2?.message}</p>
          <p className="text-red-500">{errors.root?.message}</p>
        </div>

        <Button type="submit" disabled={isSubmitting} className="bg-blue-500">
          Register
        </Button>

        <GoogleConsentURLButton
          disabled={isSubmitting}
          redirectPath="/oauth/google/register"
          children="Register with Google"
        />
        <GithubConsentURLButton
          disabled={isSubmitting}
          redirectPath="/oauth/github/register"
          children="Register with Github"
        />

        <p>
          Already have an account?{' '}
          <a href="/login" className="underline font-bold hover:no-underline">
            Login
          </a>
        </p>
      </Form>
    </Container>
  );
};

function mapError(error: APIError) {
  switch (error.code) {
    case 'EMAIL_INVALID':
      return 'Email is invalid';
    case 'EMAIL_ALREADY_EXISTS':
      return 'Email already exists';
    case 'PASSWORD_LENGTH_INVALID':
      return 'Password length must be between 8 and 64 characters';
    case 'PASSWORDS_DONT_MATCH':
      return 'Passwords do not match';
    default:
      return `${error.code}: ${error.message}`;
  }
}
