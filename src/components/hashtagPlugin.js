import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin } from 'prosemirror-state'
import { findAllHashtags } from './hashtagUtils'
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
    }
  }
})

export default hashtagPlugin