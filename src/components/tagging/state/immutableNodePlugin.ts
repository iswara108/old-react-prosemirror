import {
  Plugin,
  PluginKey,
  TextSelection,
  NodeSelection
} from 'prosemirror-state'
import { Node } from 'prosemirror-model'

const createImmutablePlugin = (immutableNodeType: string) =>
  new Plugin({
    key: new PluginKey('Immutable Plugin'),

    props: {
      // If a text is input on the borders of the immutable node - insert as plain text.
      handleTextInput(view, from, _to, text) {
        if (
          view.state.doc.resolve(from).parent.type.name === immutableNodeType
        ) {
          view.dispatch(view.state.tr.insertText(text))
        }
        return true
      },

      // completes any selection to encompass any hashtag within it in its
      createSelectionBetween(view, anchor, head) {
        if (head.node(head.depth).type.name === immutableNodeType) {
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
      const editorHashtags: Array<{ node: Node; pos: number }> = [],
        transactionImmutables: Array<{ node: Node; pos: number }> = []

      editorState.doc.descendants((node, pos) => {
        if (node.type.name === immutableNodeType)
          editorHashtags.push({ node, pos })
      })
      transaction.doc.descendants((node, pos) => {
        if (node.type.name === immutableNodeType)
          transactionImmutables.push({ node, pos })
      })

      transactionImmutables.forEach(transHashtag => {
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

export default createImmutablePlugin
