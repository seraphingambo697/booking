/**
 * Tests unitaires — BookingService (logique de calcul de prix)
 *
 * Le repository est mocké : teste  la logique métier du service.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingService } from "@/services/BookingService";
import { IBookingRepository } from "@/interfaces/repositories/IBookingRepository";
import { Booking } from "@/core/entities/Booking";
import { BookingStatus } from "@/core/enums/BookingStatus";


const mockBooking: Booking = {
  id: "b1",
  userId: "u1",
  hotelId: "h1",
  roomId: "r1",
  hotelName: "Hôtel Test",
  roomName: "Chambre Double",
  checkIn: new Date("2025-07-01"),
  checkOut: new Date("2025-07-04"),
  guestCount: 2,
  status: BookingStatus.CONFIRMED,
  totalPrice: 1155,
  currency: "EUR",
  guestInfo: { firstName: "Marie", lastName: "Dupont", email: "m@test.fr", phone: "0600000000" },
  createdAt: new Date(),
};

const mockRepo: IBookingRepository = {
  create: vi.fn().mockResolvedValue(mockBooking),
  findByUserId: vi.fn().mockResolvedValue([mockBooking]),
  findById: vi.fn().mockResolvedValue(mockBooking),
  cancel: vi.fn().mockResolvedValue({ ...mockBooking, status: BookingStatus.CANCELLED }),
};


describe("BookingService.calculatePrice", () => {
  let service: BookingService;

  beforeEach(() => {
    service = new BookingService(mockRepo);
  });

  it("calcule correctement pour 3 nuits à 350€", () => {
    const checkIn = new Date("2025-07-01");
    const checkOut = new Date("2025-07-04");
    const result = service.calculatePrice(350, checkIn, checkOut);

    expect(result.nights).toBe(3);
    expect(result.basePrice).toBe(1050);
    expect(result.taxes).toBe(105);
    expect(result.total).toBe(1155);
    expect(result.currency).toBe("EUR");
  });

  it("calcule pour 1 nuit", () => {
    const checkIn = new Date("2025-07-01");
    const checkOut = new Date("2025-07-02");
    const result = service.calculatePrice(200, checkIn, checkOut);

    expect(result.nights).toBe(1);
    expect(result.basePrice).toBe(200);
    expect(result.taxes).toBe(20);
    expect(result.total).toBe(220);
  });

  it("calcule pour 7 nuits", () => {
    const checkIn = new Date("2025-08-01");
    const checkOut = new Date("2025-08-08");
    const result = service.calculatePrice(100, checkIn, checkOut);

    expect(result.nights).toBe(7);
    expect(result.basePrice).toBe(700);
    expect(result.total).toBe(770);
  });

  it("arrondit les taxes au supérieur", () => {
    const checkIn = new Date("2025-07-01");
    const checkOut = new Date("2025-07-02");
    const result = service.calculatePrice(333, checkIn, checkOut);

    expect(result.taxes).toBe(34);
    expect(result.total).toBe(367);
  });

  it("garantit un minimum de 1 nuit même si les dates sont identiques", () => {
    const d = new Date("2025-07-01");
    const result = service.calculatePrice(200, d, d);

    expect(result.nights).toBeGreaterThanOrEqual(1);
  });
});


describe("BookingService — délégation repository", () => {
  let service: BookingService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BookingService(mockRepo);
  });

  it("crée une réservation via le repository", async () => {
    const payload = {
      userId: "u1", hotelId: "h1", roomId: "r1",
      hotelName: "Test", roomName: "Double",
      checkIn: new Date("2025-07-01"), checkOut: new Date("2025-07-04"),
      guestCount: 2,
      guestInfo: { firstName: "M", lastName: "D", email: "m@d.fr", phone: "06" },
      totalPrice: 1155, currency: "EUR",
    };
    const result = await service.create(payload);
    expect(mockRepo.create).toHaveBeenCalledWith(payload);
    expect(result.id).toBe("b1");
  });

  it("récupère les réservations d'un utilisateur", async () => {
    const bookings = await service.getByUserId("u1");
    expect(mockRepo.findByUserId).toHaveBeenCalledWith("u1");
    expect(bookings).toHaveLength(1);
  });

  it("récupère une réservation par ID", async () => {
    const booking = await service.getById("b1");
    expect(mockRepo.findById).toHaveBeenCalledWith("b1");
    expect(booking?.id).toBe("b1");
  });

  it("annule une réservation", async () => {
    const result = await service.cancel("b1");
    expect(mockRepo.cancel).toHaveBeenCalledWith("b1");
    expect(result.status).toBe(BookingStatus.CANCELLED);
  });
});
