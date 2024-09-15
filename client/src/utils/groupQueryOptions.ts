import type { TGetGroupResponseSchema, TGetGroupsResponseSchema } from '@/api/schemas/groups';
import { GetGroupResponseSchema, GetGroupsResponseSchema } from '@/api/schemas/groups';
import { queryOptions } from '@tanstack/react-query';

export const groupsQueryOptions = queryOptions({
  queryKey: ['groups'],
  staleTime: 1000 * 60 * 5, // 5 minutes
  queryFn: async (): Promise<TGetGroupsResponseSchema> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const parsedRes = GetGroupsResponseSchema.safeParse(data);

    if (!parsedRes.success) {
      console.error('Validation error:', parsedRes.error);
      return { message: 'Validation error', data: null };
    }

    return parsedRes.data;
  },
});

export const groupQueryOptions = (groupId: string) =>
  queryOptions({
    queryKey: ['groups', groupId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async (): Promise<TGetGroupResponseSchema> => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/${groupId}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const parsedRes = GetGroupResponseSchema.safeParse(data);

      if (!parsedRes.success) {
        console.error('Validation error:', parsedRes.error);
        return { message: 'Validation error', data: null };
      }

      return parsedRes.data;
    },
  });
