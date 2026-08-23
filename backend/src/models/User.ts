
export interface User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    isAdmin: boolean;
}