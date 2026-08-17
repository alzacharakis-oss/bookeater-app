import { Book } from '../models/Book';

let books: Book[] = [
    { id: 1, title: 'Η Δίκη', author: 'Φραντς Κάφκα' },
    { id: 2, title: 'Η Φάρμα των Ζώων', author: 'Τζορτζ Όργουελ' },
    { id: 3, title: 'Σιντάρτα', author: 'Έρμαν Έσσε' },
]

let nextId = 4;

export const findAll = (): Book[] => {
    return books;
};

export const findById = (id: number): Book | undefined => {
    return books.find((book) => book.id === id);
}

export const create = (book: Omit<Book, 'id'>): Book => {
    const newBook: Book = { id: nextId, ...book };
    books.push(newBook);
    nextId++;
    return newBook;
};

export const update =
    (id: number, data: Partial<Omit< Book, 'id'>>): Book | undefined => {
    const book = books.find((book) => book.id === id);

    if (!book) {
        return undefined;
    }

    Object.assign(book, data);
    return book;
}

export const remove = (id: number): boolean => {
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
        return false;
    }

    books.splice(index, 1);
    return true;
}