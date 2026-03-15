
export interface AuthViewModel {
    /**
     * true si un token valide est présent.
     * Contrôle :
     */
    isAuthenticated: boolean;

    /** true pendant login/register → spinner sur le bouton */
    isLoading: boolean;

    /** true si la dernière tentative a échoué */
    hasError: boolean;

    /** Message d'erreur lisible : "Email ou mot de passe incorrect" */
    errorMessage?: string;

    /* ── Données de l'utilisateur connecté (undefined si non connecté) ── */

    /** "Marie Dupont" — affiché dans le Header */
    userName?: string;

    /** Email affiché dans le menu dropdown */
    userEmail?: string;

    /**
     * Initiales pour l'Avatar si pas de photo : "MD"
     * Calculé par le Presenter : `${firstName[0]}${lastName[0]}`
     */
    userInitials?: string;

    /** URL de la photo de profil (peut être undefined → fallback sur initiales) */
    avatarUrl?: string;
}