import { z } from 'zod'

export const guestCreateSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  groupName: z.string().optional(),
  maxPersons: z.number().int().min(1).max(10).default(1),
})

export type GuestCreateInput = z.infer<typeof guestCreateSchema>
