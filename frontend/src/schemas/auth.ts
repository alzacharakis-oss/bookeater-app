import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

export type LoginFields = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string().min(5, 'Username must be at least 5 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterFields = z.infer<typeof registerSchema>;