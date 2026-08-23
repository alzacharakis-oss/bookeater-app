import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import userBookRoutes from './routes/userBookRoutes';
import bookRoutes from './routes/bookRoutes';
import { pool } from './config/database';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/books', bookRoutes);

app.use('/api/user-books', userBookRoutes);

app.use('/api/auth', authRoutes);

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected:', result.rows[0]);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});