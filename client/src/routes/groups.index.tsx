import { CreateGroupDialog } from '@/components/dialogs/CreateGroup';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { buttonVariants as btnCva } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { groupsQueryOptions } from '@/utils/groupQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { zodSearchValidator } from '@tanstack/router-zod-adapter';
import { z } from 'zod';

const groupsSearchSchema = z.object({
  page: z.number().default(1),
});

export const Route = createFileRoute('/groups/')({
  validateSearch: zodSearchValidator(groupsSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    void queryClient.ensureQueryData(groupsQueryOptions(deps));
  },
  component: GroupsIndex,
});

function GroupsIndex() {
  const search = Route.useSearch();
  const { data: query } = useSuspenseQuery(groupsQueryOptions(search));

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold leading-snug text-white'>GROUPS</h1>
        <CreateGroupDialog />
      </div>
      <ul className='grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {query.data?.map(({ id, attributes }) => (
          <Card key={id}>
            <CardHeader className='pb-0'>
              <CardTitle>{attributes.name}</CardTitle>
              <div>
                <PrivacyBadge className='mt-1' text={attributes.privacySetting} />
              </div>
            </CardHeader>

            {attributes.description && (
              <CardContent className='mt-2'>
                <CardDescription className='line-clamp-3'>{attributes.description}</CardDescription>
              </CardContent>
            )}

            <CardFooter className='mt-4'>
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
    </>
  );
}
