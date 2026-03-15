/**
 * src/types/api.types.ts
 *
 * Types relatifs aux échanges avec l'API REST.
 *
 * Ces types représentent la forme exacte des données JSON
 * renvoyées par l'API (avant transformation en entités).
 *

 * Les repositories se chargent de la transformation (ApiBooking → Booking)
 */

/** Réponse paginée générique de l'API */
export interface ApiPaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

/** Réponse d'erreur standard de l'API */
export interface ApiErrorResponse {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

/** Hôtel tel que retourné par l'API (dates en string) */
export interface ApiHotel {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    stars: number;
    rating: number;
    review_count: number;
    images: string[];
    amenities: string[];
    price_from: number;
    currency: string;
}

/** Réservation telle que retournée par l'API */
export interface ApiBooking {
    id: string;
    user_id: string;
    hotel_id: string;
    room_id: string;
    hotel_name: string;
    room_name: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    status: string;
    total_price: number;
    currency: string;
    guest_info: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
    };
    created_at: string;
}

/** Token d'authentification*/
export interface ApiAuthResponse {
    access_token: string;
    token_type: "Bearer";
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}