import { pool } from '../config/database';
import { User } from '../models/User';

const SELECT_COLUMNS = `id, username, email, password_hash AS "passwordHash", is_admin AS "isAdmin"`;

export const findByEmail = async (
    email: string): Promise<User | undefined> => {
    const result = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};

export const findByUsername = async (
    username: string): Promise<User | undefined> => {
    const result = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE username = $1`,
        [username]
    );
    return result.rows[0];
};

export const findById = async (
    id: number): Promise<User | undefined> => {
    const result = await pool.query(
        `SELECT ${SELECT_COLUMNS} FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

export const create = async (
    username: string,
    email: string,
    passwordHash: string
): Promise<User> => {
    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, is_admin) 
         VALUES ($1, $2, $3, false)
         RETURNING ${SELECT_COLUMNS}`,
        [username, email, passwordHash]
    );
    return result.rows[0];
};