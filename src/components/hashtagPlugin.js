import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import { findAllHashtags, findHashtagUnderCursor, HASHTAG_SCHEMA_NODE_TYPE } from './hashtagUtils'
import './hashtag.css'

function decorateHashtags(doc, selection) {
  const hashtags = findAllHashtags(doc)

  return DecorationSet.create(
    doc,
    hashtags.map(hashtag =>
      Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
        class: 'hashtag'
      })
    )
  )
}

const hashtagPlugin = new Plugin({
  state: {
    init(_, instance) {
      return decorateHashtags(instance.doc, instance.selection)
    },

    apply(tr, oldDecoration) {
      return decorateHashtags(tr.doc, tr.curSelection)
    }
  },

  props: {
    decorations(editorState) {
      return this.getState(editorState)
    },
    handleDOMEvents: {
      keydown: (view, event) => {
        // In case of a multiline view, disable "Enter" key when hashtag is under construction to allow resolving hashtag via the "Enter" key.
        if (event.key === 'Enter') {
          const hashtagUnderConstruction = findHashtagUnderCursor(
            view.state.doc,
            view.state.selection
          )
          if (hashtagUnderConstruction) event.preventDefault()
        }
      }
    }
  }, filterTransaction(transaction, editorState) {
    let changeInHastag = false
    const editorHashtags = [], transactionHashtags = []
    editorState.doc.descendants((node, pos ) => {
      if (node.type.name === HASHTAG_SCHEMA_NODE_TYPE) editorHashtags.push({ node, pos })
    })
    transaction.doc.descendants((node, pos ) => {
      if (node.type.name === HASHTAG_SCHEMA_NODE_TYPE) transactionHashtags.push({ node, pos })
    })

    transactionHashtags.forEach(transHashtag => {
      const correspondingHashtag = editorHashtags.find(editorHashtag => editorHashtag.pos === transaction.mapping.invert().map(transHashtag.pos))
      if (correspondingHashtag) {
        if (!transHashtag.node.eq(correspondingHashtag.node)) changeInHastag = true
      }
    })
    console.info("trans", transactionHashtags.map(h => h.toString()), "editor", editorHashtags.map(h => h.toString()))
    return !changeInHastag
  }
})

export default hashtagPlugin
