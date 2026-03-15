/**
 * src/api/authApi.ts
 *
 * Module API pour l'authentification.
 * Utilisé par AuthService pour les opérations login/register.
 */

import apiClient from "@/api/apiClient";
import { ApiAuthResponse } from "@/types/api.types";
import { LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";

/**
 * Authentifie un utilisateur.
 * @throws AxiosError 401 si identifiants incorrects
 */
export async function loginUser(credentials: LoginCredentials): Promise<ApiAuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>("/auth/login", credentials);
    console.log("loginUser response.data:", response.data);

    return response.data;
}

/**
 * Crée un nouveau compte utilisateur.
 * @throws AxiosError 409 si email déjà utilisé
 */
export async function registerUser(payload: RegisterPayload): Promise<ApiAuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>("/auth/register", {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
    });
    return response.data;
}

/**
 * Déconnecte l'utilisateur côté serveur (invalide le token).
 * L'appel est optionnel — la déconnexion locale suffit souvent.
 */
export async function logoutUser(): Promise<void> {
    await apiClient.post("/auth/logout");
}