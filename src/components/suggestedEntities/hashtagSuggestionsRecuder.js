import deburr from 'lodash/deburr'

const MOVE_TO_NEXT_HASHTAG = 'MOVE_TO_NEXT_HASHTAG'
const MOVE_TO_PREV_HASHTAG = 'MOVE_TO_PREV_HASHTAG'
const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
const OPEN_HASHTAG_OPTIONS = 'OPEN_HASHTAG_OPTIONS'
const CLOSE_HASHTAG_OPTIONS = 'CLOSE_HASHTAG_OPTIONS'

// Get relevant suggestions for the given hashtag under construction.
function getRelevantSuggestions(value = '', hashtagSuggestionList = []) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  return inputLength === 0
    ? []
    : hashtagSuggestionList.filter(
        suggestion =>
          suggestion.slice(0, inputLength).toLowerCase() === inputValue
      )
}

// Reducer for the suggestionsState, which contains the state of the suggestions being displayed.
function suggestionsStateReducer(
  hashtagUnderConstruction,
  hashtagSuggestionList,
  state,
  action
) {
  switch (action.type) {
    // set suggestion list state upon opening the hashtag suggestions
    case OPEN_HASHTAG_OPTIONS:
      const suggestionList = getRelevantSuggestions(
        hashtagUnderConstruction.value,
        hashtagSuggestionList
      )

      return {
        hashtagUnderConstruction,
        suggestionList,
        highlightIndex: suggestionList.length // set the highlight index according to its previous state upon opening the suggestion list:
          ? Math.min(
              // Limit the highlight index to the number of suggestions to account for situations in which the number of suggestions decrease.
              suggestionList.length - 1,
              state.highlightIndex === -1 ? 0 : state.highlightedIndex // default to keep the hightlight
            ) || 0 // If there is no previous highlight - default to the first option.
          : -1 // if there are no relevant suggestions - set highlight to creating a new hashtag
      }

    // hide selection list
    case CLOSE_HASHTAG_OPTIONS:
      return {}

    // move highlight index downward as long as it doesn't reach the end of the suggestions
    case MOVE_TO_NEXT_HASHTAG:
      return {
        ...state,
        highlightIndex:
          state.highlightIndex < state.suggestionList.length - 1
            ? state.highlightIndex + 1
            : state.highlightIndex
      }
    case MOVE_TO_PREV_HASHTAG:
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
    default:
      return state
  }
}

export {
  suggestionsStateReducer,
  MOVE_TO_NEXT_HASHTAG,
  MOVE_TO_PREV_HASHTAG,
  SET_HIGHLIGHT_INDEX,
  OPEN_HASHTAG_OPTIONS,
  CLOSE_HASHTAG_OPTIONS
}
