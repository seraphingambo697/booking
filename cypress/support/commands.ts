/**
 * cypress/support/commands.ts
 * Commandes Cypress personnalisées.
 *
 * Les commandes custom évitent de répéter des séquences d'actions dans les tests.
 * Utilisation : cy.login("email", "password") au lieu de répéter les 5 étapes.
 *
 * TypeScript : les types sont déclarés dans cypress/support/index.d.ts
 */

// ── cy.login() ────────────────────────────────────────────────────────────────
/**
 * Connecte un utilisateur via l'interface de connexion.
 *
 * @param email     Email du compte (ex: "demo@luxstay.fr")
 * @param password  Mot de passe (ex: "demo123")
 *
 * @example
 * cy.login("demo@luxstay.fr", "demo123")
 */
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('[data-cy="login-email"]').type(email);
  cy.get('[data-cy="login-password"]').type(password);
  cy.get('[data-cy="login-submit"]').click();
  /* Attend la redirection vers l'accueil */
  cy.url().should("eq", Cypress.config("baseUrl") + "/");
});

// ── cy.searchHotel() ──────────────────────────────────────────────────────────
/**
 * Effectue une recherche d'hôtel depuis la page d'accueil.
 *
 * @param city       Ville de destination
 * @param nights     Nombre de nuits (défaut: 3)
 * @param guestCount Nombre de voyageurs (défaut: 2)
 *
 * @example
 * cy.searchHotel("Paris", 2, 2)
 */
Cypress.Commands.add("searchHotel", (city: string, nights: number = 3, guestCount: number = 2) => {
  cy.visit("/");
  cy.get('[data-cy="search-city"]').type(city);

  /* Sélectionne les dates (arrivée = dans 7 jours, départ = dans 7+nights jours) */
  cy.get('[data-cy="date-checkin"]').click();
  /* On clique sur des jours futurs dans le calendrier */
  cy.get('.text-xs.h-8.w-8').not('[disabled]').eq(7).click();
  cy.get('.text-xs.h-8.w-8').not('[disabled]').eq(7 + nights).click();

  /* Vérifie que le bouton de recherche est actif */
  cy.get('[data-cy="search-submit"]').should("not.be.disabled");
  cy.get('[data-cy="search-submit"]').click();

  /* Attend les résultats */
  cy.url().should("include", "/search");
});

// ── Déclaration TypeScript des types des commandes custom ────────────────────
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      searchHotel(city: string, nights?: number, guestCount?: number): Chainable<void>;
    }
  }
}
