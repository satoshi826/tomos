import { z } from 'zod'

export const AreaScalarFieldEnumSchema = z.enum(['id', 'name', 'x', 'y', 'createdAt', 'updatedAt'])

export default AreaScalarFieldEnumSchema
