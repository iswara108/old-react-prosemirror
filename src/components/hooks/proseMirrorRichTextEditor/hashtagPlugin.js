import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import Tokenizer from '../../../utils/text/tokenizer'
import './hashtag.css'

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

function decorateHashtags(doc, selection) {
  let decorations = []
  const tokens = getTokens(doc)

  tokens.hashtags.forEach(hashtag => {
    const inlineDeco = Decoration.inline(hashtag.start + 1, hashtag.end + 2, {
      class: 'hashtag'
    })

    decorations.push(inlineDeco)
  })

  return DecorationSet.create(doc, decorations)
}

const findHashtagUnderCursor = (doc, selection) => {
  const tokens = getTokens(doc)
  return tokens.hashtags.find(
    hashtag =>
      selection.anchor === selection.head &&
      hashtag.start + 2 <= selection.anchor &&
      hashtag.end + 2 >= selection.head
  )
}

export default new Plugin({
  state: {
    init(_, instance) {
      return decorateHashtags(instance.doc, instance.selection)
    },

    apply(tr, oldDecorationSet) {
      const hashtagUnderCursor = findHashtagUnderCursor(tr.doc, tr.curSelection)

      if (tr.docChanged) {
        return decorateHashtags(tr.doc, tr.curSelection)
      } else {
        return oldDecorationSet
      }
    }
  },

  props: {
    decorations(editorState) {
      return this.getState(editorState)
    }
  }
})
