import { Pool } from 'pg';

export const pool = new Pool({
    user: 'bookeater_user',
    password: 'bookeater_pass',
    host: 'localhost',
    port: 5433,
    database: 'bookeater',
});