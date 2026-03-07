/**
 * src/presenters/BookingConfirmationPresenter.ts
 *
 * Presenter de la page de confirmation de réservation.
 *
 * Charge une réservation par son id et la transforme en
 * BookingConfirmationViewModel pour l'affichage de la page de confirmation.
 *
 * Calcule aussi :
 * - statusColor : classe CSS selon le statut
 * - canCancel : règle métier (annulation possible si CONFIRMED ou PENDING)
 * - bookingRef : référence lisible formatée
 */

import { IBookingConfirmationPresenter } from "@/interfaces/presenters/IBookingConfirmationPresenter";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { formatDate, formatNights, formatGuests, formatPrice } from "@/lib/formatters";
import { countNights } from "@/lib/dateUtils";
import { IBookingService } from "@/interfaces/services/IBookingService";

/** Mapping statut → label + couleur CSS */
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    [BookingStatus.CONFIRMED]: { label: "Confirmée", color: "text-green-600" },
    [BookingStatus.PENDING]: { label: "En attente", color: "text-yellow-600" },
    [BookingStatus.CANCELLED]: { label: "Annulée", color: "text-red-600" },
    [BookingStatus.COMPLETED]: { label: "Terminée", color: "text-gray-500" },
};

export class BookingConfirmationPresenter implements IBookingConfirmationPresenter {
    private vm: BookingConfirmationViewModel = {
        bookingId: "", bookingRef: "", hotelName: "", roomName: "",
        checkIn: "", checkOut: "", nights: "", guests: "",
        totalPrice: "", status: "", statusColor: "", guestName: "",
        guestEmail: "", canCancel: false, isLoading: false, hasError: false,
    };

    constructor(
        private bookingService: IBookingService,
        private onChange: (vm: BookingConfirmationViewModel) => void
    ) { }

    async loadConfirmation(bookingId: string): Promise<void> {
        this.update({ isLoading: true, hasError: false });

        try {
            const booking = await this.bookingService.getById(bookingId);
            if (!booking) throw new Error("Réservation introuvable");

            const nights = countNights(booking.checkIn, booking.checkOut);
            const statusConfig = STATUS_CONFIG[booking.status] ?? {
                label: booking.status, color: "text-gray-500",
            };

            this.update({
                isLoading: false,
                bookingId: booking.id,
                bookingRef: `LX-${booking.id.toUpperCase()}`,
                hotelName: booking.hotelName,
                roomName: booking.roomName,
                checkIn: formatDate(booking.checkIn),
                checkOut: formatDate(booking.checkOut),
                nights: formatNights(nights),
                guests: formatGuests(booking.guestCount),
                totalPrice: formatPrice(booking.totalPrice, booking.currency),
                status: statusConfig.label,
                statusColor: statusConfig.color,
                guestName: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
                guestEmail: booking.guestInfo.email,
                // Règle métier : annulation possible seulement si CONFIRMED ou PENDING
                canCancel:
                    booking.status === BookingStatus.CONFIRMED ||
                    booking.status === BookingStatus.PENDING,
            });
        } catch (error: any) {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: error.message,
            });
        }
    }

    async onCancel(bookingId: string): Promise<void> {
        await this.bookingService.cancel(bookingId);
        // Met à jour le ViewModel pour refléter l'annulation
        this.update({
            canCancel: false,
            status: STATUS_CONFIG[BookingStatus.CANCELLED].label,
            statusColor: STATUS_CONFIG[BookingStatus.CANCELLED].color,
        });
    }

    private update(partial: Partial<BookingConfirmationViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): BookingConfirmationViewModel {
        return this.vm;
    }
}