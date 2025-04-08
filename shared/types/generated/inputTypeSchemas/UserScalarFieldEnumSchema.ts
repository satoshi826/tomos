import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','googleId','name','color','createdAt']);

export default UserScalarFieldEnumSchema;
