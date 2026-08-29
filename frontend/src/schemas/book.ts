import { z } from 'zod';

export const bookSchema = z.object({
    id: z.number(),
    title: z.string(),
    author: z.string(),
});

export type Book = z.infer<typeof bookSchema>;

export const createBookSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z
        .string()
        .regex(/^[a-zA-ZΑ-ωά-ώΆ-Ώ\s.'-]+$/, 'Author name can only contain letters, spaces, and basic punctuation')
        .min(5, 'Author name must be at least 5 characters'),
});

export type CreateBookFields = z.infer<typeof createBookSchema>;