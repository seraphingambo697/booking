/**
 * cypress/support/e2e.ts
 * Fichier de support E2E — chargé AVANT chaque test.
 *
 * Importe les commandes custom et configure l'environnement global.
 * Ce fichier est le point d'entrée configuré dans cypress.config.ts.
 */

// Importe toutes les commandes custom (cy.login, cy.searchHotel, etc.)
import "./commands";

// Désactive les logs de console dans les tests (optionnel)
// Cypress.on("window:before:load", (win) => {
//   cy.stub(win.console, "log");
// });

// Capture les erreurs non gérées pour ne pas faire échouer les tests
// (utile en développement si l'app log des warnings)
Cypress.on("uncaught:exception", (err, runnable) => {
  // Retourne false pour ne pas propager l'erreur et échouer le test
  // À ajuster selon vos besoins
  if (err.message.includes("ResizeObserver loop limit exceeded")) {
    return false;
  }
  return true;
});
