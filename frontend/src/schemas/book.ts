import { z } from 'zod';

export const bookSchema = z.object({
    id: z.number(),
    title: z.string(),
    author: z.string(),
});

export type Book = z.infer<typeof bookSchema>;