import { z } from 'zod';

export const TopicScalarFieldEnumSchema = z.enum(['id','userId','areaId','title','x','y','createdAt','updatedAt']);

export default TopicScalarFieldEnumSchema;
