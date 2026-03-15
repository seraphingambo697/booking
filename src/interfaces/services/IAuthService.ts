import { User } from "@/core/entities/User";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    pseudo: string;
    email: string;
    password: string;
    phone?: string;
}

export interface AuthResult {
    user: User;
    token: string;
}

export interface IAuthService {
    login(credentials: LoginCredentials): Promise<AuthResult>;
    register(payload: RegisterPayload): Promise<AuthResult>;
    logout(): void;
    getCurrentUser(): User | null;
    isAuthenticated(): boolean;
}