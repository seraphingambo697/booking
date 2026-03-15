/**
 * src/interfaces/repositories/IHotelRepository.ts
 * Contrat (interface) du repository Hotel.
 *
 * Un repository est responsable UNIQUEMENT de l'accès aux données.
 * Il ne contient aucune logique métier.
 *
 * Cette interface permet de :
 * 1. Découpler le code des détails d'implémentation (API REST, GraphQL, mock...)
 * 2. Injecter un mock dans les tests Cypress sans toucher au code métier
 * 3. Changer de backend sans modifier les services ou presenters
 *
 * Principe : Dependency Inversion — on dépend de l'abstraction, pas de l'implémentation.
 */
import { Hotel } from "@/core/entities/Hotel";

/**
 * Paramètres de recherche d'hôtels.
 * Correspond aux critères saisis par l'utilisateur dans la SearchBar.
 */
export interface SearchParams {
    /** Ville de destination (obligatoire) */
    city: string;
    /** Date d'arrivée souhaitée */
    checkIn: Date;
    /** Date de départ souhaitée */
    checkOut: Date;
    /** Nombre total de voyageurs */
    guestCount: number;
    /** Filtres optionnels */
    minPrice?: number;
    maxPrice?: number;
    stars?: number[];          // Ex: [4, 5] pour 4 et 5 étoiles
    amenities?: string[];      // Ex: ["WiFi", "Piscine"]
}

export interface IHotelRepository {
    /**
     * Récupère la liste des hôtels correspondant aux critères de recherche.
     * @throws Error en cas d'erreur réseau ou API
     */
    findAll(params: SearchParams): Promise<Hotel[]>;

    /**
     * Récupère un hôtel par son identifiant unique.
     * @returns null si l'hôtel n'existe pas (404)
     * @throws Error en cas d'erreur réseau ou API
     */
    findById(id: string): Promise<Hotel | null>;
}