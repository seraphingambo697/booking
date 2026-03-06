import type { Hotel } from "@/core/entities/Hotel";

export interface SearchParams {
    city: string;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
    minPrice?: number;
    maxPrice?: number;
    stars?: number[];
    amenities?: string[];
}

export interface IHotelRepository {
    findAll(params: SearchParams): Promise<Hotel[]>;
    findById(id: string): Promise<Hotel | null>;
    findByCity(city: string): Promise<Hotel[]>;
}