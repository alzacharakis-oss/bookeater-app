import { Request, Response } from 'express';
import * as bookService from '../services/bookService'

export const getAllBooks = (req: Request, res: Response) => {
    const books = bookService.getAllBooks();
    res.json(books);
};

export const getBookById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = bookService.getBookById(id);

    if (!book) {
        return res.status(404).json({message: 'Book not found'});
    }
    res.json(book);
};

export const createBook = (req: Request, res: Response) => {
    const newBook = bookService.createBook(req.body);
    res.status(201).json(newBook);
};

export const updateBook = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updatedBook = bookService.updateBook(id, req.body);

    if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json(updatedBook);
};

export const deleteBook = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const wasDeletedBook = bookService.deleteBook(id);

    if (!wasDeletedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.status(204).send();
}