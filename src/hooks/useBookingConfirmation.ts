/**
 * src/hooks/useBookingConfirmation.ts
 *
 * Hook : page de confirmation de réservation (BookingConfirmationPage).
 *
 * Charge les détails de la réservation depuis l'id dans l'URL.
 * Expose onCancel pour annuler depuis cette page.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { BookingConfirmationPresenter } from "@/presenters/BookingConfirmationPresenter";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";
import { BookingService } from "@/services/BookingService";
import { BookingRepository } from "@/repositories/BookingRepository";

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);

export function useBookingConfirmation(bookingId: string) {
    const [vm, setVm] = useState<BookingConfirmationViewModel>({
        bookingId: "", bookingRef: "", hotelName: "", roomName: "",
        checkIn: "", checkOut: "", nights: "", guests: "",
        totalPrice: "", status: "", statusColor: "", guestName: "",
        guestEmail: "", canCancel: false, isLoading: true, hasError: false,
    });

    const presenterRef = useRef(
        new BookingConfirmationPresenter(bookingService, setVm)
    );

    useEffect(() => {
        if (bookingId) {
            presenterRef.current.loadConfirmation(bookingId);
        }
    }, [bookingId]);

    const onCancel = useCallback(
        () => presenterRef.current.onCancel(bookingId),
        [bookingId]
    );

    return { vm, onCancel };
}