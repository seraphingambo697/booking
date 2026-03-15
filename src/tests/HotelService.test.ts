/**
 * src/tests/HotelService.test.ts
 * Tests unitaires — HotelService (tri et filtres)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { HotelService } from "@/services/HotelService";
import { Hotel } from "@/core/entities/Hotel";
import { IHotelRepository } from "@/interfaces/repositories/IHotelRepository";

// ── Données de test ───────────────────────────────────────────────────────────

const makeHotel = (overrides: Partial<Hotel>): Hotel => ({
  id:          "h1",
  name:        "Hôtel Test",
  description: "",
  address:     "1 rue Test",
  city:        "Paris",
  country:     "France",
  latitude:    48.86,
  longitude:   2.35,
  stars:       4,
  rating:      4.5,
  reviewCount: 200,
  images:      [],
  amenities:   ["WiFi", "Piscine"],
  priceFrom:   200,
  currency:    "EUR",
  ...overrides,
});

const HOTELS: Hotel[] = [
  makeHotel({ id: "h1", name: "Alpes Lodge",    stars: 4, rating: 4.9, priceFrom: 280, reviewCount: 389, amenities: ["WiFi", "Spa"] }),
  makeHotel({ id: "h2", name: "Château Bordeaux", stars: 4, rating: 4.6, priceFrom: 220, reviewCount: 432, amenities: ["WiFi", "Piscine"] }),
  makeHotel({ id: "h3", name: "Grand Palais",   stars: 5, rating: 4.8, priceFrom: 350, reviewCount: 1284, amenities: ["WiFi", "Piscine", "Spa"] }),
  makeHotel({ id: "h4", name: "Marais Boutique", stars: 4, rating: 4.7, priceFrom: 195, reviewCount: 654, amenities: ["WiFi", "Bar"] }),
  makeHotel({ id: "h5", name: "Villa Provence",  stars: 5, rating: 4.7, priceFrom: 310, reviewCount: 298, amenities: ["WiFi", "Piscine"] }),
];

const mockRepo: IHotelRepository = {
  findAll:   vi.fn().mockResolvedValue(HOTELS),
  findById:  vi.fn().mockResolvedValue(HOTELS[0]),
};

// ── Tests tri ─────────────────────────────────────────────────────────────────

describe("HotelService.sortHotels", () => {
  let service: HotelService;

  beforeEach(() => {
    service = new HotelService(mockRepo);
  });

  it("trie par prix croissant", () => {
    const sorted = service.sortHotels(HOTELS, { field: "price", direction: "asc" });
    expect(sorted[0].priceFrom).toBe(195);
    expect(sorted[sorted.length - 1].priceFrom).toBe(350);
  });

  it("trie par prix décroissant", () => {
    const sorted = service.sortHotels(HOTELS, { field: "price", direction: "desc" });
    expect(sorted[0].priceFrom).toBe(350);
    expect(sorted[sorted.length - 1].priceFrom).toBe(195);
  });

  it("trie par note décroissante", () => {
    const sorted = service.sortHotels(HOTELS, { field: "rating", direction: "desc" });
    expect(sorted[0].rating).toBe(4.9);
  });

  it("trie par étoiles croissant", () => {
    const sorted = service.sortHotels(HOTELS, { field: "stars", direction: "asc" });
    expect(sorted[0].stars).toBeLessThanOrEqual(sorted[sorted.length - 1].stars);
  });

  it("trie par nombre d'avis décroissant", () => {
    const sorted = service.sortHotels(HOTELS, { field: "reviewCount", direction: "desc" });
    expect(sorted[0].reviewCount).toBe(1284);
  });

  it("ne mute pas le tableau original", () => {
    const original = [...HOTELS];
    service.sortHotels(HOTELS, { field: "price", direction: "asc" });
    expect(HOTELS[0].id).toBe(original[0].id);
  });
});

// ── Tests filtres ─────────────────────────────────────────────────────────────

describe("HotelService.filterHotels", () => {
  let service: HotelService;

  beforeEach(() => {
    service = new HotelService(mockRepo);
  });

  it("filtre par prix maximum", () => {
    const result = service.filterHotels(HOTELS, { maxPrice: 250 });
    expect(result.every(h => h.priceFrom <= 250)).toBe(true);
    expect(result.length).toBe(2); // 220 et 195
  });

  it("filtre par prix minimum", () => {
    const result = service.filterHotels(HOTELS, { minPrice: 300 });
    expect(result.every(h => h.priceFrom >= 300)).toBe(true);
    expect(result.length).toBe(2); // 350 et 310
  });

  it("filtre par fourchette de prix", () => {
    const result = service.filterHotels(HOTELS, { minPrice: 200, maxPrice: 300 });
    expect(result.every(h => h.priceFrom >= 200 && h.priceFrom <= 300)).toBe(true);
  });

  it("filtre par étoiles", () => {
    const result = service.filterHotels(HOTELS, { stars: [5] });
    expect(result.every(h => h.stars === 5)).toBe(true);
    expect(result.length).toBe(2);
  });

  it("filtre par plusieurs étoiles", () => {
    const result = service.filterHotels(HOTELS, { stars: [4, 5] });
    expect(result.length).toBe(HOTELS.length);
  });

  it("filtre par équipement — retourne seulement les hôtels qui ont le Spa", () => {
    const result = service.filterHotels(HOTELS, { amenities: ["Spa"] });
    expect(result.every(h => h.amenities.includes("Spa"))).toBe(true);
    expect(result.length).toBe(2); // Alpes Lodge + Grand Palais
  });

  it("filtre par plusieurs équipements (ET logique)", () => {
    const result = service.filterHotels(HOTELS, { amenities: ["WiFi", "Piscine", "Spa"] });
    expect(result.every(h =>
      h.amenities.includes("WiFi") &&
      h.amenities.includes("Piscine") &&
      h.amenities.includes("Spa")
    )).toBe(true);
    expect(result.length).toBe(1); // Seul Grand Palais a les 3
  });

  it("retourne tous les hôtels si aucun filtre", () => {
    const result = service.filterHotels(HOTELS, {});
    expect(result.length).toBe(HOTELS.length);
  });

  it("retourne un tableau vide si aucun hôtel ne correspond", () => {
    const result = service.filterHotels(HOTELS, { minPrice: 9999 });
    expect(result).toHaveLength(0);
  });

  it("ne mute pas le tableau original", () => {
    const len = HOTELS.length;
    service.filterHotels(HOTELS, { maxPrice: 100 });
    expect(HOTELS.length).toBe(len);
  });
});

// ── Tests délégation repository ───────────────────────────────────────────────

describe("HotelService — délégation repository", () => {
  let service: HotelService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new HotelService(mockRepo);
  });

  it("délègue la recherche au repository", async () => {
    const params = {
      city: "Paris",
      checkIn: new Date("2025-07-01"),
      checkOut: new Date("2025-07-04"),
      guestCount: 2,
    };
    await service.search(params);
    expect(mockRepo.findAll).toHaveBeenCalledWith(params);
  });

  it("délègue la recherche par ID au repository", async () => {
    await service.getById("h1");
    expect(mockRepo.findById).toHaveBeenCalledWith("h1");
  });
});
