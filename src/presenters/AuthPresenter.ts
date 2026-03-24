/**
 * src/presenters/AuthPresenter.ts
 * Presenter pour l'authentification.
 *
 * Instancié une seule fois dans useAuth (via useRef) pour
 * persister l'état entre les navigations.
 */
import { IAuthPresenter } from "@/interfaces/presenters/IAuthPresenter";
import { IAuthService, LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import { getInitials } from "@/lib/utils";

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
   * Restaure la session depuis le localStorage au démarrage de l'app.
   * Appelé dans useEffect du hook useAuth.
   */
  init(): void {
    const user = this.authService.getCurrentUser();
    if (user && this.authService.isAuthenticated()) {
      this.update({
        isAuthenticated: true,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
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
        errorMessage: error.message ?? "Une erreur est survenue.",
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
        errorMessage: error.message ?? "Une erreur est survenue.",
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    // Réinitialise complètement le ViewModel
    this.update({
      isAuthenticated: false,
      userName: undefined,
      userEmail: undefined,
      userInitials: undefined,
      avatarUrl: undefined,
      hasError: false,
    });
  }

  private update(partial: Partial<AuthViewModel>): void {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel(): AuthViewModel { return this.vm; }
}
