import React /* eslint-disable-line no-unused-vars */, {
  useReducer,
  useState,
  useEffect,
  useLayoutEffect
} from 'react'

import { EditorState, NodeSelection, TextSelection } from 'prosemirror-state'
import useDefaultProseState from '../base/defaultProseState'
import hashtagSchema from './hashtagSchema'
import hashtagPlugin from './hashtagPlugin'
import {
  HASHTAG_SCHEMA_NODE_TYPE,
  findHashtagUnderCursor
} from './hashtagUtils'
import {
  suggestionsStateReducer,
  OPEN_HASHTAG_OPTIONS,
  CLOSE_HASHTAG_OPTIONS
} from './hashtagSuggestionsRecuder'

function useHashtagProseState({
  focusViewHook,
  onChange,
  initialContent,
  multiline,
  disableMarks,
  disableEdit,
  hashtagSuggestionList,
  onNewHashtag,
  hashtagsType
}) {
  const schema = hashtagSchema(multiline, disableMarks)

  // create default editorState
  const [editorState, setEditorState] = useDefaultProseState({
    schema,
    onChange,
    initialContent,
    multiline,
    disableMarks,
    disableEdit,
    plugins: [hashtagPlugin]
  })

  // hashtagUnderConstruction is the text beginning with # while the cursor is on it.
  const [hashtagUnderConstruction, setHashtagUnderConstruction] = useState()

  // optionsState is the state management of the displaying of hashtag options and their manipulation
  // (highlighting and selecting a hashtag to be resolved, or creating a new hashtag option).
  const [optionsState, dispatchOptionsChange] = useReducer(
    // Use "bind" to insert two arguments before the standard "state, action" arguments of React.useReducer
    suggestionsStateReducer.bind(
      null,
      hashtagUnderConstruction,
      hashtagSuggestionList
    ),
    {} // initial state empty
  )

  // Update state if the selection cursor is under a hashtag under construction.
  useEffect(() => {
    if (!editorState) return

    setHashtagUnderConstruction(
      findHashtagUnderCursor(editorState.doc, editorState.selection)
    )
  }, [editorState])

  // Whenever the hashtag under construction changed its state - update the options list
  useEffect(() => {
    if (hashtagUnderConstruction) {
      dispatchOptionsChange({ type: OPEN_HASHTAG_OPTIONS })
    } else {
      dispatchOptionsChange({ type: CLOSE_HASHTAG_OPTIONS })
    }
  }, [hashtagUnderConstruction])

  // Insert the selected hashtag as a resolved hashtag.
  // When "selectedIndex" is passed as -1, it implies creating a new hashtag out of the one under construction.
  const resolveHashtag = selectedIndex => {
    if (isNaN(selectedIndex)) selectedIndex = optionsState.highlightIndex

    // resolve the new hashtag text - either from the selected option or from the hashtag under construction.
    const newHashtagText =
      selectedIndex > -1
        ? optionsState.suggestionList[selectedIndex]
        : hashtagUnderConstruction.value

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

    // Invoke back the keyboard (for mobile)
    focusViewHook()

    // Add new selection into the global list of hashtags
    if (selectedIndex === -1) onNewHashtag(newHashtagText)
  }

  // whenever the state changes -
  // update selection to encopass the resolved hashtag in its entirety, in case the selection or cursor are touching it.

  // TODO : refactor to a reducer.
  useLayoutEffect(() => {
    if (!editorState) return

    const selectionEndAsHashtag = [
      editorState.selection.$anchor,
      editorState.selection.$head
    ].find(
      selectionEnd =>
        selectionEnd.node(selectionEnd.depth).type.name ===
        HASHTAG_SCHEMA_NODE_TYPE
    )

    if (selectionEndAsHashtag) {
      console.info('at end', editorState.selection.toString())
      const hashtagSelection = NodeSelection.create(
        editorState.doc,
        selectionEndAsHashtag.before(selectionEndAsHashtag.depth)
      )

      const transaction = editorState.tr
      transaction.setSelection(hashtagSelection)
      setEditorState(editorState.apply(transaction))
    }
  }, [editorState, setEditorState])

  useLayoutEffect(() => {
    if (!editorState) return

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

      const transaction = editorState.tr
      transaction.setSelection(newSelection)
      setEditorState(editorState.apply(transaction))
    }
  }, [editorState, setEditorState])

  return [editorState, optionsState, dispatchOptionsChange, resolveHashtag]
}

export default useHashtagProseState
