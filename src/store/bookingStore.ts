/**
 * src/store/bookingStore.ts
 * Store Zustand pour le contexte de réservation en cours.
 *
 * Problème résolu :
 * L'utilisateur choisit une chambre sur HotelDetailPage,
 * puis navigue vers BookingPage. Comment passer les données entre les pages ?
 *
 * Solution : ce store persiste le contexte entre les navigations React Router.
 * Plus propre que les URL params pour des objets complexes.
 *
 * Cycle de vie :
 * 1. HotelDetailPage → setBookingContext() quand l'utilisateur clique "Réserver"
 * 2. BookingPage → lit le contexte via useBookingStore()
 * 3. Après confirmation → reset() pour nettoyer
 */
import { create } from "zustand";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";

interface BookingStore {
  /* Contexte de la réservation en cours */
  hotelId: string | null;
  roomId: string | null;
  hotelName: string | null;
  /** ViewModel de la chambre (déjà formaté par le HotelDetailPresenter) */
  room: RoomViewModel | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guestCount: number;

  /** Initialise le contexte quand l'utilisateur clique "Réserver" sur une chambre */
  setBookingContext: (data: {
    hotelId: string;
    roomId: string;
    hotelName: string;
    room: RoomViewModel;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
  }) => void;

  /** Nettoie le contexte après confirmation ou annulation */
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

  reset: () => set({
    hotelId: null, roomId: null, hotelName: null,
    room: null, checkIn: null, checkOut: null, guestCount: 2,
  }),
}));
