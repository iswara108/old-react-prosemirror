import { Decoration, DecorationSet } from "prosemirror-view"
import { Plugin } from "prosemirror-state"
import Tokenizer from "../../../utils/text/tokenizer"
import "./hashtag.css"

const getTokens = doc => {
  let tokens = { hashtags: [], mentions: [] }
  // For each node in the document
  doc.descendants(node => {
    if (node.isText) {
      tokens = Object.assign(tokens, Tokenizer(node.text))
    }
  })
  return tokens
}

function hashtagDecoration(doc) {
  let decorations = []
  const tokens = getTokens(doc)
  tokens.hashtags.forEach(hashtag => {
    const inlineDeco = Decoration.inline(hashtag.start + 1, hashtag.end + 2, {
      class: "hashtag"
    })

    decorations.push(inlineDeco)
  })
  return DecorationSet.create(doc, decorations)
}

export default new Plugin({
  state: {
    init(_, { doc }) {
      return hashtagDecoration(doc)
    },
    apply(tr, old) {
      return tr.docChanged ? hashtagDecoration(tr.doc) : old
    }
  },

  props: {
    decorations(state) {
      return this.getState(state)
    }
  }
})
