import { z } from 'zod';

export const MessageScalarFieldEnumSchema = z.enum(['id','userId','topicId','content','x','y','createdAt','updatedAt']);

export default MessageScalarFieldEnumSchema;
