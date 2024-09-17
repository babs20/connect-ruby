import type { TGetGroupResponseSchema, TGetGroupsResponseSchema } from '@/api/schemas/groups';
import { GetGroupResponseSchema, GetGroupsResponseSchema } from '@/api/schemas/groups';
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const formGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  privacy_setting: z.enum(['public', 'private', 'invitation_only']),
});
export type TFormGroupSchema = z.infer<typeof formGroupSchema>;

export const groupsSearchSchema = z.object({
  page: z.number().catch(1),
});
export type GroupsSearchParams = z.infer<typeof groupsSearchSchema>;

export const groupsQueryOptions = (searchParams: GroupsSearchParams) => {
  return queryOptions({
    queryKey: ['groups', searchParams],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async (): Promise<TGetGroupsResponseSchema> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryString = new URLSearchParams(searchParams as any).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups?${queryString}`, {
        credentials: 'include',
      });

      const data = await response.json();
      const parsedRes = GetGroupsResponseSchema.safeParse(data);

      if (!parsedRes.success) {
        console.error(parsedRes.error);
        throw new Error('Validation error');
      }

      if (!response.ok) {
        throw new Error(parsedRes.data.message);
      }

      return parsedRes.data;
    },
  });
};

export const myGroupsQueryOptions = (searchParams: GroupsSearchParams) => {
  return queryOptions({
    queryKey: ['groups', 'my', searchParams],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async (): Promise<TGetGroupsResponseSchema> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryString = new URLSearchParams(searchParams as any).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/my?${queryString}`, {
        credentials: 'include',
      });

      const data = await response.json();
      const parsedRes = GetGroupsResponseSchema.safeParse(data);
      if (!parsedRes.success) {
        console.error(parsedRes.error);
        throw new Error('Validation error');
      }

      if (!response.ok) {
        throw new Error(parsedRes.data.message);
      }

      return parsedRes.data;
    },
  });
};

export const groupQueryOptions = (groupId: string) =>
  queryOptions({
    queryKey: ['groups', groupId],
    staleTime: 1000 * 60 * 5, // 5 minutes

    queryFn: async (): Promise<TGetGroupResponseSchema> => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/${groupId}`, {
        credentials: 'include',
      });

      const data = await response.json();
      const parsedRes = GetGroupResponseSchema.safeParse(data);
      if (!parsedRes.success) {
        console.error('Validation error:', parsedRes.error);
        return { message: 'Validation error', data: null };
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return parsedRes.data;
    },
  });

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: TFormGroupSchema) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
        credentials: 'include',
      });

      const data = await response.json();
      const parsedRes = GetGroupResponseSchema.safeParse(data);

      if (!parsedRes.success) {
        console.error('Validation error:', parsedRes.error);
        throw new Error('Validation error');
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return parsedRes.data;
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
    },
  });
};

export const useEditGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: TFormGroupSchema) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const parsedRes = GetGroupResponseSchema.safeParse(data);

      if (!parsedRes.success) {
        console.error('Validation error:', parsedRes.error);
        throw new Error('Validation error');
      }

      return parsedRes.data;
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ['groups', groupId],
      });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/${groupId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return { id: groupId };
    },
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
    },
  });
};
