import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';

export const createTestUserAndToken = async () => {
    const user = await User.create({
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        passwordHash: 'hashed',
        registrationDate: new Date(),
        accountStatus: 'active',
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });

    return { user, token };
};
