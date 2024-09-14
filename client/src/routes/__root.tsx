import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { AuthContext } from '../providers/AuthProvider';
import type { QueryClient } from '@tanstack/react-query';

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
      <Outlet />
      <ReactQueryDevtools buttonPosition='bottom-left' />
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
