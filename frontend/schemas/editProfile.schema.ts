import { z } from 'zod';

export const editProfileSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    surname: z.string().min(1, 'Los apellidos son obligatorios'),
    email: z.string().email('Correo no válido'),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
