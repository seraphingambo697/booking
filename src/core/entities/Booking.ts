import { BookingStatus } from "../enums/BookingStatus";

export interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface Booking {
    id: string;
    userId: string;
    hotelId: string;
    roomId: string;
    hotelName: string;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
    status: BookingStatus;
    totalPrice: number;
    currency: string;
    guestInfo: GuestInfo;
    createdAt: Date;
}