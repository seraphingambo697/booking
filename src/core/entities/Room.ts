import { RoomType } from "../enums/RoomType";

export interface Room {
    id: string;
    hotelId: string;
    type: RoomType;
    name: string;
    description: string;
    pricePerNight: number;
    currency: string;
    capacity: number;
    size: number;
    images: string[];
    amenities: string[];
    isAvailable: boolean;
    bedCount: number;
    bedType: string;
}