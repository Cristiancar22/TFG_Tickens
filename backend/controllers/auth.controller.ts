import { Request, Response } from 'express';
import { IUser, User } from '../models/user.model';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, surname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'El correo ya está registrado.' });
            return;
        }

        const newUser = (await User.create({
            name,
            surname,
            email,
            passwordHash: password,
        })) as IUser;

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id.toString()),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error en el registro', error: err });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user) {
            res.status(401).json({ message: 'Credenciales incorrectas' });
            return;
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({ message: 'Credenciales incorrectas' });
            return;
        }

        res.json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            avatarUrl: user.avatarUrl,
            token: generateToken(user._id.toString()),
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error al iniciar sesión',
            error: err,
        });
    }
};

export const checkToken = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const user = req.user!;

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar token', error });
    }
};
