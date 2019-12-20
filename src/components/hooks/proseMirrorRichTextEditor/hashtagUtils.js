import Tokenizer from '../../../utils/text/tokenizer'

const getTokens = doc => {
  let tokens = { hashtags: [], mentions: [] }
  doc.descendants((node, pos, parent) => {
    if (parent.type.name === 'hashtag') return false
    if (node.isText && node.type.name !== 'hashtag') {
      const token = Tokenizer(node.text)
      token.hashtags = token.hashtags.map(hashtag => ({
        start: hashtag.start + pos - 1,
        end: hashtag.end + pos - 1,
        value: hashtag.value
      }))

      tokens = {
        hashtags: tokens.hashtags.concat(token.hashtags),
        mentions: tokens.mentions.concat(token.mentions)
      }
    }
  })
  return tokens
}

const findHashtagUnderCursor = (doc, selection) => {
  const tokens = getTokens(doc)
  const lowestSelection = Math.min(selection.anchor, selection.head)
  const highestSelection = Math.max(selection.anchor, selection.head)

  return tokens.hashtags.find(
    hashtag =>
      hashtag.start + 1 <= lowestSelection &&
      hashtag.end + 1 >= highestSelection
  )
}

export { findHashtagUnderCursor }
