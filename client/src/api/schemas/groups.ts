import { z } from 'zod';
import { ApiBaseDataSchema, ApiResponseSchema } from './shared/base';

const GroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  privacySetting: z.enum(['public', 'private', 'invitation_only']),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TGroupSchema = z.infer<typeof GroupSchema>;

export const GroupBaseDataSchema = ApiBaseDataSchema(GroupSchema, 'group');
export const GetGroupsResponseSchema = ApiResponseSchema(z.array(GroupBaseDataSchema));
export type TGetGroupsResponseSchema = z.infer<typeof GetGroupsResponseSchema>;

export const GetGroupResponseSchema = ApiResponseSchema(GroupBaseDataSchema);
export type TGetGroupResponseSchema = z.infer<typeof GetGroupResponseSchema>;
