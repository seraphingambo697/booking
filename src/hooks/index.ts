import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HotelRepository, RoomRepository, BookingRepository } from "@/repositories";
import { HotelService, BookingService, AuthService } from "@/services";
import {
  SearchPresenter, HotelListPresenter, HotelDetailPresenter,
  BookingPresenter, BookingConfirmationPresenter, MyBookingsPresenter, AuthPresenter,
} from "@/presenters";
/*import {
  SearchViewModel, HotelListViewModel, HotelDetailViewModel,
  BookingViewModel, BookingConfirmationViewModel, MyBookingsViewModel, AuthViewModel,
} from "@/viewmodels";*/
//import { SearchParams, SortOption, HotelFilters } from "@/interfaces";
import { useAuthStore, useBookingStore } from "@/store";
import { ROUTES } from "@/router/routes";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { HotelListViewModel } from "@/viewmodels/HotelListViewModel";
import { HotelFilters, SortOption } from "@/interfaces/services/IHotelService";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { BookingViewModel } from "@/viewmodels/BookingViewModel";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";
import { MyBookingsViewModel } from "@/viewmodels/BookingSummaryViewModel";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";

// ─── Singletons ───────────────────────────────────────────────────────────────
const hotelRepo = new HotelRepository();
const roomRepo = new RoomRepository();
const bookingRepo = new BookingRepository();
const hotelService = new HotelService(hotelRepo);
const bookingService = new BookingService(bookingRepo);
const authService = new AuthService();

// ─── useSearch ────────────────────────────────────────────────────────────────

export function useSearch() {
  const [vm, setVm] = useState<SearchViewModel>({
    city: "", checkIn: null, checkOut: null, guestCount: 2, isValid: false,
  });
  const presenter = useRef(new SearchPresenter(setVm));
  return { vm, presenter: presenter.current };
}

// ─── useHotelList ─────────────────────────────────────────────────────────────

export function useHotelList(params: Partial<SearchParams>) {
  const [vm, setVm] = useState<HotelListViewModel>({
    hotels: [], isLoading: false, hasError: false,
    totalResults: "", isEmpty: false,
    currentSort: { field: "rating", direction: "desc" },
    activeFilters: {},
  });
  const presenter = useRef(new HotelListPresenter(hotelService, setVm));

  useEffect(() => {
    if (params.city !== undefined) {
      presenter.current.loadHotels({
        city: params.city ?? "",
        checkIn: params.checkIn ?? new Date(),
        checkOut: params.checkOut ?? new Date(),
        guestCount: params.guestCount ?? 2,
      });
    }
  }, [params.city, params.checkIn, params.checkOut, params.guestCount]);

  const onSort = useCallback((sort: SortOption) => presenter.current.onSortChange(sort), []);
  const onFilter = useCallback((f: HotelFilters) => presenter.current.onFilterChange(f), []);

  return { vm, onSort, onFilter };
}

// ─── useHotelDetail ───────────────────────────────────────────────────────────

export function useHotelDetail(hotelId: string) {
  const [vm, setVm] = useState<HotelDetailViewModel>({
    id: "", name: "", description: "", address: "", city: "", country: "",
    stars: 0, rating: 0, reviewCount: "", images: [], amenities: [],
    rooms: [], isLoading: true, hasError: false,
  });
  const presenter = useRef(new HotelDetailPresenter(hotelService, roomRepo, setVm));

  useEffect(() => {
    if (hotelId) presenter.current.loadHotel(hotelId);
  }, [hotelId]);

  const onRoomSelect = useCallback((roomId: string) => presenter.current.onRoomSelect(roomId), []);
  return { vm, onRoomSelect };
}

// ─── useBooking ───────────────────────────────────────────────────────────────

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
    currentStep: 1,
    isSubmitting: false, canSubmit: false, hasError: false,
  });

  const presenter = useRef(
    new BookingPresenter(bookingService, setVm, (id) => navigate(ROUTES.BOOKING_CONFIRMATION(id)))
  );

  useEffect(() => {
    if (bookingCtx.room && bookingCtx.checkIn && bookingCtx.checkOut) {
      presenter.current.init(
        bookingCtx.hotelName!,
        bookingCtx.room,
        bookingCtx.checkIn,
        bookingCtx.checkOut,
        bookingCtx.guestCount
      );
    }
  }, []);

  const onGuestInfo = useCallback((info: any) => presenter.current.onGuestInfoChange(info), []);
  const onNext = useCallback(() => presenter.current.onNextStep(), []);
  const onPrev = useCallback(() => presenter.current.onPreviousStep(), []);
  const onSubmit = useCallback(() => presenter.current.onSubmit(userId ?? "u1"), [userId]);

  return { vm, onGuestInfo, onNext, onPrev, onSubmit };
}

// ─── useBookingConfirmation ───────────────────────────────────────────────────

export function useBookingConfirmation(bookingId: string) {
  const [vm, setVm] = useState<BookingConfirmationViewModel>({
    bookingId: "", bookingRef: "", hotelName: "", roomName: "",
    checkIn: "", checkOut: "", nights: "", guests: "",
    totalPrice: "", status: "", statusColor: "", guestName: "",
    guestEmail: "", canCancel: false, isLoading: true, hasError: false,
  });
  const presenter = useRef(new BookingConfirmationPresenter(bookingService, setVm));

  useEffect(() => {
    if (bookingId) presenter.current.loadConfirmation(bookingId);
  }, [bookingId]);

  const onCancel = useCallback(() => presenter.current.onCancel(bookingId), [bookingId]);
  return { vm, onCancel };
}

// ─── useMyBookings ────────────────────────────────────────────────────────────

export function useMyBookings() {
  const [vm, setVm] = useState<MyBookingsViewModel>({
    bookings: [], isLoading: true, hasError: false, isEmpty: false,
  });
  const { userId } = useAuthStore();
  const presenter = useRef(new MyBookingsPresenter(bookingService, setVm));

  useEffect(() => {
    presenter.current.loadBookings(userId ?? "u1");
  }, [userId]);

  return { vm };
}

// ─── useAuth ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [vm, setVm] = useState<AuthViewModel>({ isAuthenticated: false, isLoading: false, hasError: false });
  const presenter = useRef(new AuthPresenter(authService, (newVm) => {
    setVm(newVm);
    if (newVm.isAuthenticated) setAuth("u1");
    else clearAuth();
  }));

  useEffect(() => { presenter.current.init(); }, []);

  const onLogin = useCallback(async (credentials: any) => {
    await presenter.current.onLogin(credentials);
    navigate(ROUTES.HOME);
  }, [navigate]);

  const onRegister = useCallback(async (payload: any) => {
    await presenter.current.onRegister(payload);
    navigate(ROUTES.HOME);
  }, [navigate]);

  const onLogout = useCallback(() => {
    presenter.current.onLogout();
    navigate(ROUTES.HOME);
  }, [navigate]);

  return { vm, onLogin, onRegister, onLogout };
}
