import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../models/user.model';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
        };

        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
        return;
    }
};
