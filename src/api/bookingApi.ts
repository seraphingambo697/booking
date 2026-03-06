/**
 * src/api/bookingApi.ts
 *
 * Module API pour les réservations.
 * Utilisé par BookingRepository pour les opérations CRUD sur les réservations.
 */

import apiClient from "@/api/apiClient";
import { ApiBooking } from "@/types/api.types";
import { CreateBookingPayload } from "@/interfaces/repositories/IBookingRepository";

/**
 * Crée une nouvelle réservation.
 */
export async function createBooking(payload: CreateBookingPayload): Promise<ApiBooking> {
    const response = await apiClient.post<ApiBooking>("/bookings", {
        user_id: payload.userId,
        room_id: payload.roomId,
        hotel_id: payload.hotelId,
        check_in: payload.checkIn.toISOString(),
        check_out: payload.checkOut.toISOString(),
        guest_count: payload.guestCount,
        guest_info: {
            first_name: payload.guestInfo.firstName,
            last_name: payload.guestInfo.lastName,
            email: payload.guestInfo.email,
            phone: payload.guestInfo.phone,
        },
    });
    return response.data;
}

/**
 * Récupère les réservations d'un utilisateur.
 */
export async function getUserBookings(userId: string): Promise<ApiBooking[]> {
    const response = await apiClient.get<ApiBooking[]>(`/users/${userId}/bookings`);
    return response.data;
}

/**
 * Annule une réservation.
 */
export async function cancelBooking(id: string): Promise<ApiBooking> {
    const response = await apiClient.patch<ApiBooking>(`/bookings/${id}/cancel`);
    return response.data;
}