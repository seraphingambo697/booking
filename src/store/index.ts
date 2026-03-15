import { create } from "zustand";
import { SearchParams } from "@/interfaces";

// ─── Search Store ─────────────────────────────────────────────────────────────

interface SearchStore {
  params: Partial<SearchParams>;
  setParams: (params: Partial<SearchParams>) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  params: { city: "", guestCount: 2 },
  setParams: (params) => set((s) => ({ params: { ...s.params, ...params } })),
  reset: () => set({ params: { city: "", guestCount: 2 } }),
}));

// ─── Booking Store ────────────────────────────────────────────────────────────

interface BookingStore {
  hotelId: string | null;
  roomId: string | null;
  hotelName: string | null;
  room: any | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guestCount: number;
  setBookingContext: (data: {
    hotelId: string;
    roomId: string;
    hotelName: string;
    room: any;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
  }) => void;
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
  reset: () => set({ hotelId: null, roomId: null, hotelName: null, room: null, checkIn: null, checkOut: null, guestCount: 2 }),
}));

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthStore {
  userId: string | null;
  isAuthenticated: boolean;
  setAuth: (userId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  isAuthenticated: false,
  setAuth: (userId) => set({ userId, isAuthenticated: true }),
  clearAuth: () => set({ userId: null, isAuthenticated: false }),
}));
