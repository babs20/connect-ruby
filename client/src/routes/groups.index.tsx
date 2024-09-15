import { CreateGroupDialog } from '@/components/dialogs/CreateGroup';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { buttonVariants as btnCva } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { groupsQueryOptions } from '@/utils/groupQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/groups/')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(groupsQueryOptions),
  component: GroupsIndex,
});

function GroupsIndex() {
  const { data: query } = useSuspenseQuery(groupsQueryOptions);

  return (
    <div className='mt-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold leading-snug text-white'>GROUPS</h1>
        <CreateGroupDialog />
      </div>
      <ul className='grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {query.data?.map(({ id, attributes }) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>{attributes.name}</CardTitle>
              <div>
                <PrivacyBadge text={attributes.privacySetting} />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{attributes.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Link
                className={btnCva({ variant: 'default', size: 'sm' })}
                to='/groups/$id'
                params={{
                  id,
                }}
              >
                View
              </Link>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </div>
  );
}
