import { z } from 'zod'

export const loginInputSchema = z.object({
  password: z.string().min(1),
})

export type LoginInput = z.infer<typeof loginInputSchema>
