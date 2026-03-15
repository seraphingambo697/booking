/**
 * cypress/e2e/hotel/hotel-detail.cy.ts
 * Tests E2E — page de détail d'un hôtel.
 *
 * Couvre : affichage, galerie, chambres, CTA, edge cases.
 */

describe("Page de détail hôtel", () => {
  beforeEach(() => {
    cy.fixture("hotels").as("hotels");
  });

  // ── Affichage ────────────────────────────────────────────────────────────────

  it("affiche les informations de l'hôtel", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.contains(this.hotels.validHotel.name).should("be.visible");
    cy.contains(this.hotels.validHotel.city).should("be.visible");
  });

  it("affiche les étoiles de l'hôtel", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="hotel-stars"], .hotel-stars').should("be.visible");
  });

  it("affiche la description de l'hôtel", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="hotel-description"]').should("be.visible");
  });

  it("affiche la galerie photos", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="hotel-gallery"], .hotel-gallery').should("be.visible");
  });

  it("affiche la liste des équipements", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="hotel-amenities"]').should("be.visible");
  });

  // ── Chambres ─────────────────────────────────────────────────────────────────

  it("affiche au moins une chambre disponible", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="room-card"]').should("have.length.greaterThan", 0);
  });

  it("affiche le prix par nuit sur chaque chambre", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="room-card"]').first().within(() => {
      cy.get('[data-cy="room-price"]').should("be.visible");
    });
  });

  it("affiche la capacité de la chambre", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="room-card"]').first().within(() => {
      cy.get('[data-cy="room-capacity"]').should("be.visible");
    });
  });

  // ── CTA Réservation ──────────────────────────────────────────────────────────

  it("affiche un bouton 'Réserver' pour chaque chambre", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="room-book-btn"]').should("have.length.greaterThan", 0);
  });

  it("redirige vers /login si l'utilisateur non connecté clique sur Réserver", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="room-book-btn"]').first().click();
    cy.url().should("include", "/login");
  });

  it("affiche le formulaire de réservation pour un utilisateur connecté", function () {
    cy.fixture("users").then((users) => {
      cy.login(users.validUser.email, users.validUser.password);
      cy.visit(`/hotels/${this.hotels.validHotel.id}`);
      cy.get('[data-cy="room-book-btn"]').first().click();
      cy.get('[data-cy="booking-summary"], [data-cy="booking-form"]')
        .should("be.visible");
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────────

  it("affiche un bouton retour vers la liste", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get('[data-cy="back-btn"], a').contains(/retour|précédent|←/i)
      .should("exist");
  });

  it("affiche une page 404 pour un hôtel inexistant", () => {
    cy.visit("/hotels/hotel-inexistant-xyz", { failOnStatusCode: false });
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      expect(
        text.includes("404") ||
        text.includes("introuvable") ||
        text.includes("not found")
      ).to.be.true;
    });
  });

  // ── Avis ─────────────────────────────────────────────────────────────────────

  it("affiche la section des avis", function () {
    cy.visit(`/hotels/${this.hotels.validHotel.id}`);
    cy.get("body").then(($body) => {
      const text = $body.text().toLowerCase();
      expect(
        text.includes("avis") ||
        text.includes("commentaire") ||
        text.includes("review")
      ).to.be.true;
    });
  });
});
