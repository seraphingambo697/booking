/**
 * src/repositories/BookingRepository.ts
 * Connecté au backend Django — plus de données mock.
 *
 * Flux de création d'une réservation :
 *   1. POST /bookings/        → crée PENDING (retourne booking.id)
 *   2. POST /payments/pay/    → paye → backend passe à CONFIRMED
 *   3. GET  /bookings/{id}/   → recharge pour avoir le statut final
 */
import { IBookingRepository, CreateBookingPayload } from "@/interfaces/repositories/IBookingRepository";
import { Booking } from "@/core/entities/Booking";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { bookingApi } from "@/api/bookingApi";
import { ApiBooking } from "@/types/api.types";

// ── Convertisseur API → Entité ────────────────────────────────────────────────

function toBooking(api: ApiBooking): Booking {
  return {
    id:         api.id,
    userId:     api.user_id,
    hotelId:    api.hotel_id,
    roomId:     api.room_id,
    hotelName:  "",           // non retourné par le backend — à enrichir si besoin
    roomName:   "",
    checkIn:    new Date(api.check_in),
    checkOut:   new Date(api.check_out),
    guestCount: api.guest_count,
    status:     api.status as BookingStatus,
    totalPrice: api.total_price,
    currency:   api.currency,
    guestInfo: {
      firstName: "",
      lastName:  "",
      email:     "",
      phone:     "",
    },
    createdAt: new Date(api.created_at),
  };
}

// ── Repository ────────────────────────────────────────────────────────────────

export class BookingRepository implements IBookingRepository {

  /**
   * Crée une réservation PENDING puis la paye immédiatement.
   * Le backend passe le statut à CONFIRMED après paiement réussi.
   */
  async create(payload: CreateBookingPayload): Promise<Booking> {
    // Étape 1 — Créer la réservation PENDING
    const created = await bookingApi.createBooking({
      hotel_id:  payload.hotelId,
      room_id:   payload.roomId,
      check_in:  payload.checkIn.toISOString().split("T")[0],
      check_out: payload.checkOut.toISOString().split("T")[0],
      adults:    payload.guestCount,
      children:  0,
      special_requests: "",
    });

    // Étape 2 — Payer (mock gateway, succès garanti en dev)
    try {
      await bookingApi.payBooking(created.id, "CARD");
    } catch (e) {
      // Si le paiement échoue, la réservation reste PENDING
      // L'utilisateur peut réessayer depuis "Mes réservations"
      console.warn("Paiement échoué, réservation en attente :", e);
    }

    // Étape 3 — Recharger pour avoir le statut final
    const final = await bookingApi.getBookingById(created.id);
    return toBooking(final);
  }

  async findByUserId(_userId: string): Promise<Booking[]> {
    const apiBookings = await bookingApi.getMyBookings();
    return apiBookings
      .map(toBooking)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Booking | null> {
    try {
      const api = await bookingApi.getBookingById(id);
      return toBooking(api);
    } catch {
      return null;
    }
  }

  async cancel(id: string): Promise<Booking> {
    const result = await bookingApi.cancelBooking(id);
    return toBooking(result.booking);
  }
}
