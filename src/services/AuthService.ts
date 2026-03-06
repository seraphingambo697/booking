/**
 * src/services/AuthService.ts
 *
 * Implémentation concrète de IAuthService.
 *
 * Gère :
 * - L'authentification (login/register)
 * - La persistance du token JWT dans localStorage
 * - La récupération de l'utilisateur courant
 *
 * En mock : compare avec des identifiants hardcodés
 * En production : utiliserait authApi.ts
 *
 * Compte de démonstration : demo@luxstay.fr / demo123
 */

import { User } from "@/core/entities/User";
import { IAuthService, LoginCredentials, RegisterPayload, AuthResult } from "@/interfaces/services/IAuthService";

/** Clés localStorage */
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/** Utilisateur de démonstration */
const DEMO_USER: User = {
    id: "u1",
    firstName: "Marie",
    lastName: "Dupont",
    email: "demo@luxstay.fr",
    phone: "+33 6 12 34 56 78",
    createdAt: new Date("2024-01-01"),
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class AuthService implements IAuthService {
    /** Cache en mémoire de l'utilisateur courant */
    private currentUser: User | null = null;

    async login(credentials: LoginCredentials): Promise<AuthResult> {
        await delay(600);

        // Validation mock — en production : appel à authApi.loginUser()
        if (credentials.email !== "demo@luxstay.fr" || credentials.password !== "demo123") {
            throw new Error("Email ou mot de passe incorrect");
        }

        // Génère un token mock (en production : reçu depuis l'API)
        const token = `mock-jwt-${Date.now()}`;

        // Persiste dans localStorage pour survivre au refresh de page
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER));

        this.currentUser = DEMO_USER;
        return { user: DEMO_USER, token };
    }

    async register(payload: RegisterPayload): Promise<AuthResult> {
        await delay(800);

        // En production : vérifier que l'email n'existe pas déjà
        const newUser: User = {
            id: `u${Date.now()}`,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phone: payload.phone,
            createdAt: new Date(),
        };

        const token = `mock-jwt-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));

        this.currentUser = newUser;
        return { user: newUser, token };
    }

    logout(): void {
        // Supprime le token et l'utilisateur du storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.currentUser = null;
    }

    getCurrentUser(): User | null {
        // 1. Retourne le cache mémoire si disponible
        if (this.currentUser) return this.currentUser;

        // 2. Sinon lit depuis localStorage (après refresh de page)
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
                return this.currentUser;
            } catch {
                // JSON invalide → nettoie le storage
                localStorage.removeItem(USER_KEY);
            }
        }

        return null;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }
}