import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { api } from '@/api/client';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Field, FieldLabel } from '@/components/ui/field';
import { toast } from 'sonner';
import { type CreateBookFields, createBookSchema, type Book } from "@/schemas/book.ts";

interface BookCardProps {
    book: Book;
    onWishlistAdd: (bookId: number) => void;
    onBookUpdated: (book: Book) => void;
    onBookDeleted: (bookId: number) => void;
}

export default function BookCard({ book, onWishlistAdd, onBookUpdated, onBookDeleted} : BookCardProps) {
    const { isAuthenticated, isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<CreateBookFields>({
        resolver: zodResolver(createBookSchema),
        defaultValues: { title: book.title, author: book.author },
    });

    const onSubmitEdit = async (data: CreateBookFields) => {
        try {
            const updated = await api.put(`/books/${book.id}`, data);
            onBookUpdated(updated);
            toast.success('Book updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update book');
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${book.title}"? This cannot be undone!`)) {
            return;
        }
        try {
            await api.delete(`/books/${book.id}`);
            onBookDeleted(book.id);
            toast.success('Book deleted successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete book');
        }
    };

    if (isEditing) {
        return (
            <form
                onSubmit={handleSubmit(onSubmitEdit)}
                className="border border-purple-200 rounded-lg p-4 bg-purple-50 space-y-3"
            >
                <Field>
                    <FieldLabel htmlFor={'title-${book.id}'}>Title</FieldLabel>
                    <Input id={`title-${book.id}`} {...register('title')} />
                    {errors.title && <div className="text-red-600 text-sm">
                        {errors.title.message}</div>}
                </Field>
                <Field>
                    <FieldLabel htmlFor={`author-${book.id}`}>Author</FieldLabel>
                    <Input id={`author-${book.id}`} {...register('author')} />
                    {errors.author && <div className="text-red-600 text-sm">{errors.author.message}</div>}
                </Field>
                <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isSubmitting}
                            className="bg-teal-600 hover:bg-teal-700 text-white">
                        Save
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="border border-teal-100 rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
            <div>
                <h2 className="font-semibold text-slate-800">{book.title}</h2>
                <p className="text-sm text-slate-500">{book.author}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {isAuthenticated && (
                    <Button
                        onClick={() => onWishlistAdd(book.id)}
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                        + Wishlist
                    </Button>
                )}

                {isAdmin && (
                    <>
                        <Button
                            onClick={() => setIsEditing(true)}
                            size="sm"
                            variant="outline"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={handleDelete}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
