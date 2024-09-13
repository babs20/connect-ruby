import * as React from 'react';
import { createFileRoute, redirect, useRouter, useRouterState } from '@tanstack/react-router';
import { z } from 'zod';
import { useAuth } from '../providers/AuthProvider';

const homepage = '/' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: search.redirect || homepage });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const auth = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = Route.useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const search = Route.useSearch();

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    try {
      evt.preventDefault();
      setIsSubmitting(true);
      await auth.login({ email: evt.currentTarget.email.value, password: evt.currentTarget.password.value });
      await router.invalidate();
      await navigate({ to: search.redirect || homepage });
    } catch (error) {
      console.error('Error logging in: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <div className='p-2 grid gap-2 place-items-center'>
      <h3 className='text-xl'>Login page</h3>
      {search.redirect ? (
        <p className='text-red-500'>You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}
      <form className='mt-4 max-w-lg' onSubmit={(e) => void onFormSubmit(e)}>
        <fieldset disabled={isLoggingIn} className='w-full grid gap-2'>
          <div className='grid gap-2 items-center min-w-[300px]'>
            <label htmlFor='email-input' className='text-sm font-medium'>
              Email
            </label>
            <input
              id='email-input'
              name='email'
              placeholder='Enter your email'
              type='email'
              className='border rounded-md p-2 w-full text-black'
              required
            />
          </div>

          <div className='grid gap-2 items-center min-w-[300px]'>
            <label htmlFor='password-input' className='text-sm font-medium'>
              Password
            </label>
            <input
              id='password-input'
              name='password'
              placeholder='Enter your password'
              type='password'
              className='border rounded-md p-2 w-full text-black'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500'
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
