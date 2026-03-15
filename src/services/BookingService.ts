/**
 * src/services/BookingService.ts
 * Service pour la logique métier des réservations.
 *
 * RÈGLE MÉTIER PRINCIPALE : taxes = 10% du prix de base.
 * Cette règle est ici (dans le service), pas dans le composant React,
 * pour être facilement testable et modifiable.
 */
import { IBookingService, PriceSummary } from "@/interfaces/services/IBookingService";
import { IBookingRepository, CreateBookingPayload } from "@/interfaces/repositories/IBookingRepository";
import { Booking } from "@/core/entities/Booking";
import { countNights } from "@/lib/utils";

export class BookingService implements IBookingService {
  constructor(private bookingRepo: IBookingRepository) {}

  async create(payload: CreateBookingPayload): Promise<Booking> {
    return this.bookingRepo.create(payload);
  }

  async getByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepo.findByUserId(userId);
  }

  async getById(id: string): Promise<Booking | null> {
    return this.bookingRepo.findById(id);
  }

  async cancel(id: string): Promise<Booking> {
    return this.bookingRepo.cancel(id);
  }

  /**
   * Calcule le récapitulatif de prix.
   *
   * RÈGLE MÉTIER :
   * - Nombre de nuits = différence en jours (minimum 1)
   * - Prix de base = pricePerNight × nights
   * - Taxes = 10% du prix de base (arrondi à l'entier supérieur)
   * - Total = prix de base + taxes
   */
  calculatePrice(pricePerNight: number, checkIn: Date, checkOut: Date): PriceSummary {
    const nights = countNights(checkIn, checkOut);
    const basePrice = pricePerNight * nights;
    const taxes = Math.ceil(basePrice * 0.10); // 10% de taxes, arrondi au supérieur
    const total = basePrice + taxes;

    return {
      basePrice,
      nights,
      taxes,
      total,
      currency: "EUR",
    };
  }
}
