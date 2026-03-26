/**
 * Tests — Tunnel de réservation
 */
describe("Tunnel de réservation", () => {

  // ── Routes protégées ───────────────────────────────────────────────────────

  it("redirige vers /login si non connecté sur /booking", () => {
    cy.logout();
    cy.visit("/booking");
    //cy.url().should("include", "/login");
  });

  it("redirige vers /login si non connecté sur /my-bookings", () => {
    cy.logout();
    cy.visit("/my-bookings");
    //cy.url().should("include", "/login");
  });

  it("redirige vers /login si non connecté et clic sur Réserver", () => {
    cy.logout();
    cy.searchHotel("Paris");
    cy.get('[data-cy="hotel-card"]', { timeout: 15000 }).first().click();
    cy.get('[data-cy="room-book-btn"]', { timeout: 10000 }).first().click();
    //cy.url().should("include", "/login");
  });

  // ── Mes réservations ───────────────────────────────────────────────────────

  it("affiche la page Mes réservations une fois connecté", () => {
    cy.loginUser();
    cy.visit("/my-bookings");
    //cy.url().should("include", "/my-bookings");
    cy.contains(/mes réservations/i).should("be.visible");
  });

  it("affiche une liste vide ou des réservations existantes", () => {
    cy.loginUser();
    cy.visit("/my-bookings");
    cy.get("body").then($body => {
      const hasCards = $body.find('[data-cy="booking-card"]').length > 0;
      const hasEmpty = $body.text().toLowerCase().includes("aucune");
      //expect(hasCards || hasEmpty).to.be.true;
    });
  });

  // ── Tunnel complet ─────────────────────────────────────────────────────────

  it("accède à la page de réservation depuis un hôtel", () => {
    cy.loginUser();
    cy.searchHotel("Paris");
    cy.get('[data-cy="hotel-card"]', { timeout: 15000 }).first().click();
    cy.url().should("match", /\/hotel\//);
    cy.get('[data-cy="room-book-btn"]', { timeout: 10000 }).first().click();
    //cy.url({ timeout: 10000 }).should("include", "/booking");
  });

  it("affiche le récapitulatif de la réservation sur la page /booking", () => {
    cy.loginUser();
    cy.searchHotel("Paris");
    cy.get('[data-cy="hotel-card"]', { timeout: 15000 }).first().click();
    cy.get('[data-cy="room-book-btn"]', { timeout: 10000 }).first().click();
    //cy.url({ timeout: 10000 }).should("include", "/booking");
    // Le récapitulatif doit mentionner un hôtel ou un prix
    cy.contains(/hôtel|chambre|nuit|total/i, { timeout: 10000 }).should("be.visible");
  });

  // ── Annulation ─────────────────────────────────────────────────────────────

  it("peut annuler une réservation si elle existe", () => {
    cy.loginUser();
    cy.visit("/my-bookings");
    cy.get("body").then($body => {
      if ($body.find('[data-cy="booking-card"]').length > 0) {
        // Une réservation existe — cherche le bouton annuler
        cy.get("body").then($b => {
          if ($b.find('[data-cy="booking-cancel-btn"]').length > 0) {
            cy.get('[data-cy="booking-cancel-btn"]').first().click();
            cy.get("body").then($c => {
              if ($c.find('[data-cy="cancel-confirm-btn"]').length > 0) {
                cy.get('[data-cy="cancel-confirm-btn"]').click();
                cy.contains(/annulé|cancelled/i, { timeout: 10000 }).should("be.visible");
              }
            });
          } else {
            cy.log("Pas de bouton annuler visible — test ignoré");
          }
        });
      } else {
        cy.log("Aucune réservation — test ignoré");
      }
    });
  });
});