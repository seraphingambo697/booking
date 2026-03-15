/**
 * src/hooks/useBooking.ts
 * Hook React pour le tunnel de réservation.
 *
 * Lit le contexte depuis bookingStore (chambre choisie sur HotelDetailPage)
 * et initialise le Presenter avec ces données.
 *
 * La navigation vers la confirmation est injectée via le callback onSuccess.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { BookingViewModel } from "@/viewmodels/BookingViewModel";
import { BookingRepository } from "@/repositories/BookingRepository";
import { BookingService } from "@/services/BookingService";
import { GuestInfo } from "@/core/entities/Booking";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/router/routes";

const bookingRepo = new BookingRepository();
const bookingService = new BookingService(bookingRepo);

export function useBooking() {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const bookingCtx = useBookingStore();

  const [vm, setVm] = useState<BookingViewModel>({
    hotelName: "", roomName: "", roomType: "",
    checkIn: "", checkOut: "", nights: "", guests: "",
    pricePerNight: "", basePrice: "", taxes: "", totalPrice: "", currency: "EUR",
    steps: [
      { id: 1, label: "Informations", isCompleted: false, isActive: true },
      { id: 2, label: "Récapitulatif", isCompleted: false, isActive: false },
      { id: 3, label: "Confirmation",  isCompleted: false, isActive: false },
    ],
    currentStep: 1, isSubmitting: false, canSubmit: false, hasError: false,
  });

  /* Le Presenter est créé une fois avec le callback de navigation */
  const presenterRef = useRef(
    new BookingPresenter(
      bookingService,
      setVm,
      /* onSuccess : navigue vers la page de confirmation */
      (bookingId: string) => navigate(ROUTES.BOOKING_CONFIRMATION(bookingId))
    )
  );

  /* Initialise le Presenter avec le contexte du store au montage */
  useEffect(() => {
    if (bookingCtx.room && bookingCtx.checkIn && bookingCtx.checkOut) {
      presenterRef.current.init(
        bookingCtx.hotelName!,
        bookingCtx.room,
        bookingCtx.checkIn,
        bookingCtx.checkOut,
        bookingCtx.guestCount
      );
    }
  }, []); // Exécuté une seule fois au montage

  const onGuestInfo = useCallback((info: GuestInfo) => {
    presenterRef.current.onGuestInfoChange(info);
  }, []);

  const onNext = useCallback(() => presenterRef.current.onNextStep(), []);
  const onPrev = useCallback(() => presenterRef.current.onPreviousStep(), []);

  const onSubmit = useCallback(() => {
    presenterRef.current.onSubmit(userId ?? "u1"); // "u1" = user démo
  }, [userId]);

  return { vm, onGuestInfo, onNext, onPrev, onSubmit };
}
