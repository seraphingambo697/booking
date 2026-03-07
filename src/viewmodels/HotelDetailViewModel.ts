/**
 * src/viewmodels/HotelDetailViewModel.ts
 * ViewModel pour la page de détail d'un hôtel.
 *
 * Contient toutes les informations nécessaires à l'affichage complet :
 * galerie photos, description, équipements, ET la liste des chambres.
 */
import { RoomViewModel } from "./RoomViewModel";

export interface HotelDetailViewModel {
    /** ID de l'hôtel */
    id: string;

    /** Coordonnées GPS pour la map */
    latitude?: number;
    longitude?: number;

    /** Nom pour le <h1> de la page */
    name: string;

    /** Description complète (peut contenir plusieurs paragraphes) */
    description: string;

    /** Adresse complète */
    address: string;
    city: string;
    country: string;

    /** Étoiles officielles (1-5) */
    stars: number;

    /** Note voyageurs (ex: 4.8) */
    rating: number;

    /** Avis formaté : "1,3k avis" */
    reviewCount: string;

    /** Toutes les URLs photos pour la galerie */
    images: string[];

    /** Équipements de l'hôtel (avec icônes dans le composant) */
    amenities: string[];

    /** Chambres disponibles (chargées en parallèle de l'hôtel) */
    rooms: RoomViewModel[];

    /** true pendant le chargement initial */
    isLoading: boolean;

    /** true si une erreur s'est produite */
    hasError: boolean;
    errorMessage?: string;

    /** ID de la chambre actuellement sélectionnée (surlignée dans la liste) */
    selectedRoomId?: string;
}