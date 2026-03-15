/**
 * src/repositories/HotelRepository.ts
 * Implémentation connectée au backend Django.
 *
 * Convertit les types API (snake_case) vers les entités domaine (camelCase).
 */
import { IHotelRepository, SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { Hotel } from "@/core/entities/Hotel";
import { Room } from "@/core/entities/Room";
import { hotelApi } from "@/api/hotelApi";
import { ApiHotel, ApiRoom } from "@/types/api.types";

// ── Convertisseurs API → Entités ──────────────────────────────────────────────

function toHotel(api: ApiHotel): Hotel {
  return {
    id:          api.id,
    name:        api.name,
    description: api.description,
    address:     api.address,
    city:        api.city,
    country:     api.country,
    latitude:    api.latitude,
    longitude:   api.longitude,
    stars:       api.stars,
    rating:      0,           // non retourné par le backend pour l'instant
    reviewCount: 0,
    images:      api.images ?? [],
    amenities:   api.amenities ?? [],
    priceFrom:   0,           // calculé via availability
    currency:    "EUR",
  };
}

function toRoom(api: ApiRoom): Room {
  return {
    id:            api.id,
    hotelId:       api.hotel_id,
    type:          api.type as Room["type"],
    name:          api.name,
    description:   api.description,
    pricePerNight: api.price_per_night,
    currency:      api.currency,
    capacity:      api.capacity,
    size:          api.size_sqm,
    images:        api.images ?? [],
    amenities:     api.amenities ?? [],
    isAvailable:   api.is_available,
    bedCount:      api.bed_count,
    bedType:       api.bed_type,
  };
}

// ── Repository ────────────────────────────────────────────────────────────────

export class HotelRepository implements IHotelRepository {

  async findAll(params: SearchParams): Promise<Hotel[]> {
    // Si des dates sont fournies → utiliser la recherche avec disponibilité
    if (params.checkIn && params.checkOut) {
      const ci = params.checkIn instanceof Date
        ? params.checkIn.toISOString().split("T")[0]
        : String(params.checkIn);
      const co = params.checkOut instanceof Date
        ? params.checkOut.toISOString().split("T")[0]
        : String(params.checkOut);

      const results = await hotelApi.searchHotels({
        city:        params.city ?? "",
        check_in:    ci,
        check_out:   co,
        guest_count: params.guestCount ?? 1,
        stars_min:   params.stars?.[0],
        price_max:   params.maxPrice,
      });
      return results.map((r) => {
        const hotel = toHotel(r.hotel);
        hotel.priceFrom = r.min_price;
        return hotel;
      });
    }

    // Sinon → liste simple filtrée par ville
    const apiHotels = await hotelApi.listHotels({
      city:      params.city,
      page_size: 50,
    });
    return apiHotels.map(toHotel);
  }

  async findById(id: string): Promise<Hotel | null> {
    try {
      const apiHotel = await hotelApi.getHotelById(id);
      return toHotel(apiHotel);
    } catch {
      return null;
    }
  }

  async findRoomsByHotelId(hotelId: string): Promise<Room[]> {
    const apiRooms = await hotelApi.getRoomsByHotelId(hotelId, true);
    return apiRooms.map(toRoom);
  }

  async findRoomById(hotelId: string, roomId: string): Promise<Room | null> {
    try {
      const apiRoom = await hotelApi.getRoomById(hotelId, roomId);
      return toRoom(apiRoom);
    } catch {
      return null;
    }
  }

  async checkAvailability(params: {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children?: number;
  }): Promise<(Room & { totalPrice: number; nights: number; isFreeCanel: boolean })[]> {
    const results = await hotelApi.checkAvailability({
      hotel_id:  params.hotelId,
      check_in:  params.checkIn,
      check_out: params.checkOut,
      adults:    params.adults,
      children:  params.children ?? 0,
    });
    return results.map((r) => ({
      ...toRoom(r.room),
      totalPrice:   r.total_price,
      nights:       r.nights,
      isFreeCanel:  r.is_free_cancel,
    }));
  }
}
