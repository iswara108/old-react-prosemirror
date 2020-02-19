import Tokenizer from '../../../utils/text/tokenizer'
const HASHTAG_SCHEMA_NODE_TYPE = 'hashtagMention'
const MENTION_SCHEMA_NODE_TYPE = 'personMention'

// This function takes a node with taggingSchema and returns an object with an array of all hashtags and an array of all mentions
const getTokens = doc => {
  let tokens = { hashtags: [], mentions: [] }

  doc.descendants((node, pos, parent) => {
    // do not consider resolved tag nodes.
    if (
      parent.type.name === HASHTAG_SCHEMA_NODE_TYPE ||
      parent.type.name === MENTION_SCHEMA_NODE_TYPE
    )
      return false // do not recurse over children of a resolved hashtag

    if (
      !node.isText ||
      node.type.name === HASHTAG_SCHEMA_NODE_TYPE ||
      node.type.name === MENTION_SCHEMA_NODE_TYPE
    )
      return // only handle text nodes which might have a token

    const tokenizer = Tokenizer(node.text)

    const token = {}
    token.hashtags = tokenizer.hashtags.map(hashtag => ({
      start: hashtag.start + pos - 1,
      end: hashtag.end + pos - 1,
      value: hashtag.value
    }))
    token.mentions = tokenizer.mentions.map(mention => ({
      start: mention.start + pos - 1,
      end: mention.end + pos - 1,
      value: mention.value
    }))

    tokens = {
      hashtags: tokens.hashtags.concat(token.hashtags),
      mentions: tokens.mentions.concat(token.mentions)
    }
  })
  return tokens
}

// get a hashtag object, containing the keys:
// {
//  start: Number,
//  end: Number,
//  value: String
// }
const findEditingHashtag = (doc, selection) => {
  const tokens = getTokens(doc)
  const lowestSelection = Math.min(selection.anchor, selection.head)
  const highestSelection = Math.max(selection.anchor, selection.head)

  return tokens.hashtags.find(
    hashtag =>
      hashtag.start + 1 <= lowestSelection &&
      hashtag.end + 1 >= highestSelection
  )
}
const findEditingMention = (doc, selection) => {
  const tokens = getTokens(doc)
  const lowestSelection = Math.min(selection.anchor, selection.head)
  const highestSelection = Math.max(selection.anchor, selection.head)

  return tokens.mentions.find(
    mention =>
      mention.start + 1 <= lowestSelection &&
      mention.end + 1 >= highestSelection
  )
}

const findAllHashtags = doc => {
  return getTokens(doc).hashtags
}

const findAllMentions = doc => {
  return getTokens(doc).mentions
}

export {
  findEditingHashtag,
  findEditingMention,
  findAllHashtags,
  findAllMentions,
  HASHTAG_SCHEMA_NODE_TYPE,
  MENTION_SCHEMA_NODE_TYPE
}
