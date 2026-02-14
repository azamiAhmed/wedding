import { z } from 'zod'

export const rsvpInputSchema = z
  .object({
    status: z.enum(['confirmed', 'declined']),
    personsConfirmed: z.number().int().min(1).max(5).optional(),
  })
  .refine(
    (data) =>
      data.status !== 'confirmed' ||
      (data.personsConfirmed !== undefined && data.personsConfirmed >= 1),
    {
      error: 'personsConfirmed est requis pour une confirmation (1-5)',
      path: ['personsConfirmed'],
    }
  )

export type RsvpInput = z.infer<typeof rsvpInputSchema>
