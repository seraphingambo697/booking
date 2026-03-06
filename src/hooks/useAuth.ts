/**
 * src/hooks/useAuth.ts
 *
 * Hook : authentification (Header, LoginPage, RegisterPage).
 *
 * Synchronise AuthPresenter avec authStore (Zustand global).
 * Quand login réussit → setAuth() met à jour le store global
 * → tous les composants qui lisent isAuthenticated se mettent à jour.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import { AuthService } from "@/services/AuthService";
import { useAuthStore } from "@/store/authStore";
import { LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";
import { ROUTES } from "@/router/routes";

const authService = new AuthService();

export function useAuth() {
    const navigate = useNavigate();
    const { setAuth, clearAuth } = useAuthStore();

    const [vm, setVm] = useState<AuthViewModel>({
        isAuthenticated: false, isLoading: false, hasError: false,
    });

    const presenterRef = useRef(
        new AuthPresenter(authService, (newVm) => {
            setVm(newVm);
            // Synchronise le store global selon l'état d'auth
            if (newVm.isAuthenticated) {
                setAuth("u1"); // En production : utiliser l'id depuis le token JWT
            } else {
                clearAuth();
            }
        })
    );

    // Initialise depuis localStorage au montage
    useEffect(() => {
        presenterRef.current.init();
    }, []);

    const onLogin = useCallback(
        async (credentials: LoginCredentials) => {
            await presenterRef.current.onLogin(credentials);
            // Navigue vers l'accueil après connexion réussie
            if (presenterRef.current.getViewModel().isAuthenticated) {
                navigate(ROUTES.HOME);
            }
        },
        [navigate]
    );

    const onRegister = useCallback(
        async (payload: RegisterPayload) => {
            await presenterRef.current.onRegister(payload);
            if (presenterRef.current.getViewModel().isAuthenticated) {
                navigate(ROUTES.HOME);
            }
        },
        [navigate]
    );

    const onLogout = useCallback(() => {
        presenterRef.current.onLogout();
        navigate(ROUTES.HOME);
    }, [navigate]);

    return { vm, onLogin, onRegister, onLogout };
}