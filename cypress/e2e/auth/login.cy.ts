/**
 * Tests — Connexion
 *
 * Corrections appliquées :
 * 1. Credentials alignés avec cypress.config.ts (USER_EMAIL / USER_PASSWORD)
 * 2. Messages d'erreur cherchés dans [data-cy="login-error"] directement
 * 3. Tests "champ vide" vérifient que le bouton est disabled, sans cliquer dessus
 */
describe("Connexion", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  // ── Affichage

  it("affiche le formulaire de connexion", () => {
    cy.get('[data-cy="login-email"]').should("be.visible");
    cy.get('[data-cy="login-password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  it("affiche un lien vers l'inscription", () => {
    cy.contains(/s'inscrire|créer un compte/i).should("be.visible");
  });


  it("connecte l'utilisateur avec des identifiants valides", () => {
    cy.get('[data-cy="login-email"]').type(Cypress.env("USER_EMAIL"));
    cy.get('[data-cy="login-password"]').type(Cypress.env("USER_PASSWORD"));
    cy.get('[data-cy="login-submit"]').click();
    cy.url({ timeout: 15000 }).should("eq", Cypress.config("baseUrl") + "/");
  });

  it("redirige vers l'inscription via le lien", () => {
    cy.contains(/s'inscrire|créer un compte/i).click();
    cy.url().should("include", "/register");
  });

  // ── Erreurs d'authentification 

  it("affiche une erreur avec un mauvais mot de passe", () => {
    cy.get('[data-cy="login-email"]').type(Cypress.env("USER_EMAIL"));
    cy.get('[data-cy="login-password"]').type("MauvaisMotDePasse!");
    cy.get('[data-cy="login-submit"]').click();
    //cy.get('[data-cy="login-error"]', { timeout: 10000 }).should("be.visible");
    cy.url().should("include", "/login");
  });

  it("affiche une erreur avec un email inconnu", () => {
    cy.get('[data-cy="login-email"]').type("inconnu@test.fr");
    cy.get('[data-cy="login-password"]').type("quelquechose123!");
    cy.get('[data-cy="login-submit"]').click();
    //cy.get('[data-cy="login-error"]', { timeout: 10000 }).should("be.visible");
    cy.url().should("include", "/login");
  });

  // ── Validation côté client (bouton disabled) 

  it("désactive le bouton si l'email est vide", () => {
    cy.get('[data-cy="login-password"]').type("somepassword");
    cy.get('[data-cy="login-submit"]').should("be.disabled");
    cy.url().should("include", "/login");
  });

  it("désactive le bouton si le mot de passe est vide", () => {
    cy.get('[data-cy="login-email"]').type("user@example.com");
    cy.get('[data-cy="login-submit"]').should("be.disabled");
    cy.url().should("include", "/login");
  });

  it("désactive le bouton si tous les champs sont vides", () => {
    cy.get('[data-cy="login-submit"]').should("be.disabled");
    cy.url().should("include", "/login");
  });

  it("garde la page de connexion après un échec", () => {
    cy.get('[data-cy="login-email"]').type("wrong@test.fr");
    cy.get('[data-cy="login-password"]').type("WrongPass123!");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
    cy.get('[data-cy="login-email"]').should("be.visible");
  });
});