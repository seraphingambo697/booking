/**
 * src/viewmodels/HotelDetailViewModel.ts
 *
 * ViewModel de la page de détail d'un hôtel.
 *
 * Agrège les données de l'hôtel ET de ses chambres en un seul objet.
 * Le Presenter fait les deux appels (hôtel + chambres) et produit
 * ce ViewModel unique pour la page HotelDetailPage.
 *
 * selectedRoomId est géré ici car c'est un état UI (sélection visuelle)
 * qui ne doit pas polluer l'entité Hotel.
 */

/**
 * src/viewmodels/HotelDetailViewModel.ts
 *
 * ViewModel de la page de détail d'un hôtel.
 *
 * Agrège les données de l'hôtel ET de ses chambres en un seul objet.
 * Le Presenter fait les deux appels (hôtel + chambres) et produit
 * ce ViewModel unique pour la page HotelDetailPage.
 *
 * selectedRoomId est géré ici car c'est un état UI (sélection visuelle)
 * qui ne doit pas polluer l'entité Hotel.
 */
import type { RoomViewModel } from "@/viewmodels/RoomViewModel";

export interface HotelDetailViewModel {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;

    /** Étoiles officielles */
    stars: number;

    /** Note clients (nombre brut) */
    rating: number;

    /** Nombre d'avis formaté : "1.3k avis" */
    reviewCount: string;

    /** URLs des photos pour la galerie */
    images: string[];

    /** Liste des équipements de l'hôtel */
    amenities: string[];

    /** Chambres disponibles (transformées en RoomViewModel) */
    rooms: RoomViewModel[];

    /** true pendant le chargement des données */
    isLoading: boolean;

    /** true si erreur de chargement */
    hasError: boolean;

    /** Message d'erreur à afficher */
    errorMessage?: string;

    /**
     * ID de la chambre actuellement sélectionnée par l'utilisateur.
     * Undefined si aucune chambre n'est sélectionnée.
     */
    selectedRoomId?: string;
}