/**
 * src/hooks/useAuth.ts
 * Hook React pour l'authentification — connecté au backend.
 *
 * Le AuthStore.setAuth() est maintenant appelé par AuthService directement,
 * donc ce hook se contente d'écouter le store et d'orchestrer la navigation.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthPresenter } from "@/presenters/AuthPresenter";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import { AuthService } from "@/services/AuthService";
import { useAuthStore } from "@/store/authStore";
import { LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";
import { ROUTES } from "@/router/routes";

const authService = new AuthService();

export function useAuth() {
  const navigate  = useNavigate();
  const authStore = useAuthStore();

  const [vm, setVm] = useState<AuthViewModel>({
    isAuthenticated: authStore.isAuthenticated,
    isLoading:       false,
    hasError:        false,
    // Restaure le nom depuis le store si déjà connecté
    userName:    authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : undefined,
    userEmail:   authStore.user?.email,
    userInitials: authStore.user
      ? `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`.toUpperCase()
      : undefined,
  });

  const presenterRef = useRef(
    new AuthPresenter(authService, (newVm: AuthViewModel) => {
      setVm(newVm);
    })
  );

  useEffect(() => {
    presenterRef.current.init();
  }, []);

  // Synchronise le ViewModel quand le store change (ex: hydration au démarrage)
  useEffect(() => {
    if (authStore.user && authStore.isAuthenticated) {
      setVm((prev) => ({
        ...prev,
        isAuthenticated: true,
        userName:    `${authStore.user!.firstName} ${authStore.user!.lastName}`,
        userEmail:   authStore.user!.email,
        userInitials: `${authStore.user!.firstName[0]}${authStore.user!.lastName[0]}`.toUpperCase(),
      }));
    }
  }, [authStore.isAuthenticated]);

  const onLogin = useCallback(async (credentials: LoginCredentials) => {
    await presenterRef.current.onLogin(credentials);
    if (!presenterRef.current.getViewModel().hasError) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  const onRegister = useCallback(async (payload: RegisterPayload) => {
    await presenterRef.current.onRegister(payload);
    if (!presenterRef.current.getViewModel().hasError) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  const onLogout = useCallback(() => {
    presenterRef.current.onLogout();
    navigate(ROUTES.HOME);
  }, [navigate]);

  return { vm, onLogin, onRegister, onLogout };
}
