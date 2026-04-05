// Cypress E2E Support File
// This file runs before every spec file

// Import commands
import './commands';

// Disable uncaught exception handling for expected errors during tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

