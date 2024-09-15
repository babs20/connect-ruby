import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button';
import Logo from './svgs/Logo';
import { useAuth } from '@/providers/AuthProvider';

export default function Header() {
  const auth = useAuth();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex items-center h-14 max-w-screen-2xl'>
        <div className='flex mr-4'>
          <Link to='/' className='flex items-center mr-4 space-x-2 lg:mr-6'>
            <Logo />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to='/groups' className={navigationMenuTriggerStyle()}>
                  Groups
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='flex items-center justify-end flex-1 space-x-2'>
          {!auth.isLoading &&
            (!auth.user ? (
              <Link to='/login' className={buttonVariants({ variant: 'default', size: 'sm' })}>
                Login
              </Link>
            ) : (
              <div>
                <span className='mr-4 text-sm'>Hello, {auth.user.email}!</span>
                <button
                  className={buttonVariants({ variant: 'default', size: 'sm' })}
                  onClick={() => {
                    void auth.logout();
                  }}
                >
                  Logout
                </button>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}
