import * as bookRepository from '../repositories/bookRepository';
import { Book } from '../models/Book';

export const getAllBooks = (): Book[] => {
    return bookRepository.findAll();
};

export const getBookById = (id: number): Book | undefined => {
    return bookRepository.findById(id);
};

export const createBook = (data: Omit<Book, 'id'>): Book => {
    return bookRepository.create(data);
}

export const updateBook = (id: number, data: Partial<Omit<Book, 'id'>>): Book | undefined => {
    return bookRepository.update(id, data);
};

export const deleteBook = (id: number): boolean => {
    return bookRepository.remove(id);
}