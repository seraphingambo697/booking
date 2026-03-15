/**
 * src/hooks/useAuth.ts
 *
 * Hook : authentification (Header, LoginPage, RegisterPage).
 *
 * Responsabilités :
 *  1. Instancie AuthPresenter une seule fois (useRef)
 *  2. Stocke le ViewModel local dans useState → re-render des composants
 *  3. Synchronise le ViewModel avec authStore au démarrage (hydration)
 *  4. Expose onLogin / onRegister / onLogout
 *
 * NE PAS appeler setAuth() / clearAuth() ici.
 * C'est AuthService qui les appelle directement via useAuthStore.getState().
 * Le hook se contente de LIRE le store pour synchroniser l'affichage.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import { AuthService } from "@/services/AuthService";
import { useAuthStore } from "@/store/authStore";
import { LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";
import { ROUTES } from "@/router/routes";

// Singleton — une seule instance pour toute la durée de vie de l'app
const authService = new AuthService();

export function useAuth() {
    const navigate = useNavigate();
    const authStore = useAuthStore();

    // ── ViewModel local (état de l'UI : isLoading, hasError, nom affiché…) ──────
    const [vm, setVm] = useState<AuthViewModel>(() => {
        // Initialisation depuis le store déjà hydraté (main.tsx appelle hydrate())
        const u = authStore.user;
        return {
            isAuthenticated: authStore.isAuthenticated,
            isLoading: false,
            hasError: false,
            userName: u ? `${u.firstName} ${u.lastName}` : undefined,
            userEmail: u?.email,
            userInitials: u ? `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() : undefined,
        };
    });

    // ── Presenter — instancié UNE SEULE FOIS ─────────────────────────────────────
    // Le callback setVm met à jour le ViewModel local.
    // Il NE touche PAS au store global — AuthService s'en charge.
    const presenterRef = useRef(
        new AuthPresenter(authService, (newVm: AuthViewModel) => {
            setVm(newVm);
        })
    );

    // ── Restaure la session au montage ────────────────────────────────────────────
    useEffect(() => {
        presenterRef.current.init();
    }, []);

    // ── Synchronise le ViewModel si le store change (ex: expiration du token) ────
    useEffect(() => {
        const u = authStore.user;
        if (authStore.isAuthenticated && u) {
            setVm((prev) => ({
                ...prev,
                isAuthenticated: true,
                userName: `${u.firstName} ${u.lastName}`,
                userEmail: u.email,
                userInitials: `${u.firstName[0]}${u.lastName[0]}`.toUpperCase(),
            }));
        } else if (!authStore.isAuthenticated) {
            setVm((prev) => ({
                ...prev,
                isAuthenticated: false,
                userName: undefined,
                userEmail: undefined,
                userInitials: undefined,
            }));
        }
    }, [authStore.isAuthenticated, authStore.user]);

    // ── Actions ───────────────────────────────────────────────────────────────────

    const onLogin = useCallback(
        async (credentials: LoginCredentials) => {
            await presenterRef.current.onLogin(credentials);
            // AuthService a déjà mis à jour le store — on vérifie juste l'absence d'erreur
            if (!presenterRef.current.getViewModel().hasError) {
                navigate(ROUTES.HOME);
            }
        },
        [navigate]
    );

    const onRegister = useCallback(
        async (payload: RegisterPayload) => {
            await presenterRef.current.onRegister(payload);
            if (!presenterRef.current.getViewModel().hasError) {
                navigate(ROUTES.HOME);
            }
        },
        [navigate]
    );

    const onLogout = useCallback(() => {
        presenterRef.current.onLogout();
        // AuthService a appelé clearAuth() → localStorage nettoyé, store vidé
        navigate(ROUTES.HOME);
    }, [navigate]);

    return { vm, onLogin, onRegister, onLogout };
}