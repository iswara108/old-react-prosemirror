import { useReducer, useEffect } from 'react'
import { EditorState } from 'prosemirror-state'

import useDefaultProseState from '../../base/defaultProseState'
import taggingSchema from '../model/taggingSchema'
import hashtagPlugin from './hashtagPlugin'
import mentionPlugin from './mentionPlugin'
import createImmutableNodePlugin from './immutableNodePlugin'
import {
  HASHTAG_SCHEMA_NODE_TYPE,
  MENTION_SCHEMA_NODE_TYPE,
  findEditingHashtag,
  findEditingMention
} from '../model/taggingUtils'
import {
  suggestionsStateReducer,
  SET_EDITING_HASHTAG,
  SET_EDITING_MENTION,
  CLOSE_TAG_SUGGESTIONS
} from './suggestionsRecuder'

function useTaggingEditorState({
  value,
  onChange,
  defaultValue,
  multiline,
  disableMarks,
  disableEdit,
  hashtagSuggestions,
  mentionSuggestions,
  focusViewHook,
  onNewHashtag,
  tags
}) {
  const schema = taggingSchema(multiline, disableMarks)

  // create default editorState
  const [editorState, setEditorState] = useDefaultProseState({
    value,
    onChange,
    defaultValue,
    schema,
    multiline,
    disableMarks,
    disableEdit,
    plugins: [
      hashtagPlugin,
      mentionPlugin,
      createImmutableNodePlugin(HASHTAG_SCHEMA_NODE_TYPE),
      createImmutableNodePlugin(MENTION_SCHEMA_NODE_TYPE)
    ]
  })

  // optionsState is the state management of the displaying of hashtag options and their manipulation
  // (highlighting and selecting a hashtag to be resolved, or creating a new hashtag option).
  const [suggestionsState, dispatchSuggestion] = useReducer(
    // Use "bind" to insert an argument before the standard "state, action" arguments of React.useReducer
    suggestionsStateReducer.bind(null, hashtagSuggestions, mentionSuggestions),
    {} // initial state empty
  )

  // Update state if the selection cursor is under a hashtag under construction.
  useEffect(() => {
    if (!editorState) return

    const editingHashtag = findEditingHashtag(
      editorState.doc,
      editorState.selection
    )
    const editingMention = findEditingMention(
      editorState.doc,
      editorState.selection
    )

    if (editingHashtag)
      dispatchSuggestion({
        type: SET_EDITING_HASHTAG,
        payload: findEditingHashtag(editorState.doc, editorState.selection)
      })

    if (editingMention)
      dispatchSuggestion({
        type: SET_EDITING_MENTION,
        payload: findEditingMention(editorState.doc, editorState.selection)
      })

    if (!editingMention && !editingHashtag)
      dispatchSuggestion({ type: CLOSE_TAG_SUGGESTIONS })
  }, [editorState])

  // Insert the selected hashtag as a resolved hashtag.
  // When "selectedIndex" is passed as -1, it implies creating a new tag out of the one being edited.
  const resolveTag = selectedIndex => {
    // if there is no selected index, set it to the one highlighted by the mouseover
    if (isNaN(selectedIndex)) selectedIndex = suggestionsState.highlightIndex

    // If there is no suggestion for a mention - abort
    if (
      suggestionsState.currentEditingTag.value.slice(0, 1) === '@' &&
      !suggestionsState.suggestionList.length
    )
      return

    // resolve the new tag text - either from the selected suggestion or from the tag being edited.
    const newTagText =
      selectedIndex > -1
        ? suggestionsState.suggestionList[selectedIndex].tagName
        : suggestionsState.currentEditingTag.value

    const newTagNode = schema.node(
      newTagText.slice(0, 1) === '#'
        ? HASHTAG_SCHEMA_NODE_TYPE
        : MENTION_SCHEMA_NODE_TYPE,
      null,
      schema.text(newTagText)
    )

    const interimState = EditorState.fromJSON(
      { schema, plugins: editorState.plugins },
      editorState.toJSON()
    )

    // initialize a transaction
    const transaction = interimState.tr

    // insert the resolved tag node instead of the editing tag.
    transaction.replaceRangeWith(
      suggestionsState.currentEditingTag.start + 1,
      suggestionsState.currentEditingTag.end + 1,
      newTagNode
    )

    // insert a space in a text node after the resolved tag.
    transaction.insert(
      transaction.mapping.map(suggestionsState.currentEditingTag.end + 1),
      schema.text(' ')
    )

    // apply transaction into the state
    setEditorState(interimState.apply(transaction))

    // Invoke back the keyboard (for mobile)
    focusViewHook()

    // Add new selection into the global list of hashtags
    if (selectedIndex === -1) onNewHashtag(newTagText)
  }

  return [editorState, suggestionsState, dispatchSuggestion, resolveTag]
}

export default useTaggingEditorState
