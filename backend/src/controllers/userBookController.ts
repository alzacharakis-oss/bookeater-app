import { Response } from 'express';
import * as userBookService from '../services/userBookService';
import { AuthenticatedRequest} from "../middleware/auth";

export const getUserBooks = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId as number;
    const result = await userBookService.getUserBooks(userId);
    res.json(result);
};

export const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId as number;
    const { bookId } = req.body;

    try {
        const newUserBook = await userBookService.addToWishlist(userId, bookId);
        res.status(201).json(newUserBook);
    } catch (error) {
        if (error instanceof Error && error.message === 'DUPLICATE_ENTRY') {
            return res.status(409).json({ message: 'Book already in your list'});
        }
        console.error('Add to wishlist error', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateUserBook =
    async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.userId as number;

    try {
        const updatedUserBook =
            await userBookService.updateUserBook(id, userId, req.body);

        if (!updatedUserBook) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json(updatedUserBook);
    } catch (error) {
        if (error instanceof Error && error.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'You do not own this entry' });
        }
        if (error instanceof Error && error.message === 'INVALID_RATING') {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (error instanceof Error && error.message === 'BOOK_NOT_READ') {
            return res.status(400).json({ message: 'You can only rate books marked as read' });
        }
        console.error('Update user book error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const removeUserBook =
    async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const userId = req.userId as number;

    try {
        const wasDeletedUserBook = await userBookService.removeUserBook(id, userId);

        if (!wasDeletedUserBook) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(204).send();
    } catch (error) {
        if (error instanceof Error && error.message === 'FORBIDDEN') {
            return res.status(403).json({ message: 'You do not own this entry' });
        }
        console.error('Remove user book error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};