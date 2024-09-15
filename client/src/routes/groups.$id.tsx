import { groupQueryOptions } from '@/utils/groupQueryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/groups/$id')({
  loader: ({ context: { queryClient }, params: { id } }) => queryClient.ensureQueryData(groupQueryOptions(id)),
  component: Page,
});

function Page() {
  const params = Route.useParams();
  const { data: query } = useSuspenseQuery(groupQueryOptions(params.id));

  if (query.data === null) {
    return <div>Group not found</div>;
  }

  return (
    <div>
      <h1 className='text-4xl font-bold leading-snug text-white'>{query.data.attributes.name}</h1>
      <p>{query.data.attributes.description}</p>
      <p>Privacy Setting: {query.data.attributes.privacySetting}</p>
      <p>Created At: {query.data.attributes.createdAt}</p>
      <p>Updated At: {query.data.attributes.updatedAt}</p>
    </div>
  );
}
