/**
 * src/viewmodels/RoomViewModel.ts
 *
 * ViewModel d'une chambre d'hôtel.
 *
 * Contient deux versions du prix :
 * - pricePerNight (string) : "350 €/nuit" → pour l'affichage
 * - priceRaw (number) : 350 → pour les calculs dans BookingPresenter
 *
 * Règle : la Vue utilise TOUJOURS la version string formatée.
 * Les calculs se font TOUJOURS avec priceRaw dans les Presenters/Services.
 */

export interface RoomViewModel {
    /** ID pour sélectionner et réserver la chambre */
    id: string;

    /** Nom affiché : "Suite Présidentielle" */
    name: string;

    /** Type affiché : "SUITE" (depuis l'enum RoomType) */
    type: string;

    /** Description longue */
    description: string;

    /** Prix formaté pour l'affichage : "350 €/nuit" */
    pricePerNight: string;

    /** Prix brut pour les calculs : 350 */
    priceRaw: number;

    /** Capacité formatée : "2 voyageurs" */
    capacity: string;

    /** Surface formatée : "32 m²" */
    size: string;

    /** Info lit formatée : "1 Grand lit double" */
    bedInfo: string;

    /** Équipements de la chambre */
    amenities: string[];

    /** Photos de la chambre */
    images: string[];

    /** Disponibilité pour les dates de recherche */
    isAvailable: boolean;
}