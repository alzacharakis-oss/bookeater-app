import { Request, Response } from 'express';
import * as userBookService from '../services/userBookService';

export const getUserBooks = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const result = userBookService.getUserBooks(userId);
    res.json(result);
};

export const addToWishlist = (req: Request, res: Response) => {
    const { userId, bookId } = req.body;
    const newUserBook = userBookService.addToWishlist(userId, bookId);
    res.status(201).json(newUserBook);
}

export const updateUserBook = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updatedUserBook = userBookService.updateUserBook(id, req.body);

    if (!updatedUserBook) {
        return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(updatedUserBook);
};

export const removeUserBook = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const wasDeletedUserBook = userBookService.removeUserBook(id);

    if (!wasDeletedUserBook) {
        return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(204).send();
}