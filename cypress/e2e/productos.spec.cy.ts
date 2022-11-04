/// <reference types="cypress" />
describe('Productos', () => {
  beforeEach(() => {
    cy.fixture('delete-producto').then((json) => {
      cy.intercept('DELETE', 'https://pintureria-api.herokuapp.com/productos/*', { json }).as('deleteProducto');
    });
    cy.fixture('post-producto').then((json) => {
      cy.intercept('POST', 'https://pintureria-api.herokuapp.com/productos', { json }).as('postProducto');
    });
    cy.fixture('put-producto').then((json) => {
      cy.intercept('PUT', 'https://pintureria-api.herokuapp.com/productos/*', { json }).as('putProducto');
    });
    cy.fixture('get-producto').then((json) => {
      cy.intercept('GET', 'https://pintureria-api.herokuapp.com/productos/*', { body: json }).as('getProducto');
    });

    cy.visit('http://localhost:3000/productos');
  });
  it('Carga la lista de productos', () => {
    cy.wait('@getProductos');
    cy.get('h1').should('have.text', 'Productos');
    cy.get('[data-testId="productos--productTable"]');
    cy.get('[data-row-key="5"]').contains('5');
    cy.get('[data-row-key="5"]').contains('Pintura 15L Mate Blanco Látex Interior');
    cy.get('[data-row-key="5"]').contains('$1500');
    cy.get('[data-row-key="5"]').contains('20');
    cy.get('[data-row-key="5"]').contains('0');
  });
  it('Borrar producto', () => {
    cy.get('[data-testId="productos--delete-5"]').click();
    cy.contains('Eliminando elemento...');
    cy.contains('¿Está seguro de eliminar este elemento?');
    cy.contains('Confirmar').click();
    cy.wait('@deleteProducto');
    cy.contains('Operación exitosa.');
    cy.contains('Producto eliminado con éxito!');
  });
  it('Agregar producto', () => {
    cy.get('.success-button').click();
    cy.get('h1').should('have.text', 'Creando producto');

    cy.get('#nombre').type('Pintura 15L Mate Blanco Látex Interior');
    cy.get('#descripcion').type('1500');
    cy.get('#preciolista').type('20');
    cy.get('#stockminimo').type('0');

    cy.contains('Confirmar').click();
    cy.wait('@postProducto');
    cy.contains('Operación exitosa.');
    cy.contains('Producto creado con éxito!');
  });
  it('Editar producto', () => {
    cy.get('[data-testId="productos--edit-5"]').click();
    cy.wait('@getProducto');
    cy.url().should('include', '/productos/5');
    cy.get('h1').should('have.text', 'Editando producto');

    cy.get('#nombre').should('have.value', 'Pintura 15L Mate Blanco Látex Interior');
    cy.get('#descripcion').should('have.value', '');
    cy.get('#preciolista').should('have.value', 1500);
    cy.get('#stockminimo').should('have.value', 20);
    cy.get('#stockminimo').clear().type('25');

    cy.contains('Editar').click();
    cy.wait('@putProducto');
    cy.contains('Operación exitosa.');
    cy.contains('Producto actualizado con éxito!');
  });
});
