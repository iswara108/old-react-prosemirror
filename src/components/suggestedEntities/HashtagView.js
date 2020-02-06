import React from 'react'
import ProseView from '../base/ProseView'
import SelectHashtags from './SelectHashtags'
import useHashtagProseState from './hashtagState'
import * as actionTypes from './hashtagSuggestionsRecuder'

const HashtagView = React.forwardRef((props, parentRef) => {
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
    hashtagSuggestionList = [],
    hashtags: hashtagsType,
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
    resolveHashtag
  ] = useHashtagProseState({
    defaultValue,
    value,
    onChange,
    multiline,
    disableMarks,
    disableEdit,
    hashtagSuggestionList,
    onNewHashtag,
    focusViewHook,
    hashtagsType
  })

  // Handle moving up/down and selecting hashtags.
  const handleKeyDown = e => {
    if (isNaN(suggestionsState.highlightIndex)) return

    switch (e.key) {
      case 'ArrowDown':
        dispatchSuggestionsChange({ type: actionTypes.MOVE_TO_NEXT_HASHTAG })
        e.preventDefault()
        break
      case 'ArrowUp':
        dispatchSuggestionsChange({ type: actionTypes.MOVE_TO_PREV_HASHTAG })
        e.preventDefault()
        break
      case 'Enter':
        dispatchSuggestionsChange({ type: actionTypes.CLOSE_HASHTAG_OPTIONS })
        resolveHashtag()
        e.preventDefault()
        break
      default:
    }
  }

  const setHighlightIndex = index =>
    dispatchSuggestionsChange({
      type: actionTypes.SET_HIGHLIGHT_INDEX,
      payload: { index }
    })

  const setAsSelected = index => {
    dispatchSuggestionsChange({
      type: actionTypes.CLOSE_HASHTAG_OPTIONS
    })
    resolveHashtag(index)
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
        <SelectHashtags
          inputValue={suggestionsState.hashtagUnderConstruction.value}
          highlightIndex={suggestionsState.highlightIndex || 0}
          setHighlightIndex={setHighlightIndex}
          setAsSelected={setAsSelected}
          suggestionList={suggestionsState.suggestionList}
        />
      )}
    </>
  )
})

export default HashtagView
