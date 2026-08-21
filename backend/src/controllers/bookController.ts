import { Request, Response } from 'express';
import * as bookService from '../services/bookService'

export const getAllBooks = async (req: Request, res: Response) => {
    const books = await bookService.getAllBooks();
    res.json(books);
};

export const getBookById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = await bookService.getBookById(id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
};

export const createBook = async (req: Request, res: Response) => {
    const newBook = await bookService.createBook(req.body);
    res.status(201).json(newBook);
};

export const updateBook = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updatedBook = await bookService.updateBook(id, req.body);

    if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
};

export const deleteBook = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const wasDeletedBook = await bookService.deleteBook(id);

    if (!wasDeletedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send();
};