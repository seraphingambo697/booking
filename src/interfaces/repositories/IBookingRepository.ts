import type { Booking, GuestInfo } from "@/core/entities/Booking";

export interface CreateBookingPayload {
    userId: string;
    roomId: string;
    hotelId: string;
    hotelName: string;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
    guestInfo: GuestInfo;
    totalPrice: number;
    currency: string;
}

export interface IBookingRepository {
    create(payload: CreateBookingPayload): Promise<Booking>;
    findByUserId(userId: string): Promise<Booking[]>;
    findById(id: string): Promise<Booking | null>;
    cancel(id: string): Promise<Booking>;
}




