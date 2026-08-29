import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';
import BookCard from '@/components/BookCard.tsx'
import { type CreateBookFields, createBookSchema, type Book } from '@/schemas/book';

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateBookFields>({
        resolver: zodResolver(createBookSchema),
    });

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

        void fetchBooks();
    }, []);

    const handleAddToWishlist = async (bookId: number) => {
        try {
            await api.post('/user-books', { bookId });
            toast.success('Book added to your wishlist!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add book to wishlist');
        }
    };

    const handleCreateBook = async (data: CreateBookFields) => {
        try {
            const newBook = await api.post('/books', data);
            setBooks((prev) => [...prev, newBook]);
            toast.success('Book added to the library!');
            reset();
            setShowAddForm(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add book to library');
        }
    };

    const handleBookUpdated = (updatedBook: Book) => {
        setBooks((prev) =>
            prev.map((book) =>
                (book.id === updatedBook.id ? updatedBook : book)));
    }

    const handleBookDeleted = (bookId: number) => {
        setBooks((prev) =>
            prev.filter((book) => book.id !== bookId));
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

            {isAuthenticated && (
                <div>
                    {!showAddForm ? (
                        <Button
                            onClick={() => setShowAddForm(true)}
                            variant="outline"
                            className="border-teal-300 text-teal-700 hover:bg-teal-50"
                        >
                            Can't find a book? Add it
                        </Button>
                    ) : (
                        <form
                            onSubmit={handleSubmit(handleCreateBook)}
                            className="max-w-md p-4 border border-teal-100 rounded-lg bg-white shadow-sm space-y-3"
                        >
                            <Field>
                                <FieldLabel htmlFor="new-title">Title</FieldLabel>
                                <Input id="new-title" {...register('title')} />
                                {errors.title && <div className="text-red-600 text-sm">{errors.title.message}</div>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="new-author">Author</FieldLabel>
                                <Input id="new-author" {...register('author')} />
                                {errors.author && <div className="text-red-600 text-sm">{errors.author.message}</div>}
                            </Field>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    Add Book
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredBooks.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onWishlistAdd={handleAddToWishlist}
                        onBookUpdated={handleBookUpdated}
                        onBookDeleted={handleBookDeleted}
                    />
                    ))}
            </div>

            {filteredBooks.length === 0 && (
                <p className="text-center text-slate-500">No books found.</p>
            )}
        </div>
    );
}