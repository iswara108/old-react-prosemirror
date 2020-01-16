beforeEach(() => {
  cy.visit('/')
})

describe('rich text editor with hashtags', () => {
  const testColorDifference = (text, hashtags, description) => {
    it('color difference ' + description, () => {
      cy.get('#prosemirror-hashtag').type(text)

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

  it('gives hashtag suggestions', () => {})
})
