/**
 * src/hooks/useBooking.ts
 *
 * Hook : tunnel de réservation (BookingPage).
 *
 * Lit le contexte depuis bookingStore (chambre sélectionnée, dates, hôtel).
 * Initialise le BookingPresenter avec ces données.
 *
 * onSuccess navigue vers la page de confirmation avec l'id de la réservation.
 * Le presenter ne connaît pas navigate() → injection via onSuccess.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BookingPresenter } from "@/presenters/BookingPresenter";
import { BookingViewModel } from "@/viewmodels/BookingViewModel";
import { BookingService } from "@/services/BookingService";
import { BookingRepository } from "@/repositories/BookingRepository";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { GuestInfo } from "@/core/entities/Booking";
import { ROUTES } from "@/router/routes";

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);

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
            { id: 3, label: "Confirmation", isCompleted: false, isActive: false },
        ],
        currentStep: 1, isSubmitting: false, canSubmit: false, hasError: false,
    });

    // Crée le presenter avec la navigation en callback de succès
    const presenterRef = useRef(
        new BookingPresenter(
            bookingService,
            setVm,
            // Callback de succès → navigue vers la confirmation
            (bookingId) => navigate(ROUTES.BOOKING_CONFIRMATION(bookingId))
        )
    );

    // Initialise le presenter avec le contexte du store
    useEffect(() => {
        if (bookingCtx.room && bookingCtx.checkIn && bookingCtx.checkOut && bookingCtx.hotelName) {
            presenterRef.current.init(
                bookingCtx.hotelName,
                bookingCtx.room,
                bookingCtx.checkIn,
                bookingCtx.checkOut,
                bookingCtx.guestCount
            );
        }
    }, []);

    const onGuestInfo = useCallback(
        (info: GuestInfo) => presenterRef.current.onGuestInfoChange(info),
        []
    );

    const onNext = useCallback(
        () => presenterRef.current.onNextStep(),
        []
    );

    const onPrev = useCallback(
        () => presenterRef.current.onPreviousStep(),
        []
    );

    const onSubmit = useCallback(
        () => presenterRef.current.onSubmit(userId ?? "u1"),
        [userId]
    );

    return { vm, onGuestInfo, onNext, onPrev, onSubmit };
}