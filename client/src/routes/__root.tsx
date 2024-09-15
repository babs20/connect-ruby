import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { AuthContext } from '../providers/AuthProvider';
import type { QueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';

interface RootRouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <main>
        <div className='pb-6'>
          <div className='container max-w-screen-2xl'>
            <Outlet />
          </div>
        </div>
      </main>
      <ReactQueryDevtools buttonPosition='bottom-left' />
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
