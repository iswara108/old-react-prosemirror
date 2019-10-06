import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, NodeSelection } from 'prosemirror-state'
import { findHashtagUnderCursor } from './hashtagUtils'
import './hashtag.css'

function decorateHashtags(doc, selection) {
  const hashtag = findHashtagUnderCursor(doc, selection)
  if (hashtag)
    return Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
      class: 'hashtag-under-construction'
    })
}

class HashtagView {
  constructor(node, view, getPos) {
    this.dom = document.createElement('hashtag')
    this.dom.textContent = node.textContent
  }
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
    },
    nodeViews: {
      hashtag(node, view, getPos) {
        return new HashtagView(node, view, getPos)
      }
    }
  }
})

export default hashtagPlugin
