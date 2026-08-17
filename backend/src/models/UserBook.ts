
export type ReadingStatus = 'wishlist' | 'read';

export interface UserBook {
    id: number;
    userId: number;
    bookId: number;
    status: ReadingStatus;
    rating : number | null;
}