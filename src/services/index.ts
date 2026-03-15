export { HotelService } from "./HotelService";
export { BookingService } from "./BookingService";
export { AuthService } from "./AuthService";

/*import { Hotel } from "@/core/entities/Hotel";
import { Booking } from "@/core/entities/Booking";
import { User } from "@/core/entities/User";
import {
  IHotelService,
  IBookingService,
  IAuthService,
  IHotelRepository,
  IRoomRepository,
  IBookingRepository,
  SearchParams,
  SortOption,
  HotelFilters,
  CreateBookingPayload,
  PriceSummary,
  LoginCredentials,
  RegisterPayload,
  AuthResult,
} from "@/interfaces";
import { countNights } from "@/lib/utils";


export class HotelService implements IHotelService {
  constructor(private hotelRepo: IHotelRepository) { }

  async search(params: SearchParams): Promise<Hotel[]> {
    const hotels = await this.hotelRepo.findAll(params);
    let filtered = hotels;
    if (params.minPrice) filtered = filtered.filter((h) => h.priceFrom >= params.minPrice!);
    if (params.maxPrice) filtered = filtered.filter((h) => h.priceFrom <= params.maxPrice!);
    if (params.stars?.length) filtered = filtered.filter((h) => params.stars!.includes(h.stars));
    return filtered;
  }

  async getById(id: string): Promise<Hotel | null> {
    return this.hotelRepo.findById(id);
  }

  sortHotels(hotels: Hotel[], sort: SortOption): Hotel[] {
    return [...hotels].sort((a, b) => {
      const map: Record<string, (h: Hotel) => number> = {
        price: (h) => h.priceFrom,
        rating: (h) => h.rating,
        stars: (h) => h.stars,
        reviewCount: (h) => h.reviewCount,
      };
      const getter = map[sort.field] ?? ((h) => h.priceFrom);
      const diff = getter(a) - getter(b);
      return sort.direction === "asc" ? diff : -diff;
    });
  }

  filterHotels(hotels: Hotel[], filters: HotelFilters): Hotel[] {
    return hotels.filter((h) => {
      if (filters.minPrice && h.priceFrom < filters.minPrice) return false;
      if (filters.maxPrice && h.priceFrom > filters.maxPrice) return false;
      if (filters.stars?.length && !filters.stars.includes(h.stars)) return false;
      if (filters.amenities?.length) {
        const hasAll = filters.amenities.every((a) => h.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });
  }
}

// ─── Booking Service ──────────────────────────────────────────────────────────

export class BookingService implements IBookingService {
  constructor(private bookingRepo: IBookingRepository) { }

  async create(payload: CreateBookingPayload): Promise<Booking> {
    return this.bookingRepo.create(payload);
  }

  async getByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepo.findByUserId(userId);
  }

  async getById(id: string): Promise<Booking | null> {
    return this.bookingRepo.findById(id);
  }

  async cancel(id: string): Promise<Booking> {
    return this.bookingRepo.cancel(id);
  }

  calculatePrice(pricePerNight: number, checkIn: Date, checkOut: Date): PriceSummary {
    const nights = countNights(checkIn, checkOut);
    const basePrice = pricePerNight * nights;
    const taxes = Math.round(basePrice * 0.1);
    return {
      basePrice,
      nights,
      taxes,
      total: basePrice + taxes,
      currency: "EUR",
    };
  }
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

const MOCK_USER: User = {
  id: "u1",
  firstName: "Marie",
  lastName: "Dupont",
  email: "demo@luxstay.fr",
  phone: "+33 6 12 34 56 78",
  pseudo: "MarieD",
  createdAt: new Date("2024-01-01"),
};

export class AuthService implements IAuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await delay(600);
    if (credentials.email !== "demo@luxstay.fr" || credentials.password !== "demo123") {
      throw new Error("Email ou mot de passe incorrect");
    }
    this.currentUser = MOCK_USER;
    this.token = "mock-jwt-token-" + Date.now();
    localStorage.setItem("auth_token", this.token);
    localStorage.setItem("auth_user", JSON.stringify(this.currentUser));
    return { user: this.currentUser, token: this.token };
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
    await delay(800);
    const user: User = {
      id: "u" + Date.now(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      pseudo: payload.pseudo,
      createdAt: new Date(),
    };
    this.currentUser = user;
    this.token = "mock-jwt-token-" + Date.now();
    localStorage.setItem("auth_token", this.token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    return { user, token: this.token };
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}*/