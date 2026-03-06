import type { Room } from "@/core/entities/Room";

export interface IRoomRepository {
    findByHotelId(hotelId: string): Promise<Room[]>;
    findById(id: string): Promise<Room | null>;
    checkAvailability(roomId: string, checkIn: Date, checkOut: Date): Promise<boolean>;
}