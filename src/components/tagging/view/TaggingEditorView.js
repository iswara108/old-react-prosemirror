import React from 'react'
import ProseView from '../../base/ProseView'
import SelectSuggestion from './SelectSuggestion'
import useTaggingEditorState from '../state/taggingEditorState'
import * as actionTypes from '../state/suggestionsRecuder'
import handleKeyOnSuggestions from '../state/handleKeyOnSuggestions'
import './tagging.css'

const TaggingEditorView = React.forwardRef((props, parentRef) => {
  const {
    id,
    defaultValue,
    value,
    onChange,
    multiline = false,
    disableMarks = false,
    autoFocus = false,
    disableEdit = false,
    setEditorView,
    hashtagSuggestions = [],
    tags,
    onNewHashtag,
    people = [],
    onNewPerson
  } = props

  const contentEditableDom = React.createRef()
  if (parentRef) parentRef.current = contentEditableDom.current // forward optional parent ref to DOM element.

  const focusViewHook = () =>
    contentEditableDom.current.querySelector('div[contentEditable]').focus()

  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    resolveMention
  ] = useTaggingEditorState({
    defaultValue,
    onChange,
    multiline,
    disableMarks,
    disableEdit,
    hashtagSuggestions,
    onNewHashtag,
    focusViewHook,
    tags
  })

  // Handle moving up/down and selecting mentions.
  const handleKeyDown = handleKeyOnSuggestions(
    suggestionsState,
    dispatchSuggestionsChange,
    resolveMention
  )

  const setHighlightIndex = index =>
    dispatchSuggestionsChange({
      type: actionTypes.SET_HIGHLIGHT_INDEX,
      payload: { index }
    })

  const setAsSelected = index => {
    dispatchSuggestionsChange({
      type: actionTypes.CLOSE_TAG_SUGGESTIONS
    })
    resolveMention(index)
  }

  return (
    <>
      <ProseView
        id={id}
        editorState={editorState}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        setEditorView={setEditorView}
        ref={contentEditableDom}
      />
      {dispatchSuggestionsChange && !isNaN(suggestionsState.highlightIndex) && (
        <SelectSuggestion
          inputValue={suggestionsState.currentEditingTag.value}
          highlightIndex={suggestionsState.highlightIndex || 0}
          setHighlightIndex={setHighlightIndex}
          setAsSelected={setAsSelected}
          suggestionList={suggestionsState.suggestionList}
        />
      )}
    </>
  )
})

export default TaggingEditorView
