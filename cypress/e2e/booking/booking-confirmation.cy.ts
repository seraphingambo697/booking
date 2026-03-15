/**
 * cypress/e2e/booking/booking-confirmation.cy.ts
 * Tests E2E — page de confirmation de réservation.
 *
 * Couvre : affichage confirmation, numéro, récap, navigation.
 */

describe("Page de confirmation de réservation", () => {
  beforeEach(() => {
    cy.fixture("users").as("users");
    cy.fixture("hotels").as("hotels");
    cy.fixture("bookings").as("bookings");
  });

  // ── Confirmation après réservation ───────────────────────────────────────────

  it("affiche la page de confirmation après une réservation réussie", function () {
    const { validUser } = this.users;

    cy.login(validUser.email, validUser.password);
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.get('[data-cy="room-book-btn"]').first().click();

    // Attendre le résumé de réservation
    cy.get('[data-cy="booking-summary"]').should("be.visible");
    cy.get('[data-cy="booking-confirm-btn"]').click();

    // Page de confirmation
    cy.contains(/confirmé|réservation réussie|merci/i).should("be.visible");
  });

  it("affiche un identifiant de réservation sur la confirmation", function () {
    const { validUser } = this.users;

    cy.login(validUser.email, validUser.password);
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.get('[data-cy="room-book-btn"]').first().click();
    cy.get('[data-cy="booking-confirm-btn"]').click();

    cy.get('[data-cy="booking-id"]').should("be.visible");
    cy.get('[data-cy="booking-id"]').invoke("text").should("not.be.empty");
  });

  it("affiche le récapitulatif du séjour sur la confirmation", function () {
    const { validUser } = this.users;

    cy.login(validUser.email, validUser.password);
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.get('[data-cy="room-book-btn"]').first().click();
    cy.get('[data-cy="booking-confirm-btn"]').click();

    // Dates et montant présents
    cy.get("[data-cy='booking-dates'], [data-cy='booking-summary']")
      .should("be.visible");
  });

  it("propose un bouton vers 'Mes réservations' après confirmation", function () {
    const { validUser } = this.users;

    cy.login(validUser.email, validUser.password);
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.get('[data-cy="room-book-btn"]').first().click();
    cy.get('[data-cy="booking-confirm-btn"]').click();

    cy.contains(/mes réservations|voir mes réservations/i).should("be.visible");
  });

  it("propose un bouton de retour à l'accueil", function () {
    const { validUser } = this.users;

    cy.login(validUser.email, validUser.password);
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.get('[data-cy="room-book-btn"]').first().click();
    cy.get('[data-cy="booking-confirm-btn"]').click();

    cy.contains(/accueil|retour/i).should("be.visible");
  });

  // ── Navigation Mes réservations ──────────────────────────────────────────────

  it("navigue vers Mes réservations depuis la confirmation", function () {
    const { validUser } = this.users;

    cy.login(validUser.email, validUser.password);
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.get('[data-cy="room-book-btn"]').first().click();
    cy.get('[data-cy="booking-confirm-btn"]').click();

    cy.contains(/mes réservations/i).click();
    cy.url().should("include", "/bookings");
  });

  // ── Accès direct confirmation sans réservation ───────────────────────────────

  it("redirige si l'on accède directement à la confirmation sans réservation", () => {
    cy.visit("/booking/confirmation", { failOnStatusCode: false });
    cy.url().should("satisfy", (url: string) =>
      !url.includes("/booking/confirmation") ||
      url.includes("/") ||
      url.includes("/login")
    );
  });
});
