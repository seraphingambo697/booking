/**
 * src/repositories/RoomRepository.ts
 *
 * Implémentation concrète de IRoomRepository.
 * Gère l'accès aux données des chambres (mock en développement).
 */

import { Room } from "@/core/entities/Room";
import { RoomType } from "@/core/enums/RoomType";
import { IRoomRepository } from "@/interfaces/repositories/IRoomRepository";

const MOCK_ROOMS: Room[] = [
    // ── Hôtel h1 : Le Grand Palais ──────────────────────────────────────────────
    {
        id: "r1", hotelId: "h1", type: RoomType.DOUBLE,
        name: "Chambre Classique",
        description: "Chambre élégante avec vue sur cour intérieure, mobilier Empire et salle de bain en marbre.",
        pricePerNight: 350, currency: "EUR", capacity: 2, size: 32,
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        amenities: ["WiFi", "Climatisation", "Minibar", "Coffre-fort", "TV 4K"],
        isAvailable: true, bedCount: 1, bedType: "Grand lit double",
    },
    {
        id: "r2", hotelId: "h1", type: RoomType.DELUXE,
        name: "Chambre Deluxe Vue Ville",
        description: "Spacieuse chambre avec vue panoramique sur Paris, baignoire îlot et dressing.",
        pricePerNight: 520, currency: "EUR", capacity: 2, size: 45,
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
        amenities: ["WiFi", "Climatisation", "Minibar", "Baignoire", "TV 4K"],
        isAvailable: true, bedCount: 1, bedType: "King size",
    },
    {
        id: "r3", hotelId: "h1", type: RoomType.SUITE,
        name: "Suite Présidentielle",
        description: "Salon séparé, terrasse privée avec vue sur les toits de Paris. Service butler inclus.",
        pricePerNight: 1200, currency: "EUR", capacity: 4, size: 120,
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
        amenities: ["WiFi", "Jacuzzi", "Terrasse", "Butler", "TV 4K", "Climatisation"],
        isAvailable: false, bedCount: 2, bedType: "2 King size",   // indisponible
    },
    // ── Hôtel h2 : Riviera Nice ─────────────────────────────────────────────────
    {
        id: "r4", hotelId: "h2", type: RoomType.DOUBLE,
        name: "Chambre Vue Mer",
        description: "Balcon et vue imprenable sur la Méditerranée.",
        pricePerNight: 210, currency: "EUR", capacity: 2, size: 28,
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
        amenities: ["WiFi", "Climatisation", "Balcon", "TV"],
        isAvailable: true, bedCount: 1, bedType: "Grand lit double",
    },
    {
        id: "r5", hotelId: "h2", type: RoomType.SUITE,
        name: "Suite Méditerranée",
        description: "Terrasse privée, jacuzzi extérieur, panorama 180° sur la mer.",
        pricePerNight: 480, currency: "EUR", capacity: 3, size: 75,
        images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
        amenities: ["WiFi", "Jacuzzi", "Terrasse", "TV 4K", "Salon"],
        isAvailable: true, bedCount: 1, bedType: "King size",
    },
    // ── Hôtel h5 : Alpes Summit Lodge ───────────────────────────────────────────
    {
        id: "r6", hotelId: "h5", type: RoomType.TWIN,
        name: "Chambre Alpine Twin",
        description: "Chambre en bois de mélèze avec vue sur les sommets enneigés.",
        pricePerNight: 290, currency: "EUR", capacity: 2, size: 30,
        images: ["https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800"],
        amenities: ["WiFi", "Chauffage", "TV", "Coffre-fort"],
        isAvailable: true, bedCount: 2, bedType: "2 lits simples",
    },
    {
        id: "r7", hotelId: "h5", type: RoomType.FAMILY,
        name: "Suite Familiale Mont-Blanc",
        description: "Vue directe sur le Mont-Blanc, salon séparé et chambre enfants.",
        pricePerNight: 520, currency: "EUR", capacity: 5, size: 85,
        images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"],
        amenities: ["WiFi", "Chauffage", "TV", "Salon", "Kitchenette"],
        isAvailable: true, bedCount: 3, bedType: "1 King + 2 simples",
    },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class RoomRepository implements IRoomRepository {
    async findByHotelId(hotelId: string): Promise<Room[]> {
        await delay(300);
        return MOCK_ROOMS.filter((r) => r.hotelId === hotelId);
    }

    async findById(id: string): Promise<Room | null> {
        await delay(200);
        return MOCK_ROOMS.find((r) => r.id === id) ?? null;
    }

    async checkAvailability(roomId: string, _checkIn: Date, _checkOut: Date): Promise<boolean> {
        await delay(200);
        // En mock : retourne simplement le champ isAvailable
        // En production : vérifierait les réservations existantes sur ces dates
        return MOCK_ROOMS.find((r) => r.id === roomId)?.isAvailable ?? false;
    }
}