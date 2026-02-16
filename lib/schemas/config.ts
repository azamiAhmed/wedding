import { z } from 'zod'

export const configUpdateSchema = z.object({
  key: z.enum(['show_venue', 'show_program', 'show_merci'], {
    message: 'Clé de configuration invalide',
  }),
  value: z.enum(['true', 'false'], {
    message: 'La valeur doit être "true" ou "false"',
  }),
})

export type ConfigUpdateInput = z.infer<typeof configUpdateSchema>
