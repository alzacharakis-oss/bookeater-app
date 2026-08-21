import { pool } from '../config/database';
import { Book } from '../models/Book';

export const findAll = async (): Promise<Book[]> => {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    return result.rows;
};

export const findById = async (id: number): Promise<Book | undefined> => {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
}

export const create = async (book: Omit<Book, 'id'>): Promise<Book> => {
    const result = await pool.query(
        'INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *',
        [book.title, book.author]
    );
    return result.rows[0];
};

export const update = async (
    id: number,
    data: Partial<Omit<Book, 'id'>>
): Promise<Book | undefined> => {
    const existing = await findById(id);
    if (!existing) return undefined;

    const updatedTitle = data.title ?? existing.title;
    const updatedAuthor = data.author ?? existing.author;

    const result = await pool.query(
        'UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *',
        [updatedTitle, updatedAuthor, id]
    );
    return result.rows[0];
};

export const remove = async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM books WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};