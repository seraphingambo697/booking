/**
 * src/store/bookingStore.ts
 *
 * Store Zustand pour le contexte de réservation en cours.
 *
 * Persiste le contexte entre HotelDetailPage → BookingPage.
 * Quand l'utilisateur clique "Réserver" sur une chambre, on stocke
 * toutes les infos ici, puis BookingPage les lit.
 *
 * room est typé any ici car c'est un RoomViewModel.
 * On évite d'importer RoomViewModel pour garder le store léger.
 * (L'injection se fait via setBookingContext depuis HotelDetailPage)
 */

import { create } from "zustand";

interface BookingStore {
    hotelId: string | null;
    roomId: string | null;
    hotelName: string | null;
    /** RoomViewModel complet (avec priceRaw pour les calculs) */
    room: any | null;
    checkIn: Date | null;
    checkOut: Date | null;
    guestCount: number;

    /**
     * Initialise le contexte de réservation.
     * Appelé dans HotelDetailPage quand l'utilisateur clique "Réserver".
     */
    setBookingContext: (data: {
        hotelId: string;
        roomId: string;
        hotelName: string;
        room: any;
        checkIn: Date;
        checkOut: Date;
        guestCount: number;
    }) => void;

    /** Réinitialise après confirmation ou annulation */
    reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    hotelId: null,
    roomId: null,
    hotelName: null,
    room: null,
    checkIn: null,
    checkOut: null,
    guestCount: 2,

    setBookingContext: (data) => set(data),

    reset: () =>
        set({
            hotelId: null, roomId: null, hotelName: null,
            room: null, checkIn: null, checkOut: null, guestCount: 2,
        }),
}));