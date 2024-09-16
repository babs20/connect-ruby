import * as React from 'react';
import { createFileRoute, redirect, useRouter, useRouterState } from '@tanstack/react-router';
import { z } from 'zod';
import { useAuth } from '../providers/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';

const homepage = '/' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isLoggedIn) {
      console.log('User is already logged in, redirecting to homepage', context.auth.isLoggedIn);

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: search.redirect || homepage });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const search = Route.useSearch();

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    try {
      evt.preventDefault();
      setIsSubmitting(true);
      await auth.login({ email: evt.currentTarget.email.value, password: evt.currentTarget.password.value });
      await queryClient.invalidateQueries();
      await router.navigate({ to: search.redirect || '/groups' });
    } catch (error) {
      console.error('Error logging in: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggingIn = isLoading || isSubmitting;

  return (
    <div className='grid gap-2 p-2 place-items-center'>
      <form className='max-w-lg mt-4' onSubmit={(e) => void onFormSubmit(e)}>
        <fieldset disabled={isLoggingIn} className='grid w-full gap-2'>
          <div className='grid gap-2 items-center min-w-[300px]'>
            <label htmlFor='email-input' className='text-sm font-medium'>
              Email
            </label>
            <input
              id='email-input'
              name='email'
              placeholder='Enter your email'
              type='email'
              className='w-full p-2 text-black border rounded-md'
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
              className='w-full p-2 text-black border rounded-md'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-blue-500 rounded-md disabled:bg-gray-300 disabled:text-gray-500'
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
