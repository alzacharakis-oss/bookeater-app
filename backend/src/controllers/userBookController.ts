import { Request, Response } from 'express';
import * as userBookService from '../services/userBookService';

export const getUserBooks = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const result = userBookService.getUserBooks(userId);
    res.json(result);
};

export const addToWishlist = (req: Request, res: Response) => {
    const { userId, bookId } = req.body;

    try {
        const newUserBook = userBookService.addToWishlist(userId, bookId);
        res.status(201).json(newUserBook);
    } catch (error) {
        if (error instanceof Error && error.message === 'DUPLICATE_ENTRY') {
            return res.status(409).json({ message: 'Book already in your list'});
        }
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateUserBook =
    (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const updatedUserBook = userBookService.updateUserBook(id, req.body);

        if (!updatedUserBook) {
            return res.status(404).json({message: 'Entry Not Found'});
        }

        res.json(updatedUserBook);
    } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_RATING') {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (error instanceof Error && error.message === 'BOOK_NOT_READ') {
        return res.status(400).json({ message: 'You can only rate books marked as read' });
    }
    res.status(500).json({ message: 'Something went wrong' });
    }
};

export const removeUserBook = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const wasDeletedUserBook = userBookService.removeUserBook(id);

    if (!wasDeletedUserBook) {
        return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(204).send();
}