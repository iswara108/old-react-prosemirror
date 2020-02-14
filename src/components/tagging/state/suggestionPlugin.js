import { Plugin, PluginKey } from 'prosemirror-state'
import { findEditingTag } from '../model/taggingUtils'

class suggestionPlugin extends Plugin {
  constructor(args) {
    super({
      ...args,
      props: {
        decorations(editorState) {
          return this.getState(editorState)
        },

        handleDOMEvents: {
          keydown: (view, event) => {
            // In case of a multiline view, disable "Enter" key when a tag is being edited to allow resolving tag via the "Enter" key.
            if (event.key === 'Enter') {
              const currentEditingTag = findEditingTag(
                view.state.doc,
                view.state.selection
              )
              if (currentEditingTag) event.preventDefault()
            }
          }
        }
      }
    })
  }
}

export { suggestionPlugin, PluginKey }
