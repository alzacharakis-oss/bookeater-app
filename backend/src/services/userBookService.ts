import * as userBookRepository from '../repositories/userBookRepository';
import * as bookRepository from '../repositories/bookRepository';
import { ReadingStatus } from '../models/UserBook';

export const getUserBooks = async (userId: number) => {
    const userBooks = await userBookRepository.findByUserId(userId);

    const enrichedUserBooks = await Promise.all(
        userBooks.map(async (userBook) => {
            const book = await bookRepository.findById(userBook.bookId);
            return {
                id: userBook.id,
                status: userBook.status,
                rating: userBook.rating,
                book: book,
            };
        })
    );

    return enrichedUserBooks;
};

export const addToWishlist = async (userId: number, bookId: number) => {
    const existingEntry = await userBookRepository.findByUserIdAndBookId(userId, bookId);

    if (existingEntry) {
        throw new Error('DUPLICATE_ENTRY');
    }

    return userBookRepository.create(userId, bookId, 'wishlist');
};

export const updateUserBook = async (
    id: number,
    data: { status?: ReadingStatus; rating?: number | null }
) => {
    if (data.rating !== undefined && data.rating !== null) {
        if (data.rating < 1 || data.rating > 5) {
            throw new Error('INVALID_RATING');
        }

        const existingEntry = await userBookRepository.findById(id);
        const finalStatus = data.status ?? existingEntry?.status;

        if (finalStatus !== 'read') {
            throw new Error('BOOK_NOT_READ');
        }
    }

    return userBookRepository.update(id, data);
};

export const removeUserBook = async (id: number): Promise<boolean> => {
    return userBookRepository.remove(id);
};