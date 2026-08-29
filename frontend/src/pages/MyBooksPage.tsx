import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Book } from '@/schemas/book';

interface UserBook {
    id: number;
    status: 'wishlist' | 'read';
    rating: number | null;
    book: Book;
}

export default function MyBooksPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [userBooks, setUserBooks] = useState<UserBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Please login to access your wishlist');
            navigate('/login');
            return;
        }

        const fetchUserBooks = async () => {
            try {
                const data = await api.get('/user-books');
                setUserBooks(data);
            } catch (error) {
                toast.error('Failed to load your books');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserBooks();
    }, [isAuthenticated, navigate]);

    const handleMarkAsRead = async (id: number) => {
        try {
            const updated = await api.patch(`/user-books/${id}`, { status: 'read' });
            setUserBooks((prev) =>
                prev.map((userBook) =>
                (userBook.id === id ? { ...userBook, status: updated.status } : userBook)));
            toast.success('Marked as read!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update');
        }
    };

    const handleRate = async (id: number, rating: number) => {
        try {
            const updated = await api.patch(`/user-books/${id}`, { rating });
            setUserBooks((prev) =>
                prev.map((userBook) =>
                (userBook.id === id ? { ...userBook, rating: updated.rating} : userBook)));
            toast.success('Book rating saved!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to rate book');
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await api.delete(`/user-books/${id}`);
            setUserBooks((prev) =>
                prev.filter((userBook) => userBook.id !== id));
            toast.success('Removed from your list!')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to remove');
        }
    };

    if (isLoading) {
        return <p className="tect-center text-slate-500">Loading your books...</p>;
    }

    const wishlistBooks = userBooks.filter((userBook) => userBook.status === 'wishlist');
    const readBooks = userBooks.filter((userBook) => userBook.status === 'read');

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-teal-800">My Books</h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-700">Wishlist</h2>
                {wishlistBooks.length === 0 && <p className="text-slate-500">No books in your wishlist yet.</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistBooks.map((userBook) => (
                        <div key={userBook.id} className="border border-teal-100 rounded-lg p-4 bg-white shadow-sm">
                            <h3 className="font-semibold text-slate-800">{userBook.book.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">{userBook.book.author}</p>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleMarkAsRead(userBook.id)}
                                    size="sm"
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                    >
                                    Mark as Read
                                </Button>
                                <Button
                                    onClick={() => handleRemove(userBook.id)}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 hover:bg-red-50  text-red-600"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-700">Read</h2>
                {readBooks.length === 0 && <p className="text-slate-500">No books marked as read yet.</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {readBooks.map((userBook) => (
                        <div key={userBook.id} className="border border-purple-100 rounded-lg p-4 bg-white shadow-sm">
                            <h3 className="font-semibold text-slate-800">{userBook.book.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">{userBook.book.author}</p>

                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(userBook.id, star)}
                                    className={`text-2xl ${ userBook.rating 
                                    && star <= userBook.rating ? 'text-purple-500' : 'text-slate-300'                                    
                                    }`}
                                >
                                    ★
                                </button>
                                ))}
                            </div>

                            <Button
                                onClick={() => handleRemove(userBook.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50  text-red-600"
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}