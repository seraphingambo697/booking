/**
 * src/services/BookingService.ts
 *
 * Implémentation concrète de IBookingService.
 *
 * Contient la règle de calcul du prix (logique métier pure) :
 * total = (pricePerNight × nights) + 10% de taxes
 *
 * Cette règle est ici (Service) et non dans le Presenter ni le composant.
 * Avantage : un seul endroit à modifier si les taxes changent.
 */

import { Booking } from "@/core/entities/Booking";
import { IBookingRepository, CreateBookingPayload } from "@/interfaces/repositories/IBookingRepository";
import { IBookingService, PriceSummary } from "@/interfaces/services/IBookingService";
import { countNights } from "@/lib/dateUtils";

export class BookingService implements IBookingService {
    constructor(private bookingRepo: IBookingRepository) { }

    async create(payload: CreateBookingPayload): Promise<Booking> {
        // En production : validation supplémentaire ici (chambre disponible, dates valides...)
        return this.bookingRepo.create(payload);
    }

    async getByUserId(userId: string): Promise<Booking[]> {
        return this.bookingRepo.findByUserId(userId);
    }

    async getById(id: string): Promise<Booking | null> {
        return this.bookingRepo.findById(id);
    }

    async cancel(id: string): Promise<Booking> {
        // En production : vérifier que la réservation peut encore être annulée
        // (ex: pas moins de 24h avant l'arrivée)
        return this.bookingRepo.cancel(id);
    }

    /**
     * Calcule le prix d'une réservation.
     *
     * Règle métier :
     * - basePrice = pricePerNight × nights
     * - taxes = 10% du basePrice (TVA hôtelière)
     * - total = basePrice + taxes
     *
     * Synchrone : pur calcul, pas de requête réseau.
     */
    calculatePrice(pricePerNight: number, checkIn: Date, checkOut: Date): PriceSummary {
        const nights = countNights(checkIn, checkOut);
        const basePrice = pricePerNight * nights;
        const taxes = Math.round(basePrice * 0.1);  // 10% de TVA, arrondi à l'euro

        return {
            basePrice,
            nights,
            taxes,
            total: basePrice + taxes,
            currency: "EUR",
        };
    }
}