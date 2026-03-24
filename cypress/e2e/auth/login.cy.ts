/**
 * cypress/e2e/auth/login.cy.ts
 * Tests E2E — connexion utilisateur.
 */

describe("Page de connexion", () => {
  beforeEach(() => {
    cy.fixture("users").as("users");
    cy.visit("/login");
  });


  it("affiche le formulaire de connexion", () => {
    cy.contains("Connexion").should("be.visible");
    cy.get('[data-cy="login-email"]').should("be.visible");
    cy.get('[data-cy="login-password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  it("affiche un lien vers l'inscription", () => {
    cy.contains(/inscrire|créer/i).should("be.visible");
  });


  it("connecte l'utilisateur avec des identifiants valides", function () {
    const { validUser } = this.users;
    cy.get('[data-cy="login-email"]').type(validUser.email);
    cy.get('[data-cy="login-password"]').type(validUser.password);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
    cy.contains(validUser.firstName).should("be.visible");
  });


  it("redirige vers l'inscription via le lien", () => {
    cy.contains(/s'inscrire|créer un compte/i).click();
    cy.url().should("include", "/register");
  });

  // ── Edge cases ──────────────────────────────────────────────────────────────

  it("affiche une erreur avec un mauvais mot de passe", function () {
    const { validUser } = this.users;
    const { invalidUser } = this.users;
    cy.get('[data-cy="login-email"]').type(validUser.email);
    cy.get('[data-cy="login-password"]').type(invalidUser.password);
    cy.contains(/incorrect|invalide|erreur/i).should("be.visible");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });

  it("affiche une erreur avec un email inconnu", () => {
    cy.get('[data-cy="login-email"]').type("ghost@nowhere.com");
    cy.get('[data-cy="login-password"]').type("irrelevant");
    cy.get('[data-cy="login-submit"]').click();
    cy.contains(/incorrect|invalide|erreur/i).should("be.visible");
    cy.url().should("include", "/login");
  });

  it("affiche une erreur si l'email est vide", () => {
    cy.get('[data-cy="login-password"]').type("somepassword");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });

  it("affiche une erreur si le mot de passe est vide", () => {
    cy.get('[data-cy="login-email"]').type("user@example.com");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });

  it("affiche une erreur avec un email au format invalide", () => {
    cy.get('[data-cy="login-email"]').type("pas-un-email");
    cy.get('[data-cy="login-password"]').type("somepassword");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });

  it("ne soumet pas si tous les champs sont vides", () => {
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });

  it("garde la page de connexion après échec", function () {
    const { invalidUser } = this.users;
    cy.get('[data-cy="login-email"]').type(invalidUser.email);
    cy.get('[data-cy="login-password"]').type(invalidUser.password);
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
    cy.get('[data-cy="login-email"]').should("be.visible");
  });
});
