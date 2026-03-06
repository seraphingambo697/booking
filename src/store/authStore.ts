/**
 * src/store/authStore.ts
 *
 * Store Zustand pour l'état d'authentification global.
 *
 * Différence avec AuthPresenter/AuthViewModel :
 * - AuthViewModel : état UI (messages d'erreur, chargement, initiales...)
 * - authStore : état global minimal (userId, isAuthenticated)
 *
 * Le store est utilisé par les hooks qui ont besoin de l'userId
 * (useBooking, useMyBookings) sans passer par le presenter auth.
 *
 * Synchronisé par useAuth → quand onLogin réussit, setAuth() est appelé.
 */

import { create } from "zustand";

interface AuthStore {
    /** ID de l'utilisateur connecté (null si non connecté) */
    userId: string | null;

    /** true si un utilisateur est connecté */
    isAuthenticated: boolean;

    /** Connecte un utilisateur */
    setAuth: (userId: string) => void;

    /** Déconnecte l'utilisateur */
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    userId: null,
    isAuthenticated: false,

    setAuth: (userId) =>
        set({ userId, isAuthenticated: true }),

    clearAuth: () =>
        set({ userId: null, isAuthenticated: false }),
}));