beforeEach(() => {
  cy.visit('/', {
    onBeforeLoad: contentWindow => {
      contentWindow.hashtagListFixture = ['#office', '#computer']
    }
  })
})

describe('rich text editor with hashtags', () => {
  const testColorDifference = (text, hashtags, description) => {
    it('color difference ' + description, () => {
      cy.get('#prosemirror-hashtag-mutables').type(text)

      hashtags.forEach(hashtag => {
        cy.contains(hashtag).should('have.class', 'hashtag')
      })
    })
  }

  testColorDifference(
    'I am doing work at the #office',
    ['#office'],
    'hashtag at the end'
  )
  testColorDifference(
    'I am doing work at the #office ',
    ['#office'],
    'whitespace after hashtag'
  )
  testColorDifference(
    '#read the assignment',
    ['#read'],
    'hashtag at the beginning'
  )
  testColorDifference(
    '#read the assignment in the #office',
    ['#office', '#read'],
    'hashtag at the beginning & end'
  )
  testColorDifference(
    '#read the assignment in the #office while drinking tea',
    ['#read', '#office'],
    'hashtag at the beginning & middle'
  )
  testColorDifference(
    '#read the assignment in the #office while drinking #hot-chocolate',
    ['#read', '#office', '#hot-chocolate'],
    'hashtag at the beginning, middle & end'
  )

  it('resolves hashtag suggestions', () => {
    cy.get('#prosemirror-hashtag-immutables')
      .type('Do paperwork #of{enter}')
      .should('contain', 'Do paperwork #office')
  })

  it('resolves hashtag second option using keyboard', () => {
    cy.get('#prosemirror-hashtag-immutables')
      .type('Do paperwork #{DownArrow}{enter}')
      .should('contain', 'Do paperwork #computer')
  })

  it('resolves hashtag second option using keyboard - challenging bottom limit', () => {
    cy.get('#prosemirror-hashtag-immutables')
      .type('Do paperwork #{DownArrow}{DownArrow}{enter}')
      .should('contain', 'Do paperwork #computer')
  })

  it('resolves hashtag second option using keyboard - challenging upper limit', () => {
    cy.get('#prosemirror-hashtag-immutables')
      .type('Do paperwork #{UpArrow}{UpArrow}{UpArrow}{DownArrow}{enter}')
      .should('contain', 'Do paperwork #office')
  })

  it('resolves hashtag second option using keyboard - create new hashtag', () => {
    cy.get('#prosemirror-hashtag-immutables').type('Do paperwork #some')

    cy.get('.select-hashtags').within(() => {
      cy.contains('somewhere-else').should('not.be.visible')
    })

    cy.get('#prosemirror-hashtag-immutables')
      .type('where-else{enter}')
      .should('contain', 'Do paperwork #somewhere-else')

    cy.get('#prosemirror-hashtag-immutables').type(' #')
    cy.get('.select-hashtags').within(() => {
      cy.contains('somewhere-else')
    })
  })

  it('highlights options according to mouse moves', () => {
    cy.get('#prosemirror-hashtag-immutables').type('Do paperwork #')
    cy.get('.select-hashtags').within(() => {
      cy.contains('computer')
        .trigger('mousemove')
        .should('have.class', 'Mui-selected')
      cy.contains('office')
        .should('not.have.class', 'Mui-selected')
        .trigger('mousemove')
        .should('have.class', 'Mui-selected')
      cy.contains('computer').should('not.have.class', 'Mui-selected')
    })
  })

  it.skip('does not paint unresolved hashtags on hashtags-immutables state', () => {
    cy.get('#prosemirror-hashtag-mutables')
      .type('good #after noon')
      .within(() => {
        cy.contains('after').should('have.class', 'hashtag')
      })
    cy.get('#prosemirror-hashtag-immutables')
      .type('good #after noon')
      .within(() => {
        cy.contains('after').should('not.have.class', 'hashtag')
      })
  })
})
