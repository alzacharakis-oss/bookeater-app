import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().trim().min(1, 'Password is required'),
})

export type LoginFields = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string().trim().min(5, 'Username must be at least 5 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z
        .string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number letter'),
});

export type RegisterFields = z.infer<typeof registerSchema>;