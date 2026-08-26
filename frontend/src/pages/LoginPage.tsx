import { useAuth } from '@/context/AuthProvider';
import { Link, useNavigate } from "react-router";
import { type LoginFields, loginSchema } from '@/schemas/auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function LoginPage() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFields) => {
        try {
            await loginUser(data);
            toast.success("Logged in successfully");
            navigate("/my-books");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Login failed');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-sm mx-auto p-8 space-y-6 border border-teal-100 rounded-lg bg-white shadow-sm"
        >
            <h1 className="text-2xl font-bold text-center text-teal-800">
                Login
            </h1>

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
                {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </form>
    );
}