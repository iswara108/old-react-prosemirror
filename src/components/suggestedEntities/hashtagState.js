import { useReducer, useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import useDefaultProseState from '../base/defaultProseState'
import hashtagSchema from './hashtagSchema'
import hashtagPlugin from './hashtagPlugin'
import {
  HASHTAG_SCHEMA_NODE_TYPE,
  findHashtagUnderCursor
} from './hashtagUtils'
import {
  suggestionsStateReducer,
  SET_HASHTAG_UNDER_CONSTRUCTION
} from './hashtagSuggestionsRecuder'

function useHashtagProseState({
  value,
  onChange,
  defaultValue,
  multiline,
  disableMarks,
  disableEdit,
  hashtagSuggestionList,
  focusViewHook,
  onNewHashtag,
  hashtagsType
}) {
  const schema = hashtagSchema(multiline, disableMarks)

  // create default editorState
  const [editorState, setEditorState] = useDefaultProseState({
    value,
    onChange,
    defaultValue,
    schema,
    multiline,
    disableMarks,
    disableEdit,
    plugins: [hashtagPlugin]
  })

  // optionsState is the state management of the displaying of hashtag options and their manipulation
  // (highlighting and selecting a hashtag to be resolved, or creating a new hashtag option).
  const [optionsState, dispatchOptionsChange] = useReducer(
    // Use "bind" to insert an argument before the standard "state, action" arguments of React.useReducer
    suggestionsStateReducer.bind(null, hashtagSuggestionList),
    {} // initial state empty
  )

  // Update state if the selection cursor is under a hashtag under construction.
  useEffect(() => {
    if (!editorState) return

    dispatchOptionsChange({
      type: SET_HASHTAG_UNDER_CONSTRUCTION,
      payload: findHashtagUnderCursor(editorState.doc, editorState.selection)
    })
  }, [editorState])

  // Insert the selected hashtag as a resolved hashtag.
  // When "selectedIndex" is passed as -1, it implies creating a new hashtag out of the one under construction.
  const resolveHashtag = selectedIndex => {
    if (isNaN(selectedIndex)) selectedIndex = optionsState.highlightIndex
    // resolve the new hashtag text - either from the selected option or from the hashtag under construction.
    const newHashtagText =
      selectedIndex > -1
        ? optionsState.suggestionList[selectedIndex]
        : optionsState.hashtagUnderConstruction.value

    const newHashtagNode = schema.node(
      HASHTAG_SCHEMA_NODE_TYPE,
      null,
      schema.text(newHashtagText)
    )

    const interimState = EditorState.fromJSON(
      { schema, plugins: editorState.plugins },
      editorState.toJSON()
    )

    // initialize a transaction
    const transaction = interimState.tr

    // insert the resolved hashtag node instead of the hashtag under construction.
    transaction.replaceRangeWith(
      optionsState.hashtagUnderConstruction.start + 1,
      optionsState.hashtagUnderConstruction.end + 1,
      newHashtagNode
    )

    // insert a space in a text node after the resolved hashtag.
    transaction.insert(
      transaction.mapping.map(optionsState.hashtagUnderConstruction.end + 1),
      schema.text(' ')
    )

    setEditorState(interimState.apply(transaction))

    // Invoke back the keyboard (for mobile)
    focusViewHook()

    // Add new selection into the global list of hashtags
    if (selectedIndex === -1) onNewHashtag(newHashtagText)
  }

  return [editorState, optionsState, dispatchOptionsChange, resolveHashtag]
}

export default useHashtagProseState
