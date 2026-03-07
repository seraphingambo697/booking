import { Hotel } from "@/core/entities/Hotel";
import { SearchParams } from "../repositories/IHotelRepository";

export interface SortOption {
    field: "price" | "rating" | "stars" | "reviewCount";
    direction: "asc" | "desc";
}

export interface HotelFilters {
    minPrice?: number;
    maxPrice?: number;
    stars?: number[];
    amenities?: string[];
}

export interface IHotelService {
    search(params: SearchParams): Promise<Hotel[]>;
    getById(id: string): Promise<Hotel | null>;
    sortHotels(hotels: Hotel[], sort: SortOption): Hotel[];
    filterHotels(hotels: Hotel[], filters: HotelFilters): Hotel[];
}