import { Decoration, DecorationSet } from 'prosemirror-view'
import { suggestionPlugin, PluginKey } from './suggestionPlugin'
import { findAllHashtags } from '../model/taggingUtils'

function decorateHashtags(doc, selection) {
  const allHashtags = findAllHashtags(doc)

  return DecorationSet.create(
    doc,
    allHashtags.map(hashtag =>
      Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
        class: 'editing-hashtag'
      })
    )
  )
}

// This plugin serves two purposes:
// 1. Decorate editing tags (unresolved tags)
// 2. Disables the "enter" key when the cursor is on a tag being edited, designating it to resolving a tag from the list of suggestions
const hashtagPlugin = new suggestionPlugin({
  key: new PluginKey('Hashtag Plugin'),
  state: {
    init(_, instance) {
      return decorateHashtags(instance.doc, instance.selection)
    },

    apply(tr, oldDecoration) {
      return decorateHashtags(tr.doc, tr.curSelection)
    }
  }
})

export default hashtagPlugin
