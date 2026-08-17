import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userBookRoutes from './routes/userBookRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

import bookRoutes from './routes/bookRoutes';

app.use('/api/books', bookRoutes);

app.use('/api/user-books', userBookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});