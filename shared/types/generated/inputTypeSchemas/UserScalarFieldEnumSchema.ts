import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','userId','googleId','name','color','createdAt']);

export default UserScalarFieldEnumSchema;
