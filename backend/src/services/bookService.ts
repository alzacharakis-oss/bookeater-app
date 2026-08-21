import * as bookRepository from '../repositories/bookRepository';
import { Book } from '../models/Book';

export const getAllBooks = async (): Promise<Book[]> => {
    return bookRepository.findAll();
};

export const getBookById = async (id: number): Promise<Book | undefined> => {
    return bookRepository.findById(id);
};

export const createBook = async (data: Omit<Book, 'id'>): Promise<Book> => {
    return bookRepository.create(data);
};

export const updateBook = async (
    id: number,
    data: Partial<Omit<Book, 'id'>>
): Promise<Book | undefined> => {
    return bookRepository.update(id, data);
};

export const deleteBook = async (id: number): Promise<boolean> => {
    return bookRepository.remove(id);
};