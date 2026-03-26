/**
 * cypress/support/commands.ts
 *
 * cy.login()      — connexion via API (rapide) + injection localStorage
 * cy.loginUser()  — connexion compte démo
 * cy.loginAdmin() — connexion compte admin
 * cy.logout()     — vide le localStorage et visite /
 * cy.searchHotel() — recherche depuis la page d'accueil
 */

const USER_EMAIL = "seraphin@gmail.com";
const USER_PASSWORD = "12345678#";
const ADMIN_EMAIL = "admin@luxstay.fr";
const ADMIN_PASSWORD = "admin123!";

// ── cy.login() ────────────────────────────────────────────────────────────────
// Appel API direct (pas d'UI) → beaucoup plus rapide et fiable.
// La réponse backend a la forme : { success: true, data: { tokens: { access, refresh }, user } }

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/v1/auth/login/",
      body: { email, password },
      failOnStatusCode: true,
    }).then((res) => {
      // Désenvelopper la réponse : { success, data: { tokens, user } }
      const data = res.body.data ?? res.body;
      const tokens = data.tokens ?? data;
      const user = data.user ?? {};

      const access = tokens.access ?? tokens.access_token;
      const refresh = tokens.refresh ?? tokens.refresh_token;

      expect(access, "access token doit exister").to.exist;
      expect(refresh, "refresh token doit exister").to.exist;

      // Injecter dans localStorage comme le ferait le vrai frontend
      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("auth_token", access);
          win.localStorage.setItem("auth_refresh", refresh);
          win.localStorage.setItem("auth_user", JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            pseudo: user.pseudo ?? "",
            isAdmin: user.is_admin ?? false,
          }));
          // Zustand authStore persist key
          win.localStorage.setItem("auth-storage", JSON.stringify({
            state: {
              isAuthenticated: true,
              userId: user.id,
              user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                pseudo: user.pseudo ?? "",
                isAdmin: user.is_admin ?? false,
              },
            },
            version: 0,
          }));
        },
      });
    });
  });
});

// ── cy.loginUser() ────────────────────────────────────────────────────────────
Cypress.Commands.add("loginUser", () => {
  cy.login(USER_EMAIL, USER_PASSWORD);
});

// ── cy.loginAdmin() ───────────────────────────────────────────────────────────
Cypress.Commands.add("loginAdmin", () => {
  cy.login(ADMIN_EMAIL, ADMIN_PASSWORD);
});

// ── cy.logout() ───────────────────────────────────────────────────────────────
Cypress.Commands.add("logout", () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit("/");
});

// ── cy.searchHotel() ─────────────────────────────────────────────────────────
// Clique sur une destination populaire (plus fiable que taper dans la SearchBar).
Cypress.Commands.add("searchHotel", (city: string) => {
  cy.visit("/");
  cy.contains(city).first().click();
  cy.url().should("include", "/search");
});