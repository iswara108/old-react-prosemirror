import * as actionTypes from './suggestionsRecuder'

// This function returns a function for handling keyDown DOM event
function handleKeyOnSuggestions(
  suggestionsState,
  dispatchSuggestionsChange,
  resolveEditingTag
) {
  return e => {
    if (isNaN(suggestionsState.highlightIndex)) return
    switch (e.key) {
      case 'ArrowDown':
        dispatchSuggestionsChange({ type: actionTypes.MOVE_TO_NEXT_SUGGESTION })
        e.preventDefault()
        break
      case 'ArrowUp':
        dispatchSuggestionsChange({ type: actionTypes.MOVE_TO_PREV_SUGGESTION })
        e.preventDefault()
        break
      case 'Enter':
        resolveEditingTag()
        dispatchSuggestionsChange({
          type: actionTypes.CLOSE_TAG_SUGGESTIONS
        })
        e.preventDefault()
        break
      default:
    }
  }
}

export default handleKeyOnSuggestions
