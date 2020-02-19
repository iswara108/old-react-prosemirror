import React from 'react'
import ProseView from '../../base/ProseView'
import SuggestionDropdown from './SuggestionDropdown'
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
    mentionSuggestions = [],
    tags,
    onNewHashtag
  } = props

  const contentEditableDom = React.createRef()
  if (parentRef) parentRef.current = contentEditableDom.current // forward optional parent ref to DOM element.

  const focusViewHook = () =>
    contentEditableDom.current.querySelector('div[contentEditable]').focus()

  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    resolveTag
  ] = useTaggingEditorState({
    defaultValue,
    value,
    onChange,
    multiline,
    disableMarks,
    disableEdit,
    hashtagSuggestions,
    mentionSuggestions,
    onNewHashtag,
    focusViewHook,
    tags
  })

  // Handle moving up/down and selecting mentions.
  const handleKeyDown = handleKeyOnSuggestions(
    suggestionsState,
    dispatchSuggestionsChange,
    resolveTag
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
    resolveTag(index)
  }

  return (
    <div>
      <ProseView
        id={id}
        editorState={editorState}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        setEditorView={setEditorView}
        ref={contentEditableDom}
        onBlur={e =>
          setTimeout(
            () =>
              dispatchSuggestionsChange({
                type: actionTypes.CLOSE_TAG_SUGGESTIONS
              }),
            200 // allow actions suggestion dropdown before closing (such as mouse click to resolve a suggestion)
          )
        }
      />
      {dispatchSuggestionsChange && !isNaN(suggestionsState.highlightIndex) && (
        <SuggestionDropdown
          inputValue={suggestionsState.currentEditingTag.value}
          highlightIndex={suggestionsState.highlightIndex || 0}
          setHighlightIndex={setHighlightIndex}
          setAsSelected={setAsSelected}
          suggestionList={suggestionsState.suggestionList}
          readOnly={suggestionsState.suggestionType === 'mention'}
        />
      )}
    </div>
  )
})

export default TaggingEditorView
