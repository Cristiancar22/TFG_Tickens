import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Correo inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = loginSchema.extend({
    name: z.string().min(2, 'Nombre requerido'),
    surname: z.string().optional(),
})

export type RegisterSchema = z.infer<typeof registerSchema>
