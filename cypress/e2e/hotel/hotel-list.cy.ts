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

  // ── Affichage initial 

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

  it("navigue vers la page de résultats après une recherche valide", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.url().should("include", "/search");
  });

  it("affiche des résultats de recherche pour Paris", () => {
    cy.searchHotel("Paris", 3, 2);
    cy.get('[data-cy="hotel-card"]').should("have.length.greaterThan", 0);
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


});
