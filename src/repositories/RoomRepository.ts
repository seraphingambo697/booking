/**
 * src/repositories/RoomRepository.ts
 * Connecté au backend Django — plus de données mock.
 */
import { IRoomRepository } from "@/interfaces/repositories/IRoomRepository";
import { Room } from "@/core/entities/Room";
import { hotelApi } from "@/api/hotelApi";
import { ApiRoom } from "@/types/api.types";

function toRoom(api: ApiRoom): Room {
  return {
    id: api.id,
    hotelId: api.hotel_id,
    type: api.type as Room["type"],
    name: api.name,
    description: api.description,
    pricePerNight: api.price_per_night,
    currency: api.currency,
    capacity: api.capacity,
    size: api.size_sqm,
    images: api.images ?? [],
    amenities: api.amenities ?? [],
    isAvailable: api.is_available,
    bedCount: api.bed_count,
    bedType: api.bed_type,
  };
}

export class RoomRepository implements IRoomRepository {

  async findByHotelId(hotelId: string): Promise<Room[]> {
    const apiRooms = await hotelApi.getRoomsByHotelId(hotelId, true);
    return apiRooms.map(toRoom);
  }

  async findById(_id: string): Promise<Room | null> {
    // Sans hotelId on ne peut pas appeler l'endpoint direct
    // On retourne null — le Presenter doit utiliser findByHotelId
    return null;
  }

  async checkAvailability(_roomId: string): Promise<boolean> {
    // La vraie disponibilité est vérifiée via checkAvailability du HotelRepository
    // Cette méthode est conservée pour compatibilité interface
    return true;
  }
}
