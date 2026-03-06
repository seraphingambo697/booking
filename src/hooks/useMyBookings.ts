/**
 * src/hooks/useMyBookings.ts
 *
 * Hook : page "Mes réservations" (MyBookingsPage).
 * Charge les réservations de l'utilisateur connecté.
 */

import { useState, useEffect, useRef } from "react";
import { MyBookingsPresenter } from "@/presenters/MyBookingsPresenter";
import { MyBookingsViewModel } from "@/viewmodels/BookingSummaryViewModel";
import { BookingService } from "@/services/BookingService";
import { BookingRepository } from "@/repositories/BookingRepository";
import { useAuthStore } from "@/store/authStore";

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);

export function useMyBookings() {
    const { userId } = useAuthStore();

    const [vm, setVm] = useState<MyBookingsViewModel>({
        bookings: [], isLoading: true, hasError: false, isEmpty: false,
    });

    const presenterRef = useRef(new MyBookingsPresenter(bookingService, setVm));

    useEffect(() => {
        // Utilise "u1" par défaut si non connecté (mode démo)
        presenterRef.current.loadBookings(userId ?? "u1");
    }, [userId]);

    return { vm };
}