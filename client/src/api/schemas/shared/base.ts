import { z } from 'zod';

export const ApiResponseSchema = <TData>(dataSchema: z.ZodType<TData>) =>
  z.object({
    message: z.string(),
    data: z.union([dataSchema, z.null()]),
  });

export const ApiBaseDataSchema = <TAttribute, TType extends string>(
  attributeSchema: z.ZodType<TAttribute>,
  type: TType,
) =>
  z.object({
    id: z.string(),
    type: z.literal(type),
    attributes: attributeSchema,
  });

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TUserSchema = z.infer<typeof UserSchema>;
