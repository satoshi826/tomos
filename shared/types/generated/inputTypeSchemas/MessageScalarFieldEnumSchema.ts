import { z } from 'zod';

export const MessageScalarFieldEnumSchema = z.enum(['id','userId','topicId','content','color','x','y','createdAt','updatedAt']);

export default MessageScalarFieldEnumSchema;
