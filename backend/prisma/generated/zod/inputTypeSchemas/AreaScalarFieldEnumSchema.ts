import { z } from 'zod';

export const AreaScalarFieldEnumSchema = z.enum(['id','name','x','y','width','height','createdAt','updatedAt']);

export default AreaScalarFieldEnumSchema;
