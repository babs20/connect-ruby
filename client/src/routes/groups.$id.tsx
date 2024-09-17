import { DeleteGroupDialog } from '@/components/dialogs/DeleteGroup';
import { EditGroupDialog } from '@/components/dialogs/EditGroup';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { AddUserSvg } from '@/components/svgs/AddUserSvg';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { groupQueryOptions } from '@/utils/groupQueryOptions';
import { humanize } from '@/utils/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/groups/$id')({
  loader: ({ context: { queryClient }, params: { id } }) => queryClient.ensureQueryData(groupQueryOptions(id)),
  component: Page,
  errorComponent: () => <div>Group not found</div>,
});

function Page() {
  const params = Route.useParams();
  const { data: query } = useSuspenseQuery(groupQueryOptions(params.id));

  if (!query.data) {
    return <div>Group not found</div>;
  }

  const group = query.data.attributes;

  return (
    <div className='container max-w-3xl space-y-4'>
      <div className='flex flex-row items-start justify-between pb-2 space-y-0'>
        <div>
          <h2 className='text-2xl font-bold'>{group.name}</h2>
          <div className='flex items-center gap-2 mt-4'>
            <PrivacyBadge variant='secondary' text={group.privacySetting} />
            <span className='text-sm text-muted-foreground'>
              Created on {new Date(group.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className='flex gap-2'>
          <EditGroupDialog group={query.data} />
          <DeleteGroupDialog group={query.data} />
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='space-y-6'>
          {group.description && <p className='text-muted-foreground'>{group.description}</p>}

          <div className='p-4 space-y-3 border rounded-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='mb-2 text-xl font-bold'>Members</h3>
              <Button size='sm'>
                <AddUserSvg className='w-4 h-4 mr-2' />
                <span>Invite Member</span>
              </Button>
            </div>
            <ul className='space-y-2'>
              {group.users?.map((user) => (
                <li key={user.id} className='flex items-center p-2 space-x-4 rounded-md hover:bg-accent/40'>
                  <Avatar>
                    <AvatarFallback className='font-bold'>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{user.email}</p>
                    <p className='text-sm text-muted-foreground'>{humanize(user.role)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
