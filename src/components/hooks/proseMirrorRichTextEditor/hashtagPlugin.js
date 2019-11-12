import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import { findHashtagUnderCursor } from './hashtagUtils'
import './hashtag.css'

function decorateHashtags(doc, selection) {
  const hashtag = findHashtagUnderCursor(doc, selection)
  if (hashtag)
    return Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
      class: 'hashtag-under-construction'
    })
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
      const decoration = this.getState(editorState)
      if (decoration) {
        const set = DecorationSet.create(editorState.doc, [decoration])
        return set
      } else return null
    }
  }
})

export default hashtagPlugin
