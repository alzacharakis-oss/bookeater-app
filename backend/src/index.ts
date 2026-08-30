import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import userBookRoutes from './routes/userBookRoutes';
import bookRoutes from './routes/bookRoutes';
import { pool } from './config/database';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec} from "./config/swagger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Bookeater API is running',
        docs: '/api-docs',
    });
});

app.use('/api/books', bookRoutes);

app.use('/api/user-books', userBookRoutes);

app.use('/api/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

pool.query('SELECT NOW()')
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection failed', err.message));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});