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

export const groupsQueryOptions = queryOptions({
  queryKey: ['groups'],
  staleTime: 1000 * 60 * 5, // 5 minutes
  queryFn: async (): Promise<TGetGroupsResponseSchema> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`, {
      credentials: 'include',
    });

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups/${groupId}`, {
        credentials: 'include',
      });

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
    onSuccess(data) {
      queryClient.setQueryData<TGetGroupsResponseSchema>(groupsQueryOptions.queryKey, (oldData) => {
        if (oldData && data.data && oldData.data) {
          return {
            ...oldData,
            data: [...oldData.data, data.data],
          };
        } else if (data.data) {
          return {
            message: data.message,
            data: [data.data],
          };
        } else {
          return oldData;
        }
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
        return { message: 'Validation error', data: null };
      }

      return parsedRes.data;
    },
    onSuccess(data) {
      queryClient.setQueryData<TGetGroupResponseSchema>(['groups', groupId], (oldData) => {
        if (oldData && data.data) {
          return {
            ...oldData,
            data: { ...oldData.data, ...data.data },
          };
        } else {
          return oldData;
        }
      });

      queryClient.setQueryData<TGetGroupsResponseSchema>(groupsQueryOptions.queryKey, (oldData) => {
        if (oldData && data.data && oldData.data) {
          return {
            ...oldData,
            data: oldData.data.map((group) => (group.id === data.data?.id ? data.data : group)),
          };
        } else {
          return oldData;
        }
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
    onSuccess(data, variables) {
      queryClient.setQueryData<TGetGroupsResponseSchema>(groupsQueryOptions.queryKey, (oldData) => {
        if (oldData && oldData.data) {
          return {
            ...oldData,
            data: oldData.data.filter((group) => group.id !== data.id),
          };
        } else {
          return oldData;
        }
      });

      queryClient.removeQueries({
        queryKey: ['groups', variables],
      });
    },
  });
};
