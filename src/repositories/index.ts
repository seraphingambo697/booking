import { Hotel } from "@/core/entities/Hotel";
import { Room } from "@/core/entities/Room";
import { Booking } from "@/core/entities/Booking";
import { BookingStatus } from "@/core/enums";
import {
  IHotelRepository,
  IRoomRepository,
  IBookingRepository,
  SearchParams,
  CreateBookingPayload,
} from "@/interfaces";
import { MOCK_HOTELS, MOCK_ROOMS, MOCK_BOOKINGS } from "@/api/mockData";
import { generateBookingRef } from "@/lib/utils";

// ─── Hotel Repository ─────────────────────────────────────────────────────────

export class HotelRepository implements IHotelRepository {
  async findAll(params: SearchParams): Promise<Hotel[]> {
    await delay(600);
    return MOCK_HOTELS.filter((h) =>
      params.city ? h.city.toLowerCase().includes(params.city.toLowerCase()) : true
    );
  }

  async findById(id: string): Promise<Hotel | null> {
    await delay(300);
    return MOCK_HOTELS.find((h) => h.id === id) ?? null;
  }
}

// ─── Room Repository ──────────────────────────────────────────────────────────

export class RoomRepository implements IRoomRepository {
  async findByHotelId(hotelId: string): Promise<Room[]> {
    await delay(300);
    return MOCK_ROOMS.filter((r) => r.hotelId === hotelId);
  }

  async findById(id: string): Promise<Room | null> {
    await delay(200);
    return MOCK_ROOMS.find((r) => r.id === id) ?? null;
  }

  async checkAvailability(roomId: string): Promise<boolean> {
    await delay(200);
    const room = MOCK_ROOMS.find((r) => r.id === roomId);
    return room?.isAvailable ?? false;
  }
}

// ─── Booking Repository ───────────────────────────────────────────────────────

const bookings: Booking[] = [...MOCK_BOOKINGS];

export class BookingRepository implements IBookingRepository {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    await delay(800);
    const booking: Booking = {
      id: `b${Date.now()}`,
      ...payload,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date(),
    };
    bookings.push(booking);
    return booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    await delay(400);
    return bookings.filter((b) => b.userId === userId);
  }

  async findById(id: string): Promise<Booking | null> {
    await delay(200);
    return bookings.find((b) => b.id === id) ?? null;
  }

  async cancel(id: string): Promise<Booking> {
    await delay(500);
    const booking = bookings.find((b) => b.id === id);
    if (!booking) throw new Error("Réservation introuvable");
    booking.status = BookingStatus.CANCELLED;
    return booking;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
