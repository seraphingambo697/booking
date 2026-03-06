/**
 * src/services/HotelService.ts
 *
 * Implémentation concrète de IHotelService.
 *
 * Le Service orchestre les appels au Repository et applique
 * la logique métier (tri, filtre, validation des règles de gestion).
 *
 * Le Service reçoit IHotelRepository en injection de dépendance,
 * pas HotelRepository directement → couplage faible, testabilité maximale.
 *
 * Injection de dépendance :
 * const service = new HotelService(new HotelRepository())     // Production
 * const service = new HotelService(new MockHotelRepository()) // Tests
 */

import { Hotel } from "@/core/entities/Hotel";
import { IHotelService, SortOption, HotelFilters } from "@/interfaces/services/IHotelService";
import { IHotelRepository, SearchParams } from "@/interfaces/repositories/IHotelRepository";

export class HotelService implements IHotelService {
    /**
     * @param hotelRepo - Repository injecté (production ou mock)
     */
    constructor(private hotelRepo: IHotelRepository) { }

    async search(params: SearchParams): Promise<Hotel[]> {
        // Délègue la récupération au repository
        const hotels = await this.hotelRepo.findAll(params);

        // Applique les filtres supplémentaires (logique métier)
        let result = hotels;
        if (params.minPrice !== undefined) {
            result = result.filter((h) => h.priceFrom >= params.minPrice!);
        }
        if (params.maxPrice !== undefined) {
            result = result.filter((h) => h.priceFrom <= params.maxPrice!);
        }
        if (params.stars?.length) {
            result = result.filter((h) => params.stars!.includes(h.stars));
        }
        if (params.amenities?.length) {
            result = result.filter((h) =>
                params.amenities!.every((a) => h.amenities.includes(a))
            );
        }

        return result;
    }

    async getById(id: string): Promise<Hotel | null> {
        return this.hotelRepo.findById(id);
    }

    /**
     * Tri synchrone (les données sont déjà en mémoire).
     * Retourne un NOUVEAU tableau (pas de mutation).
     */
    sortHotels(hotels: Hotel[], sort: SortOption): Hotel[] {
        // Mapping des champs de tri vers les propriétés de l'entité
        const getField = (h: Hotel): number => {
            switch (sort.field) {
                case "price": return h.priceFrom;
                case "rating": return h.rating;
                case "stars": return h.stars;
                case "reviewCount": return h.reviewCount;
                default: return h.rating;
            }
        };

        return [...hotels].sort((a, b) => {
            const diff = getField(a) - getField(b);
            return sort.direction === "asc" ? diff : -diff;
        });
    }

    /**
     * Filtre synchrone côté client.
     * Appelé par le Presenter quand l'utilisateur change les filtres.
     */
    filterHotels(hotels: Hotel[], filters: HotelFilters): Hotel[] {
        return hotels.filter((h) => {
            if (filters.minPrice !== undefined && h.priceFrom < filters.minPrice) return false;
            if (filters.maxPrice !== undefined && h.priceFrom > filters.maxPrice) return false;
            if (filters.stars?.length && !filters.stars.includes(h.stars)) return false;
            if (filters.amenities?.length) {
                if (!filters.amenities.every((a) => h.amenities.includes(a))) return false;
            }
            return true;
        });
    }
}