import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository';
import {User} from "../models/User";

const SALT_ROUNDS = 10;

export const registerUser = async (
    username: string,
    email: string,
    password: string
) => {
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