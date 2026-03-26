/**
 * src/services/AuthService.ts
 * Service d'authentification connecté au backend Django.
 *
 * Flux login :
 *   1. POST /auth/login/   → { tokens: {access, refresh}, user: {...} }
 *   2. Stockage tokens dans localStorage (lu par apiClient.ts)
 *   3. Mise à jour du store Zustand via authStore.setAuth()
 *
 * Flux register :
 *   1. POST /auth/register/  → crée le compte, retourne le profil
 *   2. POST /auth/login/     → récupère les tokens
 */
import { IAuthService, LoginCredentials, RegisterPayload, AuthResult } from "@/interfaces/services/IAuthService";
import { User } from "@/core/entities/User";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { ApiUser } from "@/types/api.types";

function toUser(api: ApiUser): User {
    return {
        id: api.id,
        firstName: api.first_name,
        lastName: api.last_name,
        email: api.email,
        pseudo: api.pseudo,
        phone: api.phone ?? "",
        createdAt: new Date(api.created_at),
    };
}

export class AuthService implements IAuthService {

    async login(credentials: LoginCredentials): Promise<AuthResult> {
        const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
        });

        const user = toUser(response.user);

        // Mise à jour du store Zustand (gère aussi localStorage)
        useAuthStore.getState().setAuth(
            {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                pseudo: user.pseudo,
                isAdmin: response.user.is_admin,
            },
            response.tokens.access,
            response.tokens.refresh,
        );

        return { user, token: response.tokens.access };
    }

    async register(payload: RegisterPayload): Promise<AuthResult> {
        // Étape 1 — Créer le compte
        await authApi.register({
            first_name: payload.firstName,
            last_name: payload.lastName,
            email: payload.email,
            password: payload.password,
            phone: payload.phone,
        });

        return this.login({ email: payload.email, password: payload.password });
    }

    logout(): void {
        const refresh = localStorage.getItem("auth_refresh") ?? "";
        // Blacklist côté backend (fire & forget, pas bloquant)
        if (refresh) {
            authApi.logout(refresh).catch(() => { });
        }
        useAuthStore.getState().clearAuth();
    }

    getCurrentUser(): User | null {
        const store = useAuthStore.getState();
        if (!store.user) return null;
        return {
            id: store.user.id,
            firstName: store.user.firstName,
            lastName: store.user.lastName,
            email: store.user.email,
            pseudo: store.user.pseudo,
            phone: "",
            createdAt: new Date(),
        };
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem("auth_token");
    }
}
