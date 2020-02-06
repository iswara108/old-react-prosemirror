import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state'
import {
  findAllHashtags,
  findHashtagUnderCursor,
  HASHTAG_SCHEMA_NODE_TYPE
} from './hashtagUtils'
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
  key: new PluginKey('Hashtag Plugin'),
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
    },
    createSelectionBetween(view, anchor, head) {
      if (head.node(head.depth).type.name === HASHTAG_SCHEMA_NODE_TYPE) {
        const hashtagSelection = NodeSelection.create(
          view.state.doc,
          head.before(head.depth)
        )
        return hashtagSelection
      }
    }
  },
  filterTransaction(transaction, editorState) {
    let changeInHashtag = false
    const editorHashtags = [],
      transactionHashtags = []

    editorState.doc.descendants((node, pos) => {
      if (node.type.name === HASHTAG_SCHEMA_NODE_TYPE)
        editorHashtags.push({ node, pos })
    })
    transaction.doc.descendants((node, pos) => {
      if (node.type.name === HASHTAG_SCHEMA_NODE_TYPE)
        transactionHashtags.push({ node, pos })
    })

    transactionHashtags.forEach(transHashtag => {
      const correspondingHashtag = editorHashtags.find(
        editorHashtag =>
          editorHashtag.pos ===
          transaction.mapping.invert().map(transHashtag.pos)
      )
      if (correspondingHashtag) {
        if (!transHashtag.node.eq(correspondingHashtag.node))
          changeInHashtag = true
      }
    })

    return !changeInHashtag
  }
})

export default hashtagPlugin
