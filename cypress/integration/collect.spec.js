beforeEach(() => {
  cy.visit('http://localhost:3000/collect')
})

it('checks hashtag using enter key', () => {
  cy.get('#title > div')
    .type('do spreadsheets #com{enter}quickly')
    .should('be.visible')

  cy.get('#title > div > p > hashtag').should('have.text', '#computer')
})

it('checks a hashtag resolved and a new one at the beginning', () => {
  cy.get('#title > div')
    .type('do spreadsheets #com{enter}quickly{home}#com {leftarrow}')
    .should('be.visible')
})
