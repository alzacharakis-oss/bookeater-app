import { Link, useNavigate } from "react-router";
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-teal-100 shadow-sm">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-teal-700">
                    Bookeater
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/" className="text-slate-600 hover:text-teal-600 transition-colors">
                        Browse
                    </Link>


                 {isAuthenticated ? (
                    <>
                        <Link to="/my-books" className="text-slate-600 hover:text-teal-600 transition-colors">
                            My Books
                        </Link>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                            Logout
                        </Button>
                    </>
                   ) : (
                    <>
                        <Link to="/login" className="text-slate-600 hover:text-teal-600 transition-colors">
                            Login
                        </Link>
                        <Button
                            onClick={() => navigate('/register')}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            Sign Up
                        </Button>
                    </>
                  )}
                </div>
            </div>
        </nav>
    );
}