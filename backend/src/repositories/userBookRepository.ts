import { pool } from '../config/database'
import { UserBook, ReadingStatus} from "../models/UserBook";

const SELECT_COLUMNS = `id, user_id AS "userId", book_id AS "bookId", status, rating`;

export const findByUserId = async (
    userId: number): Promise<UserBook[]> => {
    const result = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM user_books WHERE user_id = $1`,
        [userId]
    );
    return result.rows;
};

export const findById = async (
    id: number): Promise<UserBook | undefined> => {
    const result = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM user_books WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

export const findByUserIdAndBookId = async (
    userId: number,
    bookId: number)
    : Promise<UserBook | undefined> => {
    const result = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM user_books WHERE user_id = $1 AND book_id = $2`,
        [userId, bookId]
    );
    return result.rows[0];
};

export const create = async (
    userId: number,
    bookId: number,
    status: ReadingStatus)
    : Promise<UserBook> => {
    const result = await pool.query(
        `INSERT INTO user_books (user_id, book_id, status, rating)
         VALUES ($1, $2, $3, NULL)
         RETURNING ${SELECT_COLUMNS}`,
         [userId, bookId, status]
    );
    return result.rows[0];
};

export const update = async (
    id: number,
    data: Partial<Pick<UserBook, 'status' | 'rating'>>)
    : Promise<UserBook | undefined> => {
    const existing = await findById(id);
    if (!existing) return undefined;

    const updatedStatus = data.status ?? existing.status;
    const updatedRating = data.rating !== undefined ? data.rating : existing.rating;

    const result = await pool.query(
        `UPDATE user_books SET status = $1, rating = $2 WHERE id = $3
        RETURNING ${SELECT_COLUMNS}`,
        [updatedStatus, updatedRating, id]
    );
    return result.rows[0];
};

export const remove = async (id: number): Promise<boolean> => {
    const result = await pool.query(
        `DELETE FROM user_books WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
};