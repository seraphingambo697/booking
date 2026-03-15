
/**
 * src/api/bookingApi.ts
 * Appels API réservations — backend Django.
 *
 * Endpoints backend :
 *   GET    /api/v1/bookings/              → mes réservations
 *   POST   /api/v1/bookings/             → créer
 *   GET    /api/v1/bookings/{id}/        → détail
 *   DELETE /api/v1/bookings/{id}/        → annuler
 *   POST   /api/v1/payments/pay/         → payer
 */
import { apiClient } from "./apiClient";
import { ApiBooking, ApiCancelResult, ApiPayment } from "@/types/api.types";

export const bookingApi = {
    /**
     * GET /bookings/?status=PENDING
     * Mes réservations (auth requise).
     */
    getMyBookings: async (status?: string): Promise<ApiBooking[]> => {
        const { data } = await apiClient.get<ApiBooking[]>("/bookings/", {
            params: status ? { status } : undefined,
        });
        return data ?? [];
    },

    /**
     * GET /bookings/{id}/
     */
    getBookingById: async (id: string): Promise<ApiBooking> => {
        const { data } = await apiClient.get<ApiBooking>(`/bookings/${id}/`);
        return data;
    },

    /**
     * POST /bookings/
     * Crée une réservation PENDING (avant paiement).
     */
    createBooking: async (payload: {
        hotel_id: string;
        room_id: string;
        check_in: string;    // "YYYY-MM-DD"
        check_out: string;   // "YYYY-MM-DD"
        adults: number;
        children?: number;
        special_requests?: string;
    }): Promise<ApiBooking> => {
        const { data } = await apiClient.post<ApiBooking>("/bookings/", {
            hotel_id: payload.hotel_id,
            room_id: payload.room_id,
            check_in: payload.check_in,
            check_out: payload.check_out,
            adults: payload.adults,
            children: payload.children ?? 0,
            special_requests: payload.special_requests ?? "",
        });
        return data;
    },

    /**
     * DELETE /bookings/{id}/
     * Annule une réservation. Retourne l'info de remboursement.
     */
    cancelBooking: async (id: string, reason = ""): Promise<ApiCancelResult> => {
        const { data } = await apiClient.delete<ApiCancelResult>(`/bookings/${id}/`, {
            data: { reason },
        });
        return data;
    },

    /**
     * POST /payments/pay/
     * Paye une réservation PENDING → la passe en CONFIRMED.
     */
    payBooking: async (bookingId: string, method = "CARD"): Promise<ApiPayment> => {
        const { data } = await apiClient.post<ApiPayment>("/payments/pay/", {
            booking_id: bookingId,
            method,
        });
        return data;
    },
};
