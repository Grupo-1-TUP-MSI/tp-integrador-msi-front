// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
  cy.fixture('login').then((json) => {
    cy.intercept('POST', 'https://pintureria-api.herokuapp.com/auth/signin', {
      body: json,
    }).as('signin');
  });

  cy.fixture('reportes').then((json) => {
    cy.intercept('GET', 'https://pintureria-api.herokuapp.com/reportes/stock', {
      body: json.stock,
    }).as('stock');
  });
  cy.fixture('reportes').then((json) => {
    cy.intercept('GET', 'https://pintureria-api.herokuapp.com/reportes/np/pde', {
      body: json.pde,
    }).as('pde');
  });
  cy.fixture('reportes').then((json) => {
    cy.intercept('GET', 'https://pintureria-api.herokuapp.com/reportes/compraventa', {
      body: json.compraventa,
    }).as('compraventa');
  });
  cy.fixture('reportes').then((json) => {
    cy.intercept('GET', 'https://pintureria-api.herokuapp.com/reportes/pie-charts', {
      body: json.pieCharts,
    }).as('pie-charts');
  });

  cy.fixture('get-productos').then((json) => {
    cy.intercept('GET', 'https://pintureria-api.herokuapp.com/productos', {
      body: json,
    }).as('getProductos');
  });

  cy.visit('http://localhost:3000');

  cy.get('[data-testId="login--usuario"]').type('admin@colorcor.com');
  cy.get('[data-testId="login--password"]').type('admin');
  cy.get('[data-testId="login--loginBtn"]').click();
  cy.wait('@signin');
  cy.wait('@stock');
  cy.wait('@pde');
  cy.wait('@compraventa');
  cy.wait('@pie-charts');
});
