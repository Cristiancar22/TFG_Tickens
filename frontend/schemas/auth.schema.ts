import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Correo no válido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string().min(1, { message: 'El nombre es obligatorio' }),
    surname: z.string().min(1, { message: 'Los apellidos son obligatorios' }),
    email: z
        .string()
        .min(1, { message: 'El email es obligatorio' })
        .email({ message: 'El email no es válido' }),
    password: z
        .string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
