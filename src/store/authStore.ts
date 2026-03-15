/**
 * src/store/authStore.ts
 * Store Zustand pour l'authentification.
 *
 * Gère les deux tokens JWT :
 *   - access  : durée courte (60min), envoyé dans chaque requête
 *   - refresh : durée longue (7j),   utilisé pour renouveler l'access
 *
 * Persistance dans localStorage :
 *   - "auth_token"   → access token (lu par apiClient.ts)
 *   - "auth_refresh" → refresh token
 *   - "auth_user"    → profil utilisateur sérialisé
 */
import { create } from "zustand";

interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    pseudo: string;
    isAdmin: boolean;
}

interface AuthStore {
    user: AuthUser | null;
    isAuthenticated: boolean;

    /** Appelé après login/register réussi */
    setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;

    /** Appelé au logout */
    clearAuth: () => void;

    /** Charge l'état depuis localStorage au démarrage */
    hydrate: () => void;

    userId: string | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    userId: null,

    setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("auth_refresh", refreshToken);
        localStorage.setItem("auth_user", JSON.stringify(user));
        set({ user, isAuthenticated: true, userId: user.id });
    },

    clearAuth: () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_refresh");
        localStorage.removeItem("auth_user");
        set({ user: null, isAuthenticated: false, userId: null });
    },

    hydrate: () => {
        const raw = localStorage.getItem("auth_user");
        const token = localStorage.getItem("auth_token");
        if (raw && token) {
            try {
                const user = JSON.parse(raw) as AuthUser;
                set({ user, isAuthenticated: true, userId: user.id });
            } catch {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_refresh");
            }
        }
    },
}));
