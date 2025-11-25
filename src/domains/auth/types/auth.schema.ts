import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'El email es requerido')
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(val)
      },
      { message: 'El formato del email es inválido' }
    ),

  password: z.string().min(1, 'La contraseña es requerida'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type LoginCredentials = z.output<typeof loginSchema>
