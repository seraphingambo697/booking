/**
 *
 * ViewModel d'une chambre d'hôtel.
 * Contient deux versions du prix :
 * - pricePerNight (string) : "350 €/nuit" → pour l'affichage
 * - priceRaw (number) : 350 → pour les calculs dans BookingPresenter
 */

export interface RoomViewModel {
    id: string;

    name: string;

    type: string;

    description: string;

    pricePerNight: string;

    priceRaw: number;

    capacity: string;

    size: string;

    bedInfo: string;

    amenities: string[];

    images: string[];

    isAvailable: boolean;
}