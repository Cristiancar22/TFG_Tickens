import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { IUser, User } from '../models/user.model';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response): Promise<any> => {
	const { name, surname, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: 'El correo ya está registrado.' });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newUser = (await User.create({
			name,
			surname,
			email,
			passwordHash,
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

export const login = async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		const isMatch = await bcrypt.compare(password, user.passwordHash);

		if (!isMatch) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id.toString()),
		});
	} catch (err) {
		res.status(500).json({
			message: 'Error al iniciar sesión',
			error: err,
		});
	}
};
