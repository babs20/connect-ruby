import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/groups')({
  component: () => (
    <div className='mt-8'>
      <Outlet />
    </div>
  ),
});
