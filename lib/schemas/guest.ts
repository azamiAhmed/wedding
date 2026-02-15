import { z } from 'zod'

export const guestCreateSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  groupName: z.string().optional(),
  maxPersons: z.number().int().min(1).max(10).default(1),
})

export type GuestCreateInput = z.infer<typeof guestCreateSchema>

export const guestUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'declined'], {
    message: 'Statut invalide',
  }),
  personsConfirmed: z
    .number()
    .int()
    .min(0, 'Le nombre de personnes doit être au moins 0')
    .max(5, 'Le nombre de personnes ne peut pas dépasser 5'),
})

export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>
