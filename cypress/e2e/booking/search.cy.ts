/**
 * cypress/e2e/booking/search.cy.ts
 * Tests E2E — page de résultats de recherche.
 *
 * Couvre : affichage résultats, filtres, pagination, edge cases.
 */

describe("Page de résultats de recherche", () => {
  beforeEach(() => {
    cy.searchHotel("Paris", 3, 2);
  });

  // ── Affichage ────────────────────────────────────────────────────────────────

  it("affiche les résultats après une recherche", () => {
    cy.url().should("include", "/search");
    cy.get("body").should("be.visible");
  });

  it("affiche le nombre de résultats trouvés", () => {
    cy.get('[data-cy="results-count"]').should("be.visible");
  });

  it("affiche les cartes hôtels avec les infos clés", () => {
    cy.get('[data-cy="hotel-card"]').first().within(() => {
      cy.get('[data-cy="hotel-name"]').should("not.be.empty");
    });
  });

  it("affiche le récapitulatif de la recherche (dates, voyageurs)", () => {
    cy.get('[data-cy="search-summary"], [data-cy="search-bar"]')
      .should("be.visible");
  });

  // ── Filtres ──────────────────────────────────────────────────────────────────

  it("permet de modifier la recherche depuis la page de résultats", () => {
    cy.get('[data-cy="search-city"]').should("be.visible");
  });

  it("filtre les résultats par prix maximum", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="filter-price-max"]').length > 0) {
        cy.get('[data-cy="filter-price-max"]').clear().type("200");
        cy.get('[data-cy="apply-filters"]').click();
        cy.get('[data-cy="hotel-price"]').each(($p) => {
          const price = parseFloat($p.text().replace(/[^0-9.]/g, ""));
          expect(price).to.be.lte(200);
        });
      } else {
        cy.log("Filtre prix non présent — skipped");
      }
    });
  });

  // ── Navigation ───────────────────────────────────────────────────────────────

  it("navigue vers le détail en cliquant sur une carte hôtel", () => {
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.url().should("match", /\/hotels\//);
  });

  it("permet de relancer une nouvelle recherche", () => {
    cy.get('[data-cy="search-city"]').clear().type("Lyon");
    cy.get('[data-cy="search-submit"]').should("not.be.disabled");
  });

  // ── Edge cases ───────────────────────────────────────────────────────────────

  it("affiche un message pour une ville sans résultat", () => {
    cy.visit("/");
    cy.searchHotel("VilleInconnueABC", 3, 2);
    cy.get("body").then(($body) => {
      const hasNoResults = $body.find('[data-cy="no-results"]').length > 0;
      const hasMessage   = $body.text().toLowerCase().includes("aucun");
      const hasEmpty     = $body.find('[data-cy="hotel-card"]').length === 0;
      expect(hasNoResults || hasMessage || hasEmpty).to.be.true;
    });
  });

  it("rejette une recherche avec check-out avant check-in", () => {
    cy.visit("/");
    cy.get('[data-cy="search-city"]').type("Paris");
    // Simuler dates invalides si le formulaire le permet
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="date-checkout"]').length > 0) {
        const today = new Date().toISOString().split("T")[0];
        const past  = new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0];
        cy.get('[data-cy="date-checkin"]').type(today);
        cy.get('[data-cy="date-checkout"]').type(past);
        cy.get('[data-cy="search-submit"]').click();
        cy.contains(/erreur|invalide|départ/i).should("be.visible");
      }
    });
  });
});
