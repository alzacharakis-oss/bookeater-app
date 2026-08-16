import { Router } from 'express';
import * as bookController from '../controllers/bookController';

const router = Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);

export default router;