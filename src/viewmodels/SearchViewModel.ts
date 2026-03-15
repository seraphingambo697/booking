/**
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
    city: string;

    checkIn: Date | null;

    checkOut: Date | null;

    guestCount: number;

    isValid: boolean;

    cityError?: string;

    dateError?: string;
}