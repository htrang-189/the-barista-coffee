// Cypress Custom Commands

/// <reference types="cypress" />

// Example command: cy.login()
// Cypress.Commands.add('login', (email, password) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command types here
    }
  }
}

export {};
