/**
 * src/repositories/HotelRepository.ts
 *
 * Implémentation concrète de IHotelRepository.
 *
 * En production : utiliserait hotelApi.ts + transformation ApiHotel → Hotel
 * En développement (mode mock) : utilise MOCK_HOTELS directement
 *
 * La transformation (ApiHotel → Hotel) se ferait ici :
 * - snake_case → camelCase (review_count → reviewCount)
 * - string ISO → Date JavaScript (si nécessaire)
 *
 * delay() simule la latence réseau pour un rendu réaliste en dev.
 */

import { Hotel } from "@/core/entities/Hotel";
import { IHotelRepository, SearchParams } from "@/interfaces/repositories/IHotelRepository";

// ── Données de test (remplacer par hotelApi.ts en production) ──────────────────

const MOCK_HOTELS: Hotel[] = [
    {
        id: "h1",
        name: "Le Grand Palais",
        description: "Hôtel de luxe au cœur de Paris, à deux pas des Champs-Élysées. Une expérience inoubliable dans un cadre exceptionnel.",
        address: "10 Avenue des Champs-Élysées",
        city: "Paris", country: "France",
        latitude: 48.8698, longitude: 2.3079,
        stars: 5, rating: 4.8, reviewCount: 1284,
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        ],
        amenities: ["WiFi", "Piscine", "Spa", "Restaurant", "Bar", "Parking", "Climatisation"],
        priceFrom: 350, currency: "EUR",
    },
    {
        id: "h2",
        name: "Hôtel Riviera Nice",
        description: "Face à la Méditerranée, vue imprenable sur la Promenade des Anglais. Piscine sur le toit et restaurant étoilé.",
        address: "45 Promenade des Anglais",
        city: "Nice", country: "France",
        latitude: 43.6957, longitude: 7.2659,
        stars: 4, rating: 4.5, reviewCount: 876,
        images: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
        ],
        amenities: ["WiFi", "Piscine", "Vue mer", "Restaurant", "Plage privée", "Climatisation"],
        priceFrom: 180, currency: "EUR",
    },
    {
        id: "h3",
        name: "Château Bordeaux",
        description: "Château du XVIIIe siècle transformé en hôtel de charme au cœur du vignoble bordelais.",
        address: "Route des Châteaux, Saint-Émilion",
        city: "Bordeaux", country: "France",
        latitude: 44.8378, longitude: -0.5792,
        stars: 4, rating: 4.6, reviewCount: 432,
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
        amenities: ["WiFi", "Cave à vins", "Restaurant", "Jardins", "Parking"],
        priceFrom: 220, currency: "EUR",
    },
    {
        id: "h4",
        name: "Le Marais Boutique",
        description: "Hôtel boutique design dans un hôtel particulier du Marais. 30 chambres uniques décorées par des artistes.",
        address: "12 Rue de Bretagne",
        city: "Paris", country: "France",
        latitude: 48.8637, longitude: 2.3622,
        stars: 4, rating: 4.7, reviewCount: 654,
        images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"],
        amenities: ["WiFi", "Bar", "Conciergerie", "Climatisation"],
        priceFrom: 195, currency: "EUR",
    },
    {
        id: "h5",
        name: "Alpes Summit Lodge",
        description: "Au pied des pistes de Chamonix, lodge alpin avec spa et vue imprenable sur le Mont-Blanc.",
        address: "3 Rue du Mont-Blanc",
        city: "Chamonix", country: "France",
        latitude: 45.9237, longitude: 6.8694,
        stars: 4, rating: 4.9, reviewCount: 389,
        images: ["https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800"],
        amenities: ["WiFi", "Spa", "Sauna", "Restaurant", "Parking"],
        priceFrom: 280, currency: "EUR",
    },
    {
        id: "h6",
        name: "Villa Provençale",
        description: "Villa luxueuse entourée de lavandes et d'oliviers, piscine chauffée et cuisine provençale.",
        address: "Route de Gordes",
        city: "Aix-en-Provence", country: "France",
        latitude: 43.5297, longitude: 5.4474,
        stars: 5, rating: 4.7, reviewCount: 298,
        images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"],
        amenities: ["WiFi", "Piscine", "Jardins", "Restaurant", "Spa", "Climatisation"],
        priceFrom: 310, currency: "EUR",
    },
];

/** Simule la latence réseau en développement */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class HotelRepository implements IHotelRepository {
    findByCity(city: string): Promise<Hotel[]> {
        throw new Error("Method not implemented.");
    }
    async findAll(params: SearchParams): Promise<Hotel[]> {
        await delay(600); // Simule ~600ms de latence réseau

        // Filtre par ville (insensible à la casse, recherche partielle)
        return MOCK_HOTELS.filter((h) =>
            params.city
                ? h.city.toLowerCase().includes(params.city.toLowerCase())
                : true
        );
    }

    async findById(id: string): Promise<Hotel | null> {
        await delay(300);
        return MOCK_HOTELS.find((h) => h.id === id) ?? null;
    }
}