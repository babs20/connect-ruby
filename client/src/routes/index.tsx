import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useAuth } from '../providers/AuthProvider';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.logout();
      await router.invalidate();
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <div className='p-2'>
      <h3>Welcome Home!</h3>

      {auth.token ? (
        <div>
          <p>You are logged in!</p>
          <button onClick={() => void handleLogout()} className='bg-red-500 text-white p-2 flex rounded'>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <Link to='/login'>Login</Link>
        </div>
      )}
    </div>
  );
}
