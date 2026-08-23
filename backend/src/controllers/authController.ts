import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await userService.registerUser(
            username, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Login error:', error);

        if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({ message: 'Email already in use' });
    }
        if (error instanceof Error && error.message === 'USERNAME_ALREADY_EXISTS') {
            return res.status(409).json({ message: 'Username already in use' });
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await userService.loginUser(email, password);
        res.json(result);
    } catch (error) {
        console.error('Login error:', error);

        if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ message: 'Invalid email or password'});
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
};