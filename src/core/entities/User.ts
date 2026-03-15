export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    pseudo: string;
    avatarUrl?: string;
    createdAt: Date;
}