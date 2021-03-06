import deburr from 'lodash/deburr'

const MOVE_TO_NEXT_SUGGESTION = 'MOVE_TO_NEXT_SUGGESTION'
const MOVE_TO_PREV_SUGGESTION = 'MOVE_TO_PREV_SUGGESTION'
const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
const SET_EDITING_HASHTAG = 'SET_EDITING_HASHTAG'
const SET_EDITING_MENTION = 'SET_EDITING_MENTION'
const CLOSE_TAG_SUGGESTIONS = 'CLOSE_TAG_SUGGESTIONS'

// Get relevant suggestions for the given hashtag under construction.
function getRelevantSuggestions(value = '', hashtagSuggestions = []) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  return inputLength === 0
    ? []
    : hashtagSuggestions.filter(
        suggestion =>
          suggestion.tagName.slice(0, inputLength).toLowerCase() === inputValue
      )
}

// Reducer for the suggestionsState, which contains the state of the suggestions being displayed.
function suggestionsStateReducer(
  hashtagSuggestions,
  mentionSuggestions,
  state,
  action
) {
  switch (action.type) {
    // move highlight index downward as long as it doesn't reach the end of the suggestions
    case MOVE_TO_NEXT_SUGGESTION:
      return {
        ...state,
        highlightIndex:
          state.highlightIndex < state.suggestionList.length - 1
            ? state.highlightIndex + 1
            : state.highlightIndex
      }
    case CLOSE_TAG_SUGGESTIONS:
      return {}
    case MOVE_TO_PREV_SUGGESTION:
      // move highlight index upward as long as it doesn't reach the beginning of the suggestions
      return {
        ...state,
        highlightIndex:
          state.highlightIndex >= 0
            ? state.highlightIndex - 1
            : state.highlightIndex
      }
    case SET_HIGHLIGHT_INDEX:
      return {
        ...state,
        highlightIndex: action.payload
          ? action.payload.index
          : state.highlightIndex
      }
    case SET_EDITING_HASHTAG:
      if (!action.payload) return {} // if there is no hashtag under construction - do not display selections

      const hashtagSuggestionList = getRelevantSuggestions(
        action.payload.value,
        hashtagSuggestions
      )

      return {
        currentEditingTag: action.payload,
        suggestionList: hashtagSuggestionList,
        suggestionType: 'hashtag',
        highlightIndex: hashtagSuggestionList.length // set the highlight index according to its previous state upon opening the suggestion list:
          ? Math.min(
              // Limit the highlight index to the number of suggestions to account for situations in which the number of suggestions decrease.
              hashtagSuggestionList.length - 1,
              state.highlightIndex === -1 ? 0 : state.highlightedIndex // default to keep the hightlight
            ) || 0 // If there is no previous highlight - default to the first option.
          : -1 // if there are no relevant suggestions - set highlight to creating a new hashtag
      }
    case SET_EDITING_MENTION:
      if (!action.payload) return {} // if there is no hashtag under construction - do not display selections
      const mentionSuggestionList = getRelevantSuggestions(
        action.payload.value,
        mentionSuggestions
      )

      return {
        currentEditingTag: action.payload,
        suggestionList: mentionSuggestionList,
        suggestionType: 'mention',
        highlightIndex: mentionSuggestionList.length // set the highlight index according to its previous state upon opening the suggestion list:
          ? Math.min(
              // Limit the highlight index to the number of suggestions to account for situations in which the number of suggestions decrease.
              mentionSuggestionList.length - 1,
              state.highlightIndex === -1 ? 0 : state.highlightedIndex // default to keep the hightlight
            ) || 0 // If there is no previous highlight - default to the first option.
          : 0
      }

    default:
      return state
  }
}

export {
  suggestionsStateReducer,
  MOVE_TO_NEXT_SUGGESTION,
  MOVE_TO_PREV_SUGGESTION,
  SET_HIGHLIGHT_INDEX,
  CLOSE_TAG_SUGGESTIONS,
  SET_EDITING_HASHTAG,
  SET_EDITING_MENTION
}
