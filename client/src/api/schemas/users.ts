import type { z } from 'zod';
import { ApiBaseDataSchema, ApiResponseSchema, UserSchema } from './shared/base';

export const GetCurrentUserResponseSchema = ApiResponseSchema(ApiBaseDataSchema(UserSchema, 'user'));
export type TGetCurrentUserResponseSchema = z.infer<typeof GetCurrentUserResponseSchema>;

export const PostLoginRequestSchema = ApiResponseSchema(ApiBaseDataSchema(UserSchema, 'user'));
export type TPostLoginRequestSchema = z.infer<typeof PostLoginRequestSchema>;

export const PostUserRegistrationRequestSchema = ApiResponseSchema(ApiBaseDataSchema(UserSchema, 'user'));
export type TPostUserRegistrationRequestSchema = z.infer<typeof PostUserRegistrationRequestSchema>;
