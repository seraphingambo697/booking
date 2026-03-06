/**
 * src/presenters/MyBookingsPresenter.ts
 *
 * Presenter de la page "Mes réservations".
 * Transforme Booking[] en BookingSummaryViewModel[].
 */

import { MyBookingsViewModel, BookingSummaryViewModel } from "@/viewmodels/BookingSummaryViewModel";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { formatDate, formatNights, formatPrice } from "@/lib/formatters";
import { countNights } from "@/lib/dateUtils";
import { IBookingService } from "@/interfaces/services/IHotelService";

const STATUS_MAP: Record<string, { label: string; color: BookingSummaryViewModel["statusColor"] }> = {
    [BookingStatus.CONFIRMED]: { label: "Confirmée", color: "default" },
    [BookingStatus.PENDING]: { label: "En attente", color: "secondary" },
    [BookingStatus.CANCELLED]: { label: "Annulée", color: "destructive" },
    [BookingStatus.COMPLETED]: { label: "Terminée", color: "outline" },
};

export class MyBookingsPresenter {
    private vm: MyBookingsViewModel = {
        bookings: [], isLoading: false, hasError: false, isEmpty: false,
    };

    constructor(
        private bookingService: IBookingService,
        private onChange: (vm: MyBookingsViewModel) => void
    ) { }

    async loadBookings(userId: string): Promise<void> {
        this.update({ isLoading: true, hasError: false });

        try {
            const bookings = await this.bookingService.getByUserId(userId);
            const s = (status: string) => STATUS_MAP[status] ?? { label: status, color: "outline" as const };

            this.update({
                isLoading: false,
                isEmpty: bookings.length === 0,
                bookings: bookings.map((b) => ({
                    id: b.id,
                    bookingRef: `LX-${b.id.toUpperCase()}`,
                    hotelName: b.hotelName,
                    roomName: b.roomName,
                    checkIn: formatDate(b.checkIn),
                    checkOut: formatDate(b.checkOut),
                    nights: formatNights(countNights(b.checkIn, b.checkOut)),
                    totalPrice: formatPrice(b.totalPrice, b.currency),
                    status: s(b.status).label,
                    statusColor: s(b.status).color,
                    canCancel:
                        b.status === BookingStatus.CONFIRMED ||
                        b.status === BookingStatus.PENDING,
                })),
            });
        } catch {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: "Impossible de charger vos réservations.",
            });
        }
    }

    private update(partial: Partial<MyBookingsViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }
}