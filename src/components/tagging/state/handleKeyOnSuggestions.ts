import {
  SuggestionStateType,
  MOVE_TO_NEXT_SUGGESTION,
  MOVE_TO_PREV_SUGGESTION,
  CLOSE_TAG_SUGGESTIONS
} from './suggestionsRecuder'

// This function returns a function for handling keyDown DOM event
function handleKeyOnSuggestions(
  suggestionsState: SuggestionStateType,
  dispatchSuggestionsChange: React.Dispatch<{ type: string }>,
  resolveEditingTag: (selectedIndex?: number) => void
) {
  return (e: KeyboardEvent) => {
    if (suggestionsState.highlightIndex === undefined) return
    switch (e.key) {
      case 'ArrowDown':
        dispatchSuggestionsChange({ type: MOVE_TO_NEXT_SUGGESTION })
        e.preventDefault()
        break
      case 'ArrowUp':
        dispatchSuggestionsChange({ type: MOVE_TO_PREV_SUGGESTION })
        e.preventDefault()
        break
      case 'Enter':
        resolveEditingTag()
        dispatchSuggestionsChange({
          type: CLOSE_TAG_SUGGESTIONS
        })
        e.preventDefault()
        break
      default:
    }
  }
}

export default handleKeyOnSuggestions
