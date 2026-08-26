import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { type RegisterFields, registerSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthProvider';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router';

export default function RegisterPage() {
    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFields>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFields) => {
        try {
            await registerUser(data);
            toast.success('Account created! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto p-8 space-y-6 border border-teal-100 rounded-lg bg-white shadow-sm"
        >
            <h1 className="text-2xl font-bold text-center text-teal-800">Sign Up</h1>

            <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" {...register('username')} />
                {errors.username && (
                    <div className="text-red-600 text-sm">{errors.username.message}</div>
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                    <div className="text-red-600 text-sm">{errors.email.message}</div>
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && (
                    <div className="text-red-600 text-sm">{errors.password.message}</div>
                )}
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:underline">
                    Login
                </Link>
            </p>
        </form>
    );
}