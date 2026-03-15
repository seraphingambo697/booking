/**
 *
 * ViewModel de la barre de recherche (SearchBar).
 *
 * Un ViewModel représente EXACTEMENT ce dont la Vue a besoin, rien de plus.
 * Il contient des données déjà prêtes à afficher (formatées, validées).
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