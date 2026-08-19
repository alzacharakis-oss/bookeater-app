import { UserBook, ReadingStatus} from "../models/UserBook";

let userBooks: UserBook[] = [];
let nextId = 1;

export const findByUserId = (userId: number): UserBook[] => {
    return userBooks.filter((userBook) => userBook.userId === userId);
};

export const findById = (id: number): UserBook | undefined => {
    return userBooks.find((userBook) => userBook.id === id);
};

export const findByUserAndBookId =
    (userId: number, bookId: number): UserBook | undefined => {
    return userBooks.find(
        (userBook) => userBook.userId === userId && userBook.bookId === bookId);
    };

export const create = (userId: number, bookId: number, status: ReadingStatus): UserBook => {
    const newUserBook: UserBook = {
        id: nextId,
        userId,
        bookId,
        status,
        rating: null,
    };
    userBooks.push(newUserBook);
    nextId++;
    return newUserBook;
};

export const update =
    (id: number, data: Partial<Pick<UserBook, 'status' | 'rating'>>): UserBook | undefined => {
    const userBook = userBooks.find((userBook) => userBook.id === id);

    if (!userBook) {
        return undefined;
    }

    Object.assign(userBook, data);
    return userBook;
};

export const remove = (id: number): boolean => {
    const index = userBooks.findIndex((userBook) => userBook.id === id);

    if (index === -1) {
        return false;
    }

    userBooks.splice(index, 1);
    return true;
};