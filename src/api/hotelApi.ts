/**
 * src/api/hotelApi.ts
 * Appels API hôtels et chambres — backend .
 */
import { apiClient } from "./apiClient";
import { ApiHotel, ApiRoom, ApiAvailableRoom, ApiSearchResult } from "@/types/api.types";

export const hotelApi = {
    /**
     * GET /hotels/?city=Paris&page_size=20
     */
    listHotels: async (params?: {
        city?: string;
        stars?: number;
        page?: number;
        page_size?: number;
    }): Promise<ApiHotel[]> => {
        const { data } = await apiClient.get<ApiHotel[]>("/hotels/", { params });
        return data ?? [];
    },

    /**
     * GET /hotels/{id}/
     * Détail d'un hôtel.
     */
    getHotelById: async (id: string): Promise<ApiHotel> => {
        const { data } = await apiClient.get<ApiHotel>(`/hotels/${id}/`);
        return data;
    },

    /**
     * GET /hotels/{id}/rooms/?available_only=true
     */
    getRoomsByHotelId: async (
        hotelId: string,
        availableOnly = false
    ): Promise<ApiRoom[]> => {
        const { data } = await apiClient.get<ApiRoom[]>(
            `/hotels/${hotelId}/rooms/`,
            { params: availableOnly ? { available_only: true } : undefined }
        );
        return data ?? [];
    },

    /**
     * GET /hotels/{id}/rooms/{rid}/
     */
    getRoomById: async (hotelId: string, roomId: string): Promise<ApiRoom> => {
        const { data } = await apiClient.get<ApiRoom>(`/hotels/${hotelId}/rooms/${roomId}/`);
        return data;
    },

    /**
     * POST /bookings/availability/
     */
    checkAvailability: async (params: {
        hotel_id: string;
        check_in: string;
        check_out: string;
        adults?: number;
        children?: number;
    }): Promise<ApiAvailableRoom[]> => {
        const { data } = await apiClient.post<ApiAvailableRoom[]>(
            "/bookings/availability/",
            {
                hotel_id: params.hotel_id,
                check_in: params.check_in,
                check_out: params.check_out,
                adults: params.adults ?? 1,
                children: params.children ?? 0,
            }
        );
        return data ?? [];
    },

    /**
     * POST /search/
     */
    searchHotels: async (params: {
        city: string;
        check_in: string;
        check_out: string;
        guest_count?: number;
        adults?: number;
        children?: number;
        stars_min?: number;
        price_max?: number;
        amenities?: string[];
    }): Promise<ApiSearchResult[]> => {
        const { data } = await apiClient.post<ApiSearchResult[]>("/search/", {
            city: params.city,
            check_in: params.check_in,
            check_out: params.check_out,
            guest_count: params.guest_count ?? (params.adults ?? 1) + (params.children ?? 0),
            stars_min: params.stars_min,
            price_max: params.price_max,
            amenities: params.amenities,
        });
        return data ?? [];
    },
};

// ── CRUD Rooms (admin) ────────────────────────────────────────────────────────

export const roomApi = {
    /** POST /hotels/{id}/rooms/ */
    createRoom: async (hotelId: string, payload: {
        name: string; type: string; description: string;
        price_per_night: number; currency: string;
        capacity: number; size_sqm: number;
        bed_count: number; bed_type: string; floor: number;
        amenities: string[]; images: string[]; is_available: boolean;
    }): Promise<ApiRoom> => {
        const { data } = await apiClient.post<ApiRoom>(`/hotels/${hotelId}/rooms/`, payload);
        return data;
    },

    updateRoom: async (hotelId: string, roomId: string, payload: Partial<{
        name: string; type: string; description: string;
        price_per_night: number; capacity: number;
        size_sqm: number; bed_count: number; bed_type: string;
        floor: number; amenities: string[]; images: string[]; is_available: boolean;
    }>): Promise<ApiRoom> => {
        const { data } = await apiClient.patch<ApiRoom>(`/hotels/${hotelId}/rooms/${roomId}/`, payload);
        return data;
    },

    disableRoom: async (hotelId: string, roomId: string): Promise<void> => {
        await apiClient.patch(`/hotels/${hotelId}/rooms/${roomId}/`, { is_available: false });
    },
};