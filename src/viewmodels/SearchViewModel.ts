/**
 * src/viewmodels/SearchViewModel.ts
 *
 * ViewModel de la barre de recherche (SearchBar).
 *
 * Un ViewModel représente EXACTEMENT ce dont la Vue a besoin, rien de plus.
 * Il contient des données déjà prêtes à afficher (formatées, validées).
 *
 * Différence avec les données brutes :
 * - Entité : pas de notion de "formulaire valide" → c'est de l'UI
 * - ViewModel : isValid, cityError → états UI calculés par le Presenter
 *
 * Le composant SearchBar lit ce ViewModel et n'a AUCUNE logique de validation.
 */

export interface SearchViewModel {
    /** Valeur courante du champ ville */
    city: string;

    /** Date d'arrivée sélectionnée (null si non sélectionnée) */
    checkIn: Date | null;

    /** Date de départ sélectionnée (null si non sélectionnée) */
    checkOut: Date | null;

    /** Nombre de voyageurs (minimum 1, maximum 10) */
    guestCount: number;

    /**
     * true si le formulaire est valide et peut être soumis.
     * Calculé par le Presenter : city non vide + checkIn + checkOut renseignés.
     */
    isValid: boolean;

    /** Message d'erreur sur le champ ville (undefined si pas d'erreur) */
    cityError?: string;

    /** Message d'erreur sur les dates (undefined si pas d'erreur) */
    dateError?: string;
}