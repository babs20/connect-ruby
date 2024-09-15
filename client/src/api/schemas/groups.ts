import { z } from 'zod';
import { ApiBaseDataSchema, ApiResponseSchema } from './shared/base';

const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  privacySetting: z.enum(['Public', 'Private', 'Invitation Only']),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TGroupSchema = z.infer<typeof GroupSchema>;

export const GetGroupsResponseSchema = ApiResponseSchema(z.array(ApiBaseDataSchema(GroupSchema, 'group')));
export type TGetGroupsResponseSchema = z.infer<typeof GetGroupsResponseSchema>;

export const GetGroupResponseSchema = ApiResponseSchema(ApiBaseDataSchema(GroupSchema, 'group'));
export type TGetGroupResponseSchema = z.infer<typeof GetGroupResponseSchema>;
