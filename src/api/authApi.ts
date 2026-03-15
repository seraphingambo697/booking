
/**
 * src/api/authApi.ts
 * Appels API authentification — backend Django.
 *
 * Endpoints backend :
 *   POST /api/v1/auth/register/
 *   POST /api/v1/auth/login/
 *   POST /api/v1/auth/logout/
 *   POST /api/v1/auth/refresh/
 *   GET  /api/v1/users/me/
 *   PATCH /api/v1/users/me/
 */
import { apiClient } from "./apiClient";
import { ApiUser } from "@/types/api.types";

export interface LoginResponse {
    tokens: { access: string; refresh: string };
    user: ApiUser;
}

export const authApi = {
    /**
     * POST /auth/login/
     * Retourne les tokens JWT + profil utilisateur.
     */
    login: async (credentials: {
        email: string;
        password: string;
    }): Promise<LoginResponse> => {
        const { data } = await apiClient.post<LoginResponse>("/auth/login/", credentials);
        return data;
    },

    /**
     * POST /auth/register/
     * Crée un compte. Le backend retourne le profil (sans token automatique).
     * Il faut ensuite appeler login() pour obtenir les tokens.
     */
    register: async (payload: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        phone?: string;
    }): Promise<ApiUser> => {
        const { data } = await apiClient.post<ApiUser>("/auth/register/", payload);
        return data;
    },

    /**
     * POST /auth/logout/
     * Blackliste le refresh token côté backend.
     */
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post("/auth/logout/", { refresh: refreshToken });
    },

    /**
     * POST /auth/refresh/
     * Renouvelle l'access token avec le refresh token.
     */
    refresh: async (refreshToken: string): Promise<{ access: string }> => {
        // SimpleJWT retourne directement { access: "..." }, pas d'enveloppe
        const response = await apiClient.post<{ access: string }>("/auth/refresh/", {
            refresh: refreshToken,
        });
        return response.data;
    },

    /**
     * GET /users/me/
     * Profil de l'utilisateur connecté.
     */
    getMe: async (): Promise<ApiUser> => {
        const { data } = await apiClient.get<ApiUser>("/users/me/");
        return data;
    },

    /**
     * PATCH /users/me/
     * Mise à jour du profil.
     */
    updateMe: async (payload: Partial<{
        first_name: string;
        last_name: string;
        phone: string;
        email: string;
        password: string;
    }>): Promise<ApiUser> => {
        const { data } = await apiClient.patch<ApiUser>("/users/me/", payload);
        return data;
    },
};
