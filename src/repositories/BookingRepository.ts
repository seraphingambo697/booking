/**
 * src/repositories/BookingRepository.ts
 *
 * Implémentation concrète de IBookingRepository.
 *
 * En mock : utilise un tableau en mémoire (bookings[])
 * Les réservations créées persistent pendant la session du navigateur.
 *
 * En production : utiliserait bookingApi.ts + transformation ApiBooking → Booking
 */

import { Booking } from "@/core/entities/Booking";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { IBookingRepository, CreateBookingPayload } from "@/interfaces/repositories/IBookingRepository";

/** Données initiales de test */
const INITIAL_BOOKINGS: Booking[] = [
    {
        id: "b1", userId: "u1", hotelId: "h1", roomId: "r1",
        hotelName: "Le Grand Palais", roomName: "Chambre Classique",
        checkIn: new Date("2025-06-15"), checkOut: new Date("2025-06-18"),
        guestCount: 2, status: BookingStatus.CONFIRMED,
        totalPrice: 1155, currency: "EUR",
        guestInfo: {
            firstName: "Marie", lastName: "Dupont",
            email: "demo@luxstay.fr", phone: "+33 6 12 34 56 78",
        },
        createdAt: new Date("2025-05-01"),
    },
    {
        id: "b2", userId: "u1", hotelId: "h2", roomId: "r4",
        hotelName: "Hôtel Riviera Nice", roomName: "Chambre Vue Mer",
        checkIn: new Date("2025-08-01"), checkOut: new Date("2025-08-07"),
        guestCount: 2, status: BookingStatus.PENDING,
        totalPrice: 1386, currency: "EUR",
        guestInfo: {
            firstName: "Marie", lastName: "Dupont",
            email: "demo@luxstay.fr", phone: "+33 6 12 34 56 78",
        },
        createdAt: new Date("2025-05-10"),
    },
];

/**
 * Store en mémoire — simule une base de données.
 * Initialisé avec des données de test.
 */
const bookingStore: Booking[] = [...INITIAL_BOOKINGS];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class BookingRepository implements IBookingRepository {
    async create(payload: CreateBookingPayload): Promise<Booking> {
        await delay(800); // Simule un appel API de création

        const newBooking: Booking = {
            id: `b${Date.now()}`, // ID unique basé sur le timestamp
            ...payload,
            status: BookingStatus.CONFIRMED, // Confirmée directement en mock
            createdAt: new Date(),
            hotelName: "",
            roomName: "",
            totalPrice: 0,
            currency: ""
        };

        bookingStore.push(newBooking);
        return newBooking;
    }

    async findByUserId(userId: string): Promise<Booking[]> {
        await delay(400);
        // Retourne les réservations de l'utilisateur, les plus récentes en premier
        return bookingStore
            .filter((b) => b.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findById(id: string): Promise<Booking | null> {
        await delay(200);
        return bookingStore.find((b) => b.id === id) ?? null;
    }

    async cancel(id: string): Promise<Booking> {
        await delay(500);
        const booking = bookingStore.find((b) => b.id === id);
        if (!booking) throw new Error("Réservation introuvable");
        // Mutation directe (en mock) — en production : appel API PATCH
        booking.status = BookingStatus.CANCELLED;
        return booking;
    }
}