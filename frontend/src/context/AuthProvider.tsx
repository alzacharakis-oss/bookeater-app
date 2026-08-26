import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from '@/api/client';

interface DecodedToken {
    userId: number;
    isAdmin: boolean;
}

interface AuthContextType {
    userId: number | null;
    isAdmin: boolean;
    isAuthenticated: boolean;
    loginUser: (data: { email: string; password: string }) => Promise<void>;
    registerUser: (data: { username: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setUserId(decoded.userId);
                setIsAdmin(decoded.isAdmin);
            } catch {
                Cookies.remove('token');
            }
        }
    }, []);

    const loginUser = async (data:
                             { email: string; password: string }) => {
        const response = await api.post('/auth/login', data);
        const decoded = jwtDecode<DecodedToken>(response.token);

        Cookies.set('token', response.token, {expires: 1 / 12});
        setUserId(decoded.userId);
        setIsAdmin(decoded.isAdmin);
    }

    const registerUser = async (data:
                                { username: string, email: string; password: string }) => {
        await api.post('/auth/register', data);
    };

    const logout = () => {
        Cookies.remove('token');
        setUserId(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider
            value={{
                userId,
                isAdmin,
                isAuthenticated: userId !== null,
                loginUser,
                registerUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a useAuthProvider');
    }
    return context;
}