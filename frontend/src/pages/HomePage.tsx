import { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Book } from '@/schemas/book';

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await api.get('/books');
                setBooks(data);
            } catch (error) {
                toast.error('Failed to load books');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleAddToWishlist = async (bookId: number) => {
        try {
            await api.post('/user-books', { bookId });
            toast.success('Book added to your wishlist!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add book');
        }
    };

    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <p className="text-center text-slate-500">Loading books...</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-teal-800">Browse Books</h1>

            <Input
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredBooks.map((book) => (
                    <div
                        key={book.id}
                        className="border border-teal-100 rounded-lg p-4 bg-white shadow-sm flex
                        flex-col justify-between"
                    >
                        <div>
                            <h2 className="font-semibold text-slate-800">{book.title}</h2>
                            <p className="text-sm text-slate-500">{book.author}</p>
                        </div>

                        {isAuthenticated && (
                            <Button
                                onClick={() => handleAddToWishlist(book.id)}
                                variant="outline"
                                className="mt-3 border-purple-300 text-purple-700 hover:bg-purple-50 self-start"
                            >
                                + Add to Wishlist
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <p className="text-center text-slate-500">No books found.</p>
            )}
        </div>
    );
}