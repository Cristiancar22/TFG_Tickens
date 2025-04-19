import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';

export const updatePassword = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const schema = z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.format() });
        return;
    }

    const { currentPassword, newPassword } = result.data;

    const user = await User.findById(req.user!._id).select('+passwordHash');

    try {
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const isValid = await user.comparePassword(currentPassword);

        if (!isValid) {
            res.status(401).json({ error: 'Contraseña actual incorrecta' });
            return;
        }

        user.passwordHash = newPassword;
        await user.save();

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: `Error interno del servidor: ${err}` });
    }
};

export const updateProfile = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const schema = z.object({
        name: z.string().min(1, 'El nombre es obligatorio'),
        surname: z.string().min(1, 'Los apellidos son obligatorios'),
        email: z.string().email('Correo inválido'),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.format() });
        return;
    }

    const { name, surname, email } = result.data;
    const user = req.user!;

    try {
        user.name = name;
        user.surname = surname;
        user.email = email;

        await user.save();

        const { passwordHash, ...safeUser } = user.toObject();

        res.json(safeUser);
    } catch (err) {
        res.status(500).json({ error: `Error actualizando el perfil: ${err}` });
    }
};

export const updateAvatar = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const user = req.user!;
    if (!req.file) {
        res.status(400).json({ error: 'No se envió ningún archivo' });
        return;
    }

    try {
        const filename = req.file.filename;
        user.avatarUrl = `/uploads/avatars/${filename}`;
        await user.save();

        res.json({ avatarUrl: user.avatarUrl });
    } catch (error) {
        res.status(500).json({
            error: `Error al actualizar el avatar: ${error}`,
        });
    }
};
