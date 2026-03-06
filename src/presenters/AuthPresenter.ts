/**
 * src/presenters/AuthPresenter.ts
 *
 * Presenter d'authentification.
 * Partagé entre Header, LoginPage et RegisterPage.
 *
 * init() est crucial : il lit l'état d'auth depuis localStorage
 * au montage de l'application → l'utilisateur reste connecté
 * même après un refresh de page.
 */

import { IAuthPresenter } from "@/interfaces/presenters/IAuthPresenter";
import { IAuthService, LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import { getInitials } from "@/lib/formatters";

export class AuthPresenter implements IAuthPresenter {
    private vm: AuthViewModel = {
        isAuthenticated: false,
        isLoading: false,
        hasError: false,
    };

    constructor(
        private authService: IAuthService,
        private onChange: (vm: AuthViewModel) => void
    ) { }

    /**
     * Initialise depuis le localStorage.
     * Appelé au montage du composant (useEffect sans dépendances).
     */
    init(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.update({
                isAuthenticated: true,
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                // Précalcule les initiales pour le composant Avatar
                userInitials: getInitials(user.firstName, user.lastName),
                avatarUrl: user.avatarUrl,
            });
        }
    }

    async onLogin(credentials: LoginCredentials): Promise<void> {
        this.update({ isLoading: true, hasError: false, errorMessage: undefined });

        try {
            const { user } = await this.authService.login(credentials);
            this.update({
                isLoading: false,
                isAuthenticated: true,
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                userInitials: getInitials(user.firstName, user.lastName),
                avatarUrl: user.avatarUrl,
            });
        } catch (error: any) {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: error.message,
            });
        }
    }

    async onRegister(payload: RegisterPayload): Promise<void> {
        this.update({ isLoading: true, hasError: false, errorMessage: undefined });

        try {
            const { user } = await this.authService.register(payload);
            this.update({
                isLoading: false,
                isAuthenticated: true,
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                userInitials: getInitials(user.firstName, user.lastName),
            });
        } catch (error: any) {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: error.message,
            });
        }
    }

    onLogout(): void {
        this.authService.logout();
        // Réinitialise le ViewModel → Header se met à jour
        this.update({
            isAuthenticated: false,
            userName: undefined,
            userEmail: undefined,
            userInitials: undefined,
            avatarUrl: undefined,
        });
    }

    private update(partial: Partial<AuthViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): AuthViewModel {
        return this.vm;
    }
}