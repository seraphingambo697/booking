//import { IHotelService, IBookingService, IAuthService, SearchParams, SortOption, HotelFilters, LoginCredentials, RegisterPayload, CreateBookingPayload } from "@/interfaces";
/*import {
  HotelListViewModel, HotelCardViewModel, HotelDetailViewModel,
  RoomViewModel, SearchViewModel, BookingViewModel, BookingStepViewModel,
  BookingConfirmationViewModel, MyBookingsViewModel, BookingSummaryViewModel, AuthViewModel,
} from "@/viewmodels";*/
//import { IRoomRepository } from "@/interfaces";
//import { BookingStatus } from "@/core/enums";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { IRoomRepository } from "@/interfaces/repositories/IRoomRepository";
import { IAuthService, LoginCredentials, RegisterPayload } from "@/interfaces/services/IAuthService";
import { IBookingService } from "@/interfaces/services/IBookingService";
import { HotelFilters, IHotelService, SortOption } from "@/interfaces/services/IHotelService";
import {
  formatPrice, formatDate, formatNights, formatGuests,
  formatReviewCount, countNights, getInitials,
} from "@/lib/utils";
import { AuthViewModel } from "@/viewmodels/AuthViewModel";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";
import { BookingSummaryViewModel, MyBookingsViewModel } from "@/viewmodels/BookingSummaryViewModel";
import { BookingViewModel } from "@/viewmodels/BookingViewModel";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { HotelCardViewModel, HotelListViewModel } from "@/viewmodels/HotelListViewModel";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";


export class SearchPresenter {
  private vm: SearchViewModel = {
    city: "",
    checkIn: null,
    checkOut: null,
    guestCount: 2,
    isValid: false,
  };

  constructor(private onChange: (vm: SearchViewModel) => void) { }

  onCityChange(city: string) {
    this.update({ city, cityError: city ? undefined : "Veuillez entrer une ville" });
    this.validate();
  }

  onDateChange(checkIn: Date | null, checkOut: Date | null) {
    this.update({ checkIn, checkOut, dateError: undefined });
    this.validate();
  }

  onGuestCountChange(count: number) {
    this.update({ guestCount: Math.max(1, Math.min(10, count)) });
    this.validate();
  }

  private validate() {
    const isValid = !!this.vm.city && !!this.vm.checkIn && !!this.vm.checkOut;
    this.update({ isValid });
  }

  private update(partial: Partial<SearchViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel() { return this.vm; }
}


export class HotelListPresenter {
  private vm: HotelListViewModel = {
    hotels: [],
    isLoading: false,
    hasError: false,
    totalResults: "",
    isEmpty: false,
    currentSort: { field: "rating", direction: "desc" },
    activeFilters: {},
  };

  constructor(private hotelService: IHotelService, private onChange: (vm: HotelListViewModel) => void) { }

  async loadHotels(params: SearchParams) {
    this.update({ isLoading: true, hasError: false });
    try {
      const hotels = await this.hotelService.search(params);
      const sorted = this.hotelService.sortHotels(hotels, this.vm.currentSort as SortOption);
      this.update({
        isLoading: false,
        hotels: sorted.map(this.mapToCard),
        totalResults: `${sorted.length} hôtel${sorted.length > 1 ? "s" : ""} trouvé${sorted.length > 1 ? "s" : ""}`,
        isEmpty: sorted.length === 0,
      });
    } catch {
      this.update({ isLoading: false, hasError: true, errorMessage: "Impossible de charger les hôtels." });
    }
  }

  onSortChange(sort: SortOption) {
    this.update({ currentSort: sort });
  }

  onFilterChange(filters: HotelFilters) {
    this.update({ activeFilters: filters });
  }

  private mapToCard(h: any): HotelCardViewModel {
    return {
      id: h.id,
      name: h.name,
      city: h.city,
      country: h.country,
      pricePerNight: `${formatPrice(h.priceFrom, h.currency)}/nuit`,
      rating: h.rating,
      reviewCount: formatReviewCount(h.reviewCount),
      stars: h.stars,
      thumbnailUrl: h.images[0] ?? "",
      amenities: h.amenities.slice(0, 4),
      isAvailable: true,
      badge: h.rating >= 4.8 ? "Coup de cœur" : h.priceFrom < 200 ? "Bon plan" : undefined,
    };
  }

  private update(partial: Partial<HotelListViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel() { return this.vm; }
}


export class HotelDetailPresenter {
  private vm: HotelDetailViewModel = {
    id: "", name: "", description: "", address: "", city: "", country: "",
    stars: 0, rating: 0, reviewCount: "", images: [], amenities: [],
    rooms: [], isLoading: false, hasError: false,
  };

  constructor(
    private hotelService: IHotelService,
    private roomRepo: IRoomRepository,
    private onChange: (vm: HotelDetailViewModel) => void
  ) { }

  async loadHotel(id: string) {
    this.update({ isLoading: true, hasError: false });
    try {
      const [hotel, rooms] = await Promise.all([
        this.hotelService.getById(id),
        this.roomRepo.findByHotelId(id),
      ]);
      if (!hotel) throw new Error("Hôtel introuvable");
      this.update({
        isLoading: false,
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        stars: hotel.stars,
        rating: hotel.rating,
        reviewCount: formatReviewCount(hotel.reviewCount),
        images: hotel.images,
        amenities: hotel.amenities,
        rooms: rooms.map(this.mapRoom),
      });
    } catch (e: any) {
      this.update({ isLoading: false, hasError: true, errorMessage: e.message });
    }
  }

  onRoomSelect(roomId: string) {
    this.update({ selectedRoomId: roomId });
  }

  private mapRoom(r: any): RoomViewModel {
    return {
      id: r.id,
      name: r.name,
      type: r.type,
      hotelId: r.hotelId,
      description: r.description,
      pricePerNight: `${formatPrice(r.pricePerNight, r.currency)}/nuit`,
      priceRaw: r.pricePerNight,
      capacity: formatGuests(r.capacity),
      size: `${r.size} m²`,
      bedInfo: `${r.bedCount} ${r.bedType}`,
      amenities: r.amenities,
      images: r.images,
      isAvailable: r.isAvailable,
    };
  }

  private update(partial: Partial<HotelDetailViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel() { return this.vm; }
}

// ─── Booking Presenter ────────────────────────────────────────────────────────

export class BookingPresenter {
  private vm: BookingViewModel = {
    hotelName: "", roomName: "", roomType: "",
    checkIn: "", checkOut: "", nights: "", guests: "",
    pricePerNight: "", basePrice: "", taxes: "", totalPrice: "", currency: "EUR",
    steps: [
      { id: 1, label: "Informations", isCompleted: false, isActive: true },
      { id: 2, label: "Récapitulatif", isCompleted: false, isActive: false },
      { id: 3, label: "Confirmation", isCompleted: false, isActive: false },
    ],
    currentStep: 1,
    isSubmitting: false,
    canSubmit: false,
    hasError: false,
  };

  private guestInfo: any = null;
  private roomData: any = null;

  constructor(
    private bookingService: IBookingService,
    private onChange: (vm: BookingViewModel) => void,
    private onSuccess: (bookingId: string) => void
  ) { }

  init(hotelName: string, room: any, checkIn: Date, checkOut: Date, guestCount: number) {
    const price = this.bookingService.calculatePrice(room.priceRaw, checkIn, checkOut);
    this.roomData = { hotelName, room, checkIn, checkOut, guestCount };
    this.update({
      hotelName,
      roomName: room.name,
      roomType: room.type,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      nights: formatNights(price.nights),
      guests: formatGuests(guestCount),
      pricePerNight: formatPrice(room.priceRaw),
      basePrice: formatPrice(price.basePrice),
      taxes: formatPrice(price.taxes),
      totalPrice: formatPrice(price.total),
    });
  }

  onGuestInfoChange(info: any) {
    this.guestInfo = info;
    const isValid = !!(info.firstName && info.lastName && info.email && info.phone);
    this.update({ canSubmit: isValid });
  }

  onNextStep() {
    const next = Math.min(3, this.vm.currentStep + 1);
    const steps = this.vm.steps.map((s) => ({
      ...s,
      isCompleted: s.id < next,
      isActive: s.id === next,
    }));
    this.update({ currentStep: next, steps });
  }

  onPreviousStep() {
    const prev = Math.max(1, this.vm.currentStep - 1);
    const steps = this.vm.steps.map((s) => ({
      ...s,
      isCompleted: s.id < prev,
      isActive: s.id === prev,
    }));
    this.update({ currentStep: prev, steps });
  }

  async onSubmit(userId: string) {
    if (!this.guestInfo || !this.roomData) return;
    this.update({ isSubmitting: true, hasError: false });
    try {
      const { hotelName, room, checkIn, checkOut, guestCount } = this.roomData;
      const price = this.bookingService.calculatePrice(room.priceRaw, checkIn, checkOut);
      const booking = await this.bookingService.create({
        userId,
        hotelId: room.id.slice(0, 2),
        roomId: room.id,
        hotelName,
        roomName: room.name,
        checkIn,
        checkOut,
        guestCount,
        guestInfo: this.guestInfo,
        totalPrice: price.total,
        currency: "EUR",
      });
      this.update({ isSubmitting: false });
      this.onSuccess(booking.id);
    } catch (e: any) {
      this.update({ isSubmitting: false, hasError: true, errorMessage: e.message });
    }
  }

  private update(partial: Partial<BookingViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel() { return this.vm; }
}

// ─── Booking Confirmation Presenter ───────────────────────────────────────────

export class BookingConfirmationPresenter {
  private vm: BookingConfirmationViewModel = {
    bookingId: "", bookingRef: "", hotelName: "", roomName: "",
    checkIn: "", checkOut: "", nights: "", guests: "",
    totalPrice: "", status: "", statusColor: "", guestName: "",
    guestEmail: "", canCancel: false, isLoading: false, hasError: false,
  };

  constructor(
    private bookingService: IBookingService,
    private onChange: (vm: BookingConfirmationViewModel) => void
  ) { }

  async loadConfirmation(bookingId: string) {
    this.update({ isLoading: true });
    try {
      const booking = await this.bookingService.getById(bookingId);
      if (!booking) throw new Error("Réservation introuvable");
      const nights = countNights(booking.checkIn, booking.checkOut);
      const statusMap: Record<string, { label: string; color: string }> = {
        CONFIRMED: { label: "Confirmée", color: "text-green-600" },
        PENDING: { label: "En attente", color: "text-yellow-600" },
        CANCELLED: { label: "Annulée", color: "text-red-600" },
        COMPLETED: { label: "Terminée", color: "text-gray-600" },
      };
      const s = statusMap[booking.status] ?? { label: booking.status, color: "" };
      this.update({
        isLoading: false,
        bookingId: booking.id,
        bookingRef: `LX-${booking.id.toUpperCase()}`,
        hotelName: booking.hotelName,
        roomName: booking.roomName,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        nights: formatNights(nights),
        guests: formatGuests(booking.guestCount),
        totalPrice: formatPrice(booking.totalPrice, booking.currency),
        status: s.label,
        statusColor: s.color,
        guestName: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
        guestEmail: booking.guestInfo.email,
        canCancel: booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING,
      });
    } catch (e: any) {
      this.update({ isLoading: false, hasError: true, errorMessage: e.message });
    }
  }

  async onCancel(bookingId: string) {
    await this.bookingService.cancel(bookingId);
    this.update({ canCancel: false, status: "Annulée", statusColor: "text-red-600" });
  }

  private update(partial: Partial<BookingConfirmationViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel() { return this.vm; }
}

export class MyBookingsPresenter {
  private vm: MyBookingsViewModel = {
    bookings: [], isLoading: false, hasError: false, isEmpty: false,
  };

  constructor(private bookingService: IBookingService, private onChange: (vm: MyBookingsViewModel) => void) { }

  async loadBookings(userId: string) {
    this.update({ isLoading: true });
    try {
      const bookings = await this.bookingService.getByUserId(userId);
      const statusMap: Record<string, { label: string; color: BookingSummaryViewModel["statusColor"] }> = {
        CONFIRMED: { label: "Confirmée", color: "default" },
        PENDING: { label: "En attente", color: "secondary" },
        CANCELLED: { label: "Annulée", color: "destructive" },
        COMPLETED: { label: "Terminée", color: "outline" },
      };
      this.update({
        isLoading: false,
        isEmpty: bookings.length === 0,
        bookings: bookings.map((b) => {
          const nights = countNights(b.checkIn, b.checkOut);
          const s = statusMap[b.status] ?? { label: b.status, color: "outline" as const };
          return {
            id: b.id,
            bookingRef: `LX-${b.id.toUpperCase()}`,
            hotelName: b.hotelName,
            roomName: b.roomName,
            checkIn: formatDate(b.checkIn),
            checkOut: formatDate(b.checkOut),
            nights: formatNights(nights),
            totalPrice: formatPrice(b.totalPrice, b.currency),
            status: s.label,
            statusColor: s.color,
            canCancel: b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING,
          };
        }),
      });
    } catch {
      this.update({ isLoading: false, hasError: true, errorMessage: "Impossible de charger vos réservations." });
    }
  }

  private update(partial: Partial<MyBookingsViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }
}

// ─── Auth Presenter ───────────────────────────────────────────────────────────

export class AuthPresenter {
  private vm: AuthViewModel = { isAuthenticated: false, isLoading: false, hasError: false };

  constructor(private authService: IAuthService, private onChange: (vm: AuthViewModel) => void) { }

  init() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.update({
        isAuthenticated: true,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userInitials: getInitials(user.firstName, user.lastName),
        avatarUrl: user.avatarUrl,
      });
    }
  }

  async onLogin(credentials: LoginCredentials) {
    this.update({ isLoading: true, hasError: false });
    try {
      const { user } = await this.authService.login(credentials);
      this.update({
        isLoading: false, isAuthenticated: true,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userInitials: getInitials(user.firstName, user.lastName),
      });
    } catch (e: any) {
      this.update({ isLoading: false, hasError: true, errorMessage: e.message });
    }
  }

  async onRegister(payload: RegisterPayload) {
    this.update({ isLoading: true, hasError: false });
    try {
      const { user } = await this.authService.register(payload);
      this.update({
        isLoading: false, isAuthenticated: true,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userInitials: getInitials(user.firstName, user.lastName),
      });
    } catch (e: any) {
      this.update({ isLoading: false, hasError: true, errorMessage: e.message });
    }
  }

  onLogout() {
    this.authService.logout();
    this.update({ isAuthenticated: false, userName: undefined, userEmail: undefined, userInitials: undefined });
  }

  private update(partial: Partial<AuthViewModel>) {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel() { return this.vm; }
}
