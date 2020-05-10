describe('hashtags', () => {
  describe('rich text editor with hashtags', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad: contentWindow => {
          contentWindow.hashtagListFixture = ['#office', '#computer']
        }
      })
    })

    describe('unresolved hashtags are highlighted', () => {
      const testColorDifference = (text, hashtags, description) => {
        it('color difference ' + description, () => {
          cy.get('#tagging-immutable-hashtags-with-fixture')
            .type(text)
            .invoke('text')
            .should('equal', text)

          hashtags.forEach(hashtag => {
            cy.contains(hashtag).should('have.class', 'editing-hashtag')
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
    })

    describe('resolve hashtags', () => {
      it('resolve hashtag suggestions using mouse click', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').as('immutables')
        cy.get('@immutables').type('Do paperwork #of')
        cy.contains('#office').click()
        cy.get('@immutables').should('contain', 'Do paperwork #office')
      })

      it('resolves hashtag suggestions', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('Do paperwork #of{enter}')
          .should('contain', 'Do paperwork #office')
      })

      it('resolves hashtag second option using keyboard', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('Do paperwork #{DownArrow}{enter}')
          .should('contain', 'Do paperwork #computer')
      })

      it('resolves hashtag second option using keyboard - challenging bottom limit', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('Do paperwork #{DownArrow}{DownArrow}{enter}')
          .should('contain', 'Do paperwork #computer')
      })

      it('resolves hashtag second option using keyboard - challenging upper limit', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('Do paperwork #{UpArrow}{UpArrow}{UpArrow}{DownArrow}{enter}')
          .should('contain', 'Do paperwork #office')
      })

      it('resolves hashtag second option using keyboard - create new hashtag', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Do paperwork #some'
        )

        cy.get('.suggestions-dropdown').within(() => {
          cy.contains('somewhere-else').should('not.be.visible')
        })

        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('where-else{enter}')
          .should('contain', 'Do paperwork #somewhere-else')

        cy.wait(200)

        cy.get('#tagging-immutable-hashtags-with-fixture').type(' #')
        cy.get('.suggestions-dropdown').within(() => {
          cy.contains('somewhere-else')
        })
      })
    })

    describe('suggestions highlighting', () => {
      it('highlights options according to mouse moves', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Do paperwork #'
        )
        cy.get('.suggestions-dropdown').within(() => {
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

      it('shows and hides selection upon entering and leaving hashtag', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Do paperwork #off'
        )
        cy.get('.suggestions-dropdown')
          .should('be.visible')
          .within(() => {
            cy.contains('office').should('be.visible')
          })
        cy.get('#tagging-immutable-hashtags-with-fixture').type(' ')
        cy.get('.suggestions-dropdown').should('not.be.visible')
      })
    })

    describe('selection on immutable hashtags', () => {
      const expectSelectionToEqual = value =>
        cy
          .window()
          .invoke('getSelection')
          .invoke('toString')
          .should('equal', value)

      describe('cursor selection', () => {
        it('click "leftArrow" when cursor is after hashtag', () => {
          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            'Go to #off{enter}{leftArrow}'
          )
          expectSelectionToEqual('#office')
        })

        it('type multiple "leftArrow"s when hashtag in the beginning', () => {
          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            '#reading{enter}something{home}{leftArrow}{leftArrow}{leftArrow}'
          )
          expectSelectionToEqual('')

          cy.get('#tagging-immutable-hashtags-with-fixture')
            .type('think of ')
            .invoke('text')
            .should('equal', 'think of #reading something')

          cy.contains('#reading').should(
            'have.prop',
            'tagName',
            'hashtag'.toUpperCase()
          )
          cy.contains('think of ').should('not.have.class', 'editing-hashtag')
        })

        it('walk around a resolved hashtag', () => {
          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            'Go to #off{enter}{leftArrow}{leftArrow}'
          )
          expectSelectionToEqual('')

          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            '{rightArrow}'
          )
          expectSelectionToEqual('#office')

          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            '{rightArrow}'
          )
          expectSelectionToEqual('')
        })

        it('walk around a resolved hashtag - challenge end of hashtag - simple', () => {
          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            'Go to #off{enter}{leftArrow}{rightArrow}'
          )
          expectSelectionToEqual('')

          cy.get('#tagging-immutable-hashtags-with-fixture')
            .type('a')
            .invoke('text')
            .should('contain', 'Go to #officea')

          // Test that the hashtag has not changed
          cy.contains('#office').invoke('text').should('equal', '#office')
        })

        it('walk around a resolved hashtag - challenge end of hashtag - more right and left keys', () => {
          cy.get('#tagging-immutable-hashtags-with-fixture').type(
            'Go to #off{enter}{backspace}{leftArrow}{leftArrow}{leftArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}'
          )
          expectSelectionToEqual('')

          cy.get('#tagging-immutable-hashtags-with-fixture')
            .type('a')
            .invoke('text')
            .should('equal', 'Go to #officea')

          // Test that the hashtag has not changed
          cy.contains('#office').invoke('text').should('equal', '#office')
        })
      })

      it('selects complete hashtag upon partial hashtag selection', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Go to #off{enter}{leftArrow}{leftArrow}'
        )
        cy.get('#tagging-immutable-hashtags-with-fixture p').then($div => {
          cy.window().then(win => {
            const paragraph = $div.get(0)

            // In the text "Go to #office", try to select only: "o #of"
            const range = document.createRange()
            range.setStart(paragraph.childNodes[0], 4)
            range.setEnd(paragraph.childNodes[1].firstChild, 2)
            win.getSelection().empty()
            win.getSelection().addRange(range)
          })
          // And confirm that the selection contains the whole immutable hashtag
          expectSelectionToEqual('o #office')
        })
      })
    })

    it.skip('does not paint unresolved hashtags on hashtags-immutables state', () => {
      cy.get('#tagging-immutable-hashtags-with-fixture')
        .type('good #after noon')
        .within(() => {
          cy.contains('after').should('have.class', 'editing-hashtag')
        })
      cy.get('#tagging-immutable-hashtags-with-fixture')
        .type('good #after noon')
        .within(() => {
          cy.contains('after').should('not.have.class', 'editing-hashtag')
        })
    })
  })
})
