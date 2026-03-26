/**
 * Tests — Page de résultats de recherche
 */
describe("Page de résultats de recherche", () => {

  beforeEach(() => {
    cy.searchHotel("Paris");
  });

  it("affiche les résultats après une recherche", () => {
    cy.url().should("include", "/search");
    cy.get("body").should("be.visible");
  });

  it("affiche des cartes hôtels", () => {
    cy.get("body").then($body => {
      const hasCards = $body.find('[data-cy="hotel-card"]').length > 0;
      const hasEmpty = $body.text().toLowerCase().includes("aucun");
      expect(hasCards || hasEmpty).to.be.true;
    });
  });

  it("affiche le nom sur chaque carte hôtel", () => {
    cy.get('[data-cy="hotel-card"]', { timeout: 10000 }).first().within(() => {
      cy.get("h3").should("not.be.empty");
    });
  });

  it("navigue vers le détail en cliquant sur une carte hôtel", () => {
    cy.get('[data-cy="hotel-card"]', { timeout: 10000 }).first().click();
    cy.url().should("match", /\/hotel\//);
  });

});