import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import type { LoginCredentials, RegisterPayload } from "../services/IAuthService";

export interface IAuthPresenter {
    onLogin(credentials: LoginCredentials): Promise<void>;
    onRegister(payload: RegisterPayload): Promise<void>;
    onLogout(): void;
    getViewModel(): AuthViewModel;
}