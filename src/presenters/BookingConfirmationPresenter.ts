/**
 * src/presenters/BookingConfirmationPresenter.ts
 * Presenter pour la page de confirmation d'une réservation.
 */
import { IBookingConfirmationPresenter } from "@/interfaces/presenters/IBookingConfirmationPresenter";
import { IBookingService } from "@/interfaces/services/IBookingService";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { formatPrice, formatDate, formatNights, formatGuests, countNights } from "@/lib/utils";

export class BookingConfirmationPresenter implements IBookingConfirmationPresenter {
  private vm: BookingConfirmationViewModel = {
    bookingId: "", bookingRef: "", hotelName: "", roomName: "",
    checkIn: "", checkOut: "", nights: "", guests: "",
    totalPrice: "", status: "", statusColor: "",
    guestName: "", guestEmail: "",
    canCancel: false, isLoading: true, hasError: false,
  };

  constructor(
    private bookingService: IBookingService,
    private onChange: (vm: BookingConfirmationViewModel) => void
  ) {}

  async loadConfirmation(bookingId: string): Promise<void> {
    this.update({ isLoading: true });

    try {
      const booking = await this.bookingService.getById(bookingId);
      if (!booking) throw new Error("Réservation introuvable.");

      const nights = countNights(booking.checkIn, booking.checkOut);

      // Mapping statut → label et couleur CSS
      const statusDisplay: Record<string, { label: string; color: string }> = {
        [BookingStatus.CONFIRMED]: { label: "Confirmée",  color: "text-green-600" },
        [BookingStatus.PENDING]:   { label: "En attente", color: "text-yellow-600" },
        [BookingStatus.CANCELLED]: { label: "Annulée",    color: "text-red-600" },
        [BookingStatus.COMPLETED]: { label: "Terminée",   color: "text-gray-500" },
      };
      const { label, color } = statusDisplay[booking.status] ?? { label: booking.status, color: "" };

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
        status: label,
        statusColor: color,
        guestName: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
        guestEmail: booking.guestInfo.email,
        canCancel:
          booking.status === BookingStatus.CONFIRMED ||
          booking.status === BookingStatus.PENDING,
      });
    } catch (error: any) {
      this.update({ isLoading: false, hasError: true, errorMessage: error.message });
    }
  }

  async onCancel(bookingId: string): Promise<void> {
    await this.bookingService.cancel(bookingId);
    // Mise à jour locale sans rechargement complet
    this.update({
      canCancel: false,
      status: "Annulée",
      statusColor: "text-red-600",
    });
  }

  private update(partial: Partial<BookingConfirmationViewModel>): void {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel(): BookingConfirmationViewModel { return this.vm; }
}
