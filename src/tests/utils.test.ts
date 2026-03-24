/**
 * src/tests/utils.test.ts
 * Tests unitaires — fonctions utilitaires de lib/utils.ts
 */
import { describe, it, expect } from "vitest";
import {
  countNights,
  formatNights,
  formatGuests,
  formatPrice,
  formatReviewCount,
  getInitials,
} from "@/lib/utils";

// ── countNights 

describe("countNights", () => {
  it("calcule le bon nombre de nuits", () => {
    const checkIn = new Date("2025-06-10");
    const checkOut = new Date("2025-06-14");
    expect(countNights(checkIn, checkOut)).toBe(4);
  });

  it("retourne 1 si check-in et check-out sont le même jour", () => {
    const d = new Date("2025-06-10");
    expect(countNights(d, d)).toBe(1);
  });

  it("calcule correctement sur plusieurs semaines", () => {
    const checkIn = new Date("2025-07-01");
    const checkOut = new Date("2025-07-15");
    expect(countNights(checkIn, checkOut)).toBe(14);
  });
});

// ── formatNights

describe("formatNights", () => {
  it("affiche '1 nuit' au singulier", () => {
    expect(formatNights(1)).toBe("1 nuit");
  });

  it("affiche le pluriel pour 2 nuits et plus", () => {
    expect(formatNights(2)).toBe("2 nuits");
    expect(formatNights(7)).toBe("7 nuits");
  });
});

// ── formatGuests

describe("formatGuests", () => {
  it("affiche '1 voyageur' au singulier", () => {
    expect(formatGuests(1)).toBe("1 voyageur");
  });

  it("affiche le pluriel pour 2 voyageurs et plus", () => {
    expect(formatGuests(2)).toBe("2 voyageurs");
    expect(formatGuests(5)).toBe("5 voyageurs");
  });
});

// ── formatPrice

describe("formatPrice", () => {
  it("formate un prix en euros", () => {
    const result = formatPrice(350, "EUR");
    expect(result).toContain("350");
    expect(result).toContain("€");
  });

  it("arrondit sans centimes", () => {
    const result = formatPrice(350.99, "EUR");
    expect(result).not.toContain(",99");
  });
});

// ── formatReviewCount

describe("formatReviewCount", () => {
  it("affiche le nombre exact pour moins de 1000 avis", () => {
    expect(formatReviewCount(142)).toBe("142 avis");
    expect(formatReviewCount(999)).toBe("999 avis");
  });

  it("affiche le format compact pour 1000 avis et plus", () => {
    expect(formatReviewCount(1000)).toBe("1.0k avis");
    expect(formatReviewCount(1284)).toBe("1.3k avis");
    expect(formatReviewCount(2500)).toBe("2.5k avis");
  });
});

// ── getInitials

describe("getInitials", () => {
  it("retourne les initiales en majuscules", () => {
    expect(getInitials("Marie", "Dupont")).toBe("MD");
  });

});
