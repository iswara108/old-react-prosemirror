import deburr from 'lodash/deburr'
import Token from '../../../utils/text/token'

const MOVE_TO_NEXT_SUGGESTION = 'MOVE_TO_NEXT_SUGGESTION'
const MOVE_TO_PREV_SUGGESTION = 'MOVE_TO_PREV_SUGGESTION'
const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
const SET_EDITING_HASHTAG = 'SET_EDITING_HASHTAG'
const SET_EDITING_MENTION = 'SET_EDITING_MENTION'
const CLOSE_TAG_SUGGESTIONS = 'CLOSE_TAG_SUGGESTIONS'

export type SuggestionType = { tagName: string }

export interface SuggestionStateType {
  currentEditingTag?: Token
  suggestionList?: SuggestionType[]
  suggestionType?: string // 'mention' | 'hashtag'
  highlightedIndex?: number
  highlightIndex?: number
}

// Get relevant suggestions for the given hashtag under construction.
function getRelevantSuggestions(
  value = '',
  hashtagSuggestions: Array<SuggestionType> = []
) {
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
  hashtagSuggestions: Array<SuggestionType>,
  mentionSuggestions: Array<SuggestionType>,
  state: SuggestionStateType,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    // move highlight index downward as long as it doesn't reach the end of the suggestions
    case MOVE_TO_NEXT_SUGGESTION:
      if (state.highlightIndex && state.suggestionList) {
        return {
          ...state,
          highlightIndex:
            state.highlightIndex < state.suggestionList.length - 1
              ? state.highlightIndex + 1
              : state.highlightIndex
        }
      } else {
        return state
      }
    case CLOSE_TAG_SUGGESTIONS:
      return {}
    case MOVE_TO_PREV_SUGGESTION:
      // move highlight index upward as long as it doesn't reach the beginning of the suggestions
      if (state.highlightIndex) {
        return {
          ...state,
          highlightIndex:
            state.highlightIndex >= 0
              ? state.highlightIndex - 1
              : state.highlightIndex
        }
      } else {
        return state
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
      if (state.highlightIndex && state.highlightedIndex) {
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
      } else {
        return state
      }
    case SET_EDITING_MENTION:
      if (!action.payload) return {} // if there is no hashtag under construction - do not display selections
      const mentionSuggestionList = getRelevantSuggestions(
        action.payload.value,
        mentionSuggestions
      )

      if (state.highlightedIndex) {
        return {
          currentEditingTag: action.payload,
          suggestionList: mentionSuggestionList,
          suggestionType: 'mention',
          highlightedIndex: mentionSuggestionList.length // set the highlight index according to its previous state upon opening the suggestion list:
            ? Math.min(
                // Limit the highlight index to the number of suggestions to account for situations in which the number of suggestions decrease.
                mentionSuggestionList.length - 1,
                state.highlightedIndex === -1 ? 0 : state.highlightedIndex // default to keep the hightlight
              ) || 0 // If there is no previous highlight - default to the first option.
            : 0
        }
      } else {
        return state
      }

    default:
      return state
  }
}

interface SquareConfig {
  color?: string
  width?: number
}
// interface ffasd {
//   aa: number
//   b: string
//   // currentEditingTag?: any
//   // suggestionList: any
//   // suggestionType: 'mention' | 'hashtag'
// }

export {
  suggestionsStateReducer,
  MOVE_TO_NEXT_SUGGESTION,
  MOVE_TO_PREV_SUGGESTION,
  SET_HIGHLIGHT_INDEX,
  CLOSE_TAG_SUGGESTIONS,
  SET_EDITING_HASHTAG,
  SET_EDITING_MENTION
}
