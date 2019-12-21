import Tokenizer from '../../../utils/text/tokenizer'
const HASHTAG_SCHEMA_NODE_TYPE = 'hashtag'

const getTokens = doc => {
  let tokens = { hashtags: [], mentions: [] }

  doc.descendants((node, pos, parent) => {
    // do not consider resolved hashtag nodes.
    if (parent.type.name === HASHTAG_SCHEMA_NODE_TYPE) return false // do not recurse over children of a resolved hashtag
    if (!node.isText || node.type.name === HASHTAG_SCHEMA_NODE_TYPE) return // only handle text nodes which might have a token
    
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

export { findHashtagUnderCursor, HASHTAG_SCHEMA_NODE_TYPE }
