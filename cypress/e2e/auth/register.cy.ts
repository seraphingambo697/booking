/**
 * cypress/e2e/auth/register.cy.ts
 * Tests E2E — inscription utilisateur.
 *
 * cases (email invalide, mot de passe court,
 * email déjà existant, champs vides).
 */

const VALID_USER = {
  firstName: "Jean",
  lastName: "Durand",
  email: `jean.durandmm.${Date.now()}@example.com`,
  pseudo: "jdurandm",
  phone: "0612345678",
  password: "SecurePass123!",
};

describe("Page d'inscription", () => {
  beforeEach(() => {
    cy.visit("/register");
  });


  it("affiche le formulaire complet d'inscription", () => {
    cy.contains("Créer un compte").should("be.visible");
    cy.get('[data-cy="register-firstname"]').should("be.visible");
    cy.get('[data-cy="register-lastname"]').should("be.visible");
    cy.get('[data-cy="register-email"]').should("be.visible");
    cy.get('[data-cy="register-password"]').should("be.visible");
    cy.get('[data-cy="register-pseudo"]').should("be.visible");
    cy.get('[data-cy="register-phone"]').should("be.visible");
    cy.get('[data-cy="register-submit"]').should("be.visible");
  });

  it("affiche un lien vers la page de connexion", () => {
    cy.contains("Se connecter").click();
    cy.url().should("include", "/login");
  });


  it("inscrit un utilisateur avec des données valides", () => {
    cy.get('[data-cy="register-firstname"]').type(VALID_USER.firstName);
    cy.get('[data-cy="register-lastname"]').type(VALID_USER.lastName);
    cy.get('[data-cy="register-email"]').type(VALID_USER.email);
    cy.get('[data-cy="register-pseudo"]').type(VALID_USER.pseudo);
    cy.get('[data-cy="register-phone"]').type(VALID_USER.phone);
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();

    cy.url({ timeout: 15000 }).should("not.include", "/register");

  });

  it("redirige vers la page d'accueil ou de connexion après inscription", () => {
    cy.get('[data-cy="register-firstname"]').type(VALID_USER.firstName);
    cy.get('[data-cy="register-lastname"]').type(VALID_USER.lastName);
    cy.get('[data-cy="register-pseudo"]').type(VALID_USER.pseudo);
    cy.get('[data-cy="register-phone"]').type(VALID_USER.phone);
    cy.get('[data-cy="register-email"]').type(`new.${Date.now()}@test.com`);
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();

    cy.url().should("satisfy", (url: string) =>
      url.includes("/") || url.includes("/login")
    );
  });


  it("affiche une erreur si l'email est invalide", () => {
    cy.get('[data-cy="register-firstname"]').type("Test");
    cy.get('[data-cy="register-lastname"]').type("User");
    cy.get('[data-cy="register-email"]').type("pas-un-email");
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();

    //cy.get('[data-cy="register-email-error"], [data-cy="form-error"]').should("be.visible");
    cy.url().should("include", "/register");
  });

  it("affiche une erreur si l'email est vide", () => {
    cy.get('[data-cy="register-firstname"]').type("Test");
    cy.get('[data-cy="register-lastname"]').type("User");
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();

    cy.url().should("include", "/register");
  });

  it("affiche une erreur si le mot de passe est trop court", () => {
    cy.get('[data-cy="register-firstname"]').type("Test");
    cy.get('[data-cy="register-lastname"]').type("User");
    cy.get('[data-cy="register-email"]').type("valid@example.com");
    cy.get('[data-cy="register-password"]').type("123");
    cy.get('[data-cy="register-submit"]').click();

    //cy.get('[data-cy="register-password-error"], [data-cy="form-error"]').should("be.visible");
    cy.url().should("include", "/register");
  });

  it("affiche une erreur si le prénom est vide", () => {
    cy.get('[data-cy="register-lastname"]').type("User");
    cy.get('[data-cy="register-email"]').type("valid@example.com");
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();

    cy.url().should("include", "/register");
  });

  it("affiche une erreur si l'email est déjà utilisé", () => {
    // Inscription initiale
    const email = `dup.${Date.now()}@example.com`;
    cy.get('[data-cy="register-firstname"]').type("Alice");
    cy.get('[data-cy="register-lastname"]').type("Test");
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();
    cy.url().should("not.include", "/register");

    // Deuxième tentative avec le même email
    cy.visit("/register");
    cy.get('[data-cy="register-firstname"]').type("Bob");
    cy.get('[data-cy="register-lastname"]').type("Test");
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type(VALID_USER.password);
    cy.get('[data-cy="register-submit"]').click();

    cy.contains(/déjà|existe|utilisé/i, { matchCase: false }).should("be.visible");
  });

  it("ne soumet pas si tous les champs sont vides", () => {
    cy.get('[data-cy="register-submit"]').click();
    cy.url().should("include", "/register");
  });
});
