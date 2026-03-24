/**
 * src/services/HotelService.ts
 * Service pour la logique métier des hôtels.
 */
import { IHotelService, SortOption, HotelFilters } from "@/interfaces/services/IHotelService";
import { IHotelRepository, SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { Hotel } from "@/core/entities/Hotel";

export class HotelService implements IHotelService {
  /**
   * L'injection de dépendance via le constructeur permet :
   * - De tester avec un mock repository
   * - De changer d'implémentation sans modifier le service
   */
  constructor(private hotelRepo: IHotelRepository) { }

  async search(params: SearchParams): Promise<Hotel[]> {
    /* Délègue la récupération au repository */
    return this.hotelRepo.findAll(params);
  }

  async getById(id: string): Promise<Hotel | null> {
    return this.hotelRepo.findById(id);
  }

  /**
   * Tri côté client (les données sont déjà chargées).
   */
  sortHotels(hotels: Hotel[], sort: SortOption): Hotel[] {
    const getField = (h: Hotel): number => ({
      price: h.priceFrom,
      rating: h.rating,
      stars: h.stars,
      reviewCount: h.reviewCount,
    }[sort.field] ?? h.priceFrom);

    return [...hotels].sort((a, b) => {
      const diff = getField(a) - getField(b);
      return sort.direction === "asc" ? diff : -diff;
    });
  }

  /**
   * Filtrage côté client pour un retour UI instantané.
   * Ne mute PAS le tableau original.
   */
  filterHotels(hotels: Hotel[], filters: HotelFilters): Hotel[] {
    return hotels.filter((hotel) => {
      /* Filtre par prix minimum */
      if (filters.minPrice !== undefined && hotel.priceFrom < filters.minPrice) return false;
      /* Filtre par prix maximum */
      if (filters.maxPrice !== undefined && hotel.priceFrom > filters.maxPrice) return false;
      if (filters.stars?.length && !filters.stars.includes(hotel.stars)) return false;
      if (filters.amenities?.length) {
        const hasAll = filters.amenities.every((a) => hotel.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });
  }
}
