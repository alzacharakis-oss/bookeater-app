import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (
    username: string,
    email: string,
    password: string
) => {
    if (password.length < 8) {
        throw new Error('WEAK_PASSWORD_LENGTH');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('WEAK_PASSWORD_UPPERCASE');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('WEAK_PASSWORD_NUMBER');
    }

    const existingEmail = await userRepository.findByEmail(email);

    if (existingEmail) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
        throw new Error('USERNAME_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await userRepository.create(username, email, passwordHash);

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

export const loginUser = async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    return { token };
};