/**
 * src/viewmodels/HotelListViewModel.ts
 *
 * ViewModels de la page de résultats de recherche.
 *
 * HotelCardViewModel vs Hotel (entité) :
 * ┌─────────────────────┬──────────────────────────┐
 * │ Hotel (entité)      │ HotelCardViewModel       │
 * ├─────────────────────┼──────────────────────────┤
 * │ priceFrom: 350      │ pricePerNight: "350 €/n" │
 * │ reviewCount: 1284   │ reviewCount: "1.3k avis" │
 * │ rating: 4.8         │ badge: "Coup de cœur"    │
 * └─────────────────────┴──────────────────────────┘
 * La Vue n'a jamais à formater quoi que ce soit.
 */

/** ViewModel d'une carte hôtel dans la liste des résultats */
export interface HotelCardViewModel {
    /** ID pour la navigation vers le détail */
    id: string;

    /** Nom affiché */
    name: string;

    city: string;
    country: string;

    /** Prix formaté et prêt à afficher : "350 €/nuit" */
    pricePerNight: string;

    /** Note (nombre brut — on utilise le nombre pour les étoiles SVG) */
    rating: number;

    /** Nombre d'avis formaté : "1.3k avis" ou "876 avis" */
    reviewCount: string;

    /** Étoiles officielles (1-5, pour afficher les ★) */
    stars: number;

    /** URL de la première image (thumbnail) */
    thumbnailUrl: string;

    /** Équipements principaux (max 4 à afficher sur la carte) */
    amenities: string[];

    /** Disponibilité pour les dates de recherche */
    isAvailable: boolean;

    /**
     * Badge promotionnel optionnel.
     * Calculé par le Presenter selon des règles métier :
     * - "Coup de cœur" si rating >= 4.8
     * - "Bon plan" si prix < 200€
     */
    badge?: string;
}

/** Filtres actifs affichés dans l'UI */
export interface ActiveFiltersViewModel {
    minPrice?: number;
    maxPrice?: number;
    stars?: number[];
    amenities?: string[];
}

/** ViewModel global de la page de résultats */
export interface HotelListViewModel {
    /** Liste des cartes hôtel à afficher */
    hotels: HotelCardViewModel[];

    /** true pendant le chargement → affiche les skeletons */
    isLoading: boolean;

    /** true si une erreur est survenue */
    hasError: boolean;

    /** Message d'erreur à afficher (si hasError = true) */
    errorMessage?: string;

    /** Label du nombre de résultats : "6 hôtels trouvés" */
    totalResults: string;

    /** true si aucun hôtel trouvé → affiche l'état vide */
    isEmpty: boolean;

    /** Tri courant sélectionné */
    currentSort: { field: string; direction: string };

    /** Filtres actuellement appliqués */
    activeFilters: ActiveFiltersViewModel;
}