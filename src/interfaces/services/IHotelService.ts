import { Booking } from "@/core/entities/Booking";
import { CreateBookingPayload } from "../repositories/IBookingRepository";

export interface PriceSummary {
    basePrice: number;
    nights: number;
    taxes: number;
    total: number;
    currency: string;
}

export interface IBookingService {
    create(payload: CreateBookingPayload): Promise<Booking>;
    getByUserId(userId: string): Promise<Booking[]>;
    getById(id: string): Promise<Booking | null>;
    cancel(id: string): Promise<Booking>;
    calculatePrice(pricePerNight: number, checkIn: Date, checkOut: Date): PriceSummary;
}