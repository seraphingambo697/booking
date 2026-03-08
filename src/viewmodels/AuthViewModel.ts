/**
 * src/viewmodels/AuthViewModel.ts
 *
 * ViewModel d'authentification.
 *
 * Partagé entre plusieurs composants :
 * - Header : affiche userName, userInitials, isAuthenticated
 * - LoginPage : isLoading, hasError, errorMessage
 * - RegisterPage : idem
 *
 * userInitials est précalculé par le Presenter (ex: "MD" pour Marie Dupont).
 * Le composant Avatar n'a qu'à afficher vm.userInitials.
 */

export interface AuthViewModel {
    /** true si un utilisateur est connecté */
    isAuthenticated: boolean;

    /** true pendant une requête login/register */
    isLoading: boolean;

    /** true si login/register a échoué */
    hasError: boolean;

    /** Message d'erreur à afficher dans le formulaire */
    errorMessage?: string;

    /** Nom complet : "Marie Dupont" (undefined si non connecté) */
    userName?: string;

    /** Email de l'utilisateur connecté */
    userEmail?: string;


    userInitials?: string;

    /** URL de la photo de profil (optionnel) */
    avatarUrl?: string;
}