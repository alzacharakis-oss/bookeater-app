import * as userBookRepository from '../repositories/userBookRepository';
import * as bookRepository from '../repositories/bookRepository';
import { ReadingStatus} from "../models/UserBook";

export const getUserBooks = (userId: number) => {
    const userBooks = userBookRepository.findByUserId(userId);

    return userBooks.map((userBook) => {
        const book = bookRepository.findById(userBook.bookId);
        return {
            id: userBook.id,
            status: userBook.status,
            rating: userBook.rating,
            book: book, // title and author
        }
    });
};

export const addToWishlist =
    (userId: number, bookId: number) => {
    const existingEntry = userBookRepository.findByUserAndBookId(userId, bookId);

    if (existingEntry) {
        throw new Error('DUPLICATE_ENTRY');
    }
    return userBookRepository.create(userId, bookId, 'wishlist');
};

export const updateUserBook =
    (id: number, data: { status?: ReadingStatus; rating?: number | null }) => {
    if (data.rating !== undefined && data.rating !== null) {
        if (data.rating < 1 || data.rating > 5) {
            throw new Error('INVALID_RATING');
        }

        const existingEntry = userBookRepository.findById(id);
        const finalStatus = data.status ?? existingEntry?.status;

        if (finalStatus !== 'read') {
            throw new Error('BOOK_NOT_READ');
        }
    }
    return userBookRepository.update(id, data);
};

export const removeUserBook = (id: number): boolean => {
    return userBookRepository.remove(id);
};