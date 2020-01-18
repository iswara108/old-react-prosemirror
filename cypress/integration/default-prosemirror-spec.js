beforeEach(() => {
  cy.visit('/')
})

it('enters simple text without delay', () => {
  cy.get('#prosemirror')
    .type('hello world')
    .should('contain', 'hello world')
})

it('enters simple text with second word bolded', () => {
  cy.get('#prosemirror')
    .type('hello {ctrl}b')
    .type('world')
    .should('contain', 'hello world')

  cy.get('#prosemirror strong').should($bold =>
    expect($bold.text()).to.equal('world')
  )
  cy.contains('world').should('have.css', 'font-weight', '700')
})

context('partial marks', () => {
  const testPartialSelectionMarks = (first, second) => {
    const NORMAL_WEIGHT = '400'
    const BOLD_WEIGHT = '700'
    cy.get('#prosemirror')
      .setSelection(first)
      .type('{ctrl}b')
      .should('contain', first)
      .and('contain', second)

    cy.contains(second)
      .should('have.css', 'font-weight', NORMAL_WEIGHT)
      .and('have.css', 'font-style', 'normal')

    cy.contains(first)
      .should('have.css', 'font-weight', BOLD_WEIGHT)
      .and('have.css', 'font-style', 'normal')
      .and('have.css', 'font-style', 'normal')

    cy.get('#prosemirror').type('{ctrl}b')

    cy.contains(second)
      .should('have.css', 'font-weight', NORMAL_WEIGHT)
      .and('have.css', 'font-style', 'normal')

    cy.contains(first)
      .should('have.css', 'font-weight', NORMAL_WEIGHT)
      .and('have.css', 'font-style', 'normal')

    cy.get('#prosemirror').type('{ctrl}i')

    cy.contains(second)
      .should('have.css', 'font-weight', NORMAL_WEIGHT)
      .and('have.css', 'font-style', 'normal')

    cy.contains(first)
      .should('have.css', 'font-weight', NORMAL_WEIGHT)
      .and('have.css', 'font-style', 'italic')

    cy.get('#prosemirror').type('{ctrl}b')

    cy.contains(second)
      .should('have.css', 'font-weight', NORMAL_WEIGHT)
      .and('have.css', 'font-style', 'normal')

    cy.contains(first)
      .should('have.css', 'font-weight', BOLD_WEIGHT)
      .and('have.css', 'font-style', 'italic')
  }

  it('enters two simple words, highlights first word and add/remove marks via keyboard strokes', () => {
    cy.get('#prosemirror').type('hello world{home}')
    testPartialSelectionMarks('hello', ' world')
  })

  it('enters two simple words, highlights partial worlds and add/remove marks via keyboard strokes', () => {
    cy.get('#prosemirror').type('hello world{home}')
    testPartialSelectionMarks('lo wor', 'hel')
  })
})

it('allows multiline', () => {
  cy.get('#prosemirror')
    .type('oṃ{enter}namaḥ{enter}śivāya')
    .find('p')
    .should('have.length', 3)
})
