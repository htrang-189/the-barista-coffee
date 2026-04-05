describe('Simple Test: Verify Menu Page Loads', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.get('body').should('exist');
  });

  it('should have menu items', () => {
    cy.visit('/');
    cy.get('button').should('exist');
  });
});
