import { Decoration, DecorationSet } from 'prosemirror-view'
import { suggestionPlugin, PluginKey } from './suggestionPlugin'
import { findAllMentions } from '../model/taggingUtils'

function decorateMentions(doc, selection) {
  const allMentions = findAllMentions(doc)

  return DecorationSet.create(
    doc,
    allMentions.map(mention =>
      Decoration.inline(mention.start + 1, mention.end + 1, {
        class: 'editing-mention'
      })
    )
  )
}

// This plugin serves two purposes:
// 1. Decorate editing tags (unresolved tags)
// 2. Disables the "enter" key when the cursor is on a tag being edited, designating it to resolving a tag from the list of suggestions
const mentionPlugin = new suggestionPlugin({
  key: new PluginKey('Mention Plugin'),
  state: {
    init(_, instance) {
      return decorateMentions(instance.doc, instance.selection)
    },

    apply(tr, oldDecoration) {
      return decorateMentions(tr.doc, tr.curSelection)
    }
  }
})

export default mentionPlugin
