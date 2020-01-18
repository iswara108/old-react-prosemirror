import React /* eslint-disable-line no-unused-vars */, {
  useReducer,
  useState,
  useEffect
} from 'react'

import deburr from 'lodash/deburr'
import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import hashtagPlugin from './hashtagPlugin'
import {
  HASHTAG_SCHEMA_NODE_TYPE,
  findHashtagUnderCursor
} from './hashtagUtils'
import useDefaultProseState from './proseDefaultHook'

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

function useHashtagProseState({
  focusViewHook,
  onChange,
  content,
  multiline,
  disableMarks,
  disableEdit,
  hashtagSuggestionList,
  onNewHashtag,
  hashtagsType
}) {
  const schema = hashtagSchema(multiline, disableMarks)

  const plugins = [hashtagPlugin]

  // call main proseEditor hook to manage editorState
  const [editorState, setEditorState] = useDefaultProseState({
    schema,
    onChange,
    content,
    multiline,
    disableMarks,
    disableEdit,
    plugins
  })

  // hashtagUnderConstruction is the text beginning with # while the cursor is on it.
  const [hashtagUnderConstruction, setHashtagUnderConstruction] = useState()

  // suggestionsState is the state management of the displaying of hashtag options and their manipulation
  // (highlighting and selecting a hashtag).
  const [suggestionsState, dispatchSuggestionsChange] = useReducer(
    suggestionsStateReducer.bind(
      null,
      hashtagUnderConstruction,
      hashtagSuggestionList
    ),
    {}
  )

  // Whenever the state changes - color all the hashtags
  useEffect(() => {
    if (!editorState) return

    setHashtagUnderConstruction(
      findHashtagUnderCursor(editorState.doc, editorState.selection)
    )
  }, [editorState])

  // Whenever the hashtag under construction changed its state - update the suggestions list
  useEffect(() => {
    if (hashtagUnderConstruction) {
      dispatchSuggestionsChange({ type: OPEN_HASHTAG_OPTIONS })
    } else {
      dispatchSuggestionsChange({ type: CLOSE_HASHTAG_OPTIONS })
    }
  }, [hashtagUnderConstruction])

  // Insert the selected hashtag as a resolved hashtag.
  // When "selectedIndex" is passed as -1, it implies creating a new hashtag out of the one under construction.
  const insertHashtag = selectedIndex => {
    if (isNaN(selectedIndex)) selectedIndex = suggestionsState.highlightIndex

    // resolve the new hashtag text - either from the selected suggestion or from the hashtag under construction.
    const newHashtagText =
      selectedIndex > -1
        ? suggestionsState.suggestionList[selectedIndex]
        : hashtagUnderConstruction.value

    const newHashtagNode = schema.node(
      HASHTAG_SCHEMA_NODE_TYPE,
      null,
      schema.text(newHashtagText)
    )

    const interimState = EditorState.create({
      doc: schema.nodeFromJSON(editorState.doc.toJSON()),
      selection: editorState.selection,
      plugins: editorState.plugins,
      storedMarks: editorState.storedMarks
    })

    const transaction = interimState.tr

    // insert the resolved hashtag node instead of the hashtag under construction.
    transaction.replaceRangeWith(
      hashtagUnderConstruction.start + 1,
      hashtagUnderConstruction.end + 1,
      newHashtagNode
    )

    // insert a space in a text node after the resolved hashtag.
    transaction.insert(
      transaction.mapping.map(hashtagUnderConstruction.end + 1),
      schema.text(' ')
    )

    setEditorState(interimState.apply(transaction))

    // Invoke back the keyboard on mobile
    focusViewHook()

    // Add new selection into the global list of hashtags
    if (selectedIndex === -1) onNewHashtag(newHashtagText)
  }

  // whenever the state changes -
  // update selection to encopass the resolved hashtag in its entirety, in case the selection or cursor are touching it.
  useEffect(() => {
    // TODO: refactor - isolate $cursor from either $cursor or $head of the selection. In case the selection is before the hashtag in the beginning of the paragraph - ensure it is inserted as text node.
    if (!editorState) return

    const $cursor = editorState.selection.$cursor || editorState.selection.$head
    if (
      editorState.selection.$cursor &&
      editorState.selection.$cursor.node(editorState.selection.$cursor.depth)
        .type.name === HASHTAG_SCHEMA_NODE_TYPE
    ) {
      const hashtagSelection = NodeSelection.create(
        editorState.doc,
        $cursor.before($cursor.depth)
      )
      const tr = editorState.tr
      tr.setSelection(hashtagSelection)

      setEditorState(editorState.apply(tr))
      return
    }

    // TODO: find another solution - perhaps - confirming there is a whitespace after the end of the hashtag and only then moving the cursor after the whitespace.
    if (
      editorState.selection.$cursor &&
      editorState.selection.$cursor.nodeBefore &&
      editorState.selection.$cursor.nodeBefore.type.name ===
        HASHTAG_SCHEMA_NODE_TYPE
    ) {
      const newSelection = TextSelection.create(
        editorState.doc,
        editorState.selection.$cursor.pos + 1
      )

      const tr = editorState.tr
      tr.setSelection(newSelection)
      setEditorState(editorState.apply(tr))
    }
  }, [editorState, setEditorState])

  return [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ]
}

// create the schema specs for an editor with hashtags.
function hashtagSchema(multiline, disableMarks) {
  const schema = new Schema({
    nodes: schemaBasic.spec.nodes
      .addBefore('text', HASHTAG_SCHEMA_NODE_TYPE, {
        group: 'inline',
        atom: true,
        content: 'text*',
        inline: true,
        toDOM: node => [HASHTAG_SCHEMA_NODE_TYPE, 0],
        parseDOM: [{ tag: HASHTAG_SCHEMA_NODE_TYPE }],
        selectable: true,
        draggable: true
      })
      .update(
        'doc',
        multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
      ),
    marks: disableMarks ? undefined : schemaBasic.spec.marks
  })
  return schema
}

export {
  MOVE_TO_NEXT_HASHTAG,
  MOVE_TO_PREV_HASHTAG,
  SET_HIGHLIGHT_INDEX,
  OPEN_HASHTAG_OPTIONS,
  CLOSE_HASHTAG_OPTIONS,
  hashtagSchema,
  useHashtagProseState as default
}
