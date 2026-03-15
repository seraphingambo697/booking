/**
 * src/hooks/useBookingConfirmation.ts
 * Hook React pour la page de confirmation de réservation.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { BookingConfirmationPresenter } from "@/presenters/BookingConfirmationPresenter";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";
import { BookingRepository } from "@/repositories/BookingRepository";
import { BookingService } from "@/services/BookingService";

const bookingRepo = new BookingRepository();
const bookingService = new BookingService(bookingRepo);

export function useBookingConfirmation(bookingId: string) {
  const [vm, setVm] = useState<BookingConfirmationViewModel>({
    bookingId: "", bookingRef: "", hotelName: "", roomName: "",
    checkIn: "", checkOut: "", nights: "", guests: "",
    totalPrice: "", status: "", statusColor: "",
    guestName: "", guestEmail: "",
    canCancel: false, isLoading: true, hasError: false,
  });

  const presenterRef = useRef(
    new BookingConfirmationPresenter(bookingService, setVm)
  );

  useEffect(() => {
    if (bookingId) {
      presenterRef.current.loadConfirmation(bookingId);
    }
  }, [bookingId]);

  const onCancel = useCallback(() => {
    presenterRef.current.onCancel(bookingId);
  }, [bookingId]);

  return { vm, onCancel };
}
