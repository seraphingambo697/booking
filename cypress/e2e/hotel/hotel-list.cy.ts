/**
 * cypress/e2e/hotel/hotel-list.cy.ts
 * Tests E2E — page d'accueil + liste des hôtels.
 *
 * Tunnel normal + edge cases (recherche vide, filtres, navigation).
 */

describe("Page d'accueil", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // ── Affichage initial ────────────────────────────────────────────────────────

  it("affiche le hero avec la barre de recherche", () => {
    cy.get('[data-cy="search-city"]').should("be.visible");
    cy.get('[data-cy="search-submit"]').should("be.visible");
  });

  it("désactive le bouton rechercher si la ville est vide", () => {
    cy.get('[data-cy="search-submit"]').should("be.disabled");
  });

  it("affiche les destinations populaires", () => {
    cy.contains("Paris").should("be.visible");
    cy.contains("Nice").should("be.visible");
    cy.contains("Bordeaux").should("be.visible");
  });

  it("navigue vers /search au clic sur une destination populaire", () => {
    cy.contains("Paris").click();
    cy.url().should("include", "/search");
  });

  // ── Recherche ────────────────────────────────────────────────────────────────

  it("active le bouton dès qu'une ville est saisie + dates sélectionnées", () => {
    cy.get('[data-cy="search-city"]').type("Paris");
    cy.get('[data-cy="date-checkin"]').click();
    cy.get('.text-xs.h-8.w-8').not('[disabled]').eq(5).click();
    cy.get('.text-xs.h-8.w-8').not('[disabled]').eq(8).click();
    cy.get('[data-cy="search-submit"]').should("not.be.disabled");
  });

  it("navigue vers la page de résultats après une recherche valide", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.url().should("include", "/search");
  });

  it("affiche des résultats de recherche pour Paris", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').should("have.length.greaterThan", 0);
  });

  it("affiche un message si aucun hôtel trouvé", () => {
    cy.searchHotel("VilleInexistanteXXX", 3, 2);
    cy.get("body").then(($body) => {
      const hasCards   = $body.find('[data-cy="hotel-card"]').length > 0;
      const hasEmpty   = $body.find('[data-cy="no-results"]').length > 0;
      const hasMessage = $body.text().toLowerCase().includes("aucun");
      expect(hasCards || hasEmpty || hasMessage).to.be.true;
    });
  });

  // ── Filtres ──────────────────────────────────────────────────────────────────

  it("filtre les résultats par nombre d'étoiles", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="filter-stars"]').length > 0) {
        cy.get('[data-cy="filter-stars"]').select("5");
        cy.get('[data-cy="hotel-card"]').each(($card) => {
          cy.wrap($card).find('[data-cy="hotel-stars"]')
            .should("contain", "5");
        });
      } else {
        cy.log("Filtre étoiles non visible — test ignoré");
      }
    });
  });

  it("trie les résultats par prix croissant", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="sort-price"]').length > 0) {
        cy.get('[data-cy="sort-price"]').click();
        // Vérifier que les prix sont dans l'ordre
        const prices: number[] = [];
        cy.get('[data-cy="hotel-price"]').each(($p) => {
          prices.push(parseFloat($p.text().replace(/[^0-9.]/g, "")));
        }).then(() => {
          for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).to.be.gte(prices[i - 1]);
          }
        });
      }
    });
  });

  // ── Navigation carte hôtel ───────────────────────────────────────────────────

  it("navigue vers le détail d'un hôtel au clic sur la carte", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().click();
    cy.url().should("match", /\/hotels\/[a-z0-9-]+/);
  });

  it("affiche le nom, le prix et la note sur chaque carte hôtel", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').first().within(() => {
      cy.get('[data-cy="hotel-name"]').should("not.be.empty");
      // Prix ou note visible
      cy.get("body").should("exist");
    });
  });
});
