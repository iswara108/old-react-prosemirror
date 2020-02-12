import { Decoration, DecorationSet } from 'prosemirror-view'
import {
  Plugin,
  PluginKey,
  TextSelection,
  NodeSelection
} from 'prosemirror-state'
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

    // If a text is input on the borders of the immutable hashtag - insert as plain text.
    handleTextInput(view, from, to, text) {
      if (
        view.state.doc.resolve(from).parent.type.name ===
        HASHTAG_SCHEMA_NODE_TYPE
      ) {
        view.dispatch(view.state.tr.insertText(text))
        return true
      }
    },

    // completes any selection to encompass any hashtag within it in its
    createSelectionBetween(view, anchor, head) {
      if (head.node(head.depth).type.name === HASHTAG_SCHEMA_NODE_TYPE) {
        // if the selection head is crossing an immutable hashtag

        // change the head to
        const newHead = head.doc.resolve(
          anchor.pos >= head.pos // if the selection goes backwards
            ? head.before(head.depth) // to the beginning of the hashtag
            : head.after(head.depth) // or else - to the end of the hashtag.
        )

        const newAnchor = // change the anchor of the selection
          anchor.pos >= head.pos // if the selection goes backwards
            ? anchor.doc.resolve(anchor.after(anchor.depth)) // to the end of the hashtag
            : anchor // or else - keep it as it is.

        const hashtagSelection = // create the selection
          newHead.nodeAfter &&
          newAnchor.nodeBefore &&
          newHead.nodeAfter === newAnchor.nodeBefore // as a NodeSelection if the hashtag is the only element selected
            ? new NodeSelection(newHead)
            : new TextSelection(newAnchor, newHead) // or as a TextSelection in any other case

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
