describe('mentions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('unresolved mentions are highlighted', () => {
    const testColorDifference = (text, mentions, description) => {
      it('color difference ' + description, () => {
        cy.get('#tagging-immutable-hashtags-uncontrolled')
          .type(text)
          .invoke('text')
          .should('equal', text)

        mentions.forEach(hashtag => {
          cy.contains(hashtag).should('have.class', 'editing-mention')
        })
      })
    }
    testColorDifference(
      'wait for @john for the assignment',
      ['@john'],
      'mention at the middle'
    )

    testColorDifference(
      '@swami-brahmananda to approve something',
      ['@swami-brahmananda'],
      'mention at the start'
    )

    testColorDifference(
      'go to errands with @nally',
      ['@nally'],
      'mention at the end'
    )
  })
  context('empty fixture', () => {
    beforeEach(() => {
      cy.visit('/')
    })
    it('type Enter on an unresolved name', () => {
      cy.get('#tagging-immutable-hashtags-controlled').type(
        '@non-existing{enter}'
      )

      cy.get('#tagging-immutable-hashtags-controlled').should(
        'contain',
        '@non-existing'
      )
      cy.contains('@non-existing').should('not.have.prop', 'tagName', 'MENTION')
    })
  })
  context('show people suggestions', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad: contentWindow => {
          contentWindow.mentionListFixture = [
            {
              avatarURL:
                'https://www.dropbox.com/s/lu84yyrf6sec3qf/Swami-Brahmananda-for-WEBSITE-and-FB-300-x-400.jpg?raw=1',
              displayName: 'Swami Brahmananda',
              tagName: '@swami-brahmananda'
            },
            {
              avatarURL:
                'https://www.dropbox.com/s/z7er5hxdcsd2srp/Parvati.jpg?raw=1',
              displayName: 'Parvati Chaitanya',
              tagName: '@parvati-chaitanya'
            }
          ]
        }
      })
    })

    it('checks multiple options', () => {
      cy.get('#tagging-immutable-hashtags-with-fixture').type('@')
      cy.get('.suggestions-dropdown').within(() => {
        cy.contains('Swami Brahmananda').should('be.visible')
        cy.contains('Parvati Chaitanya').should('be.visible')
      })
    })
    it('checks matching editing names', () => {
      cy.get('#tagging-immutable-hashtags-with-fixture').type('@Swa')
      cy.get('.suggestions-dropdown').within(() => {
        cy.contains('Swami Brahmananda').should('be.visible')
        cy.contains('Parvati Chaitanya').should('not.be.visible')
      })
      cy.get('#tagging-immutable-hashtags-with-fixture').type(
        '{backspace}{backspace}{backspace}par'
      )
      cy.get('.suggestions-dropdown').within(() => {
        cy.contains('Swami Brahmananda').should('not.be.visible')
        cy.contains('Parvati Chaitanya').should('be.visible')
      })
    })
  })
})
