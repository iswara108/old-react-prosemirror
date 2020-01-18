import React from 'react'
import ProseView from './ProseView'
import SelectHashtags from './SelectHashtags'
import useHashtagProseState, * as actionTypes from './hashtagHook'

export default props => {
  const {
    multiline = false,
    onChange,
    id,
    content,
    disableMarks = false,
    autoFocus,
    disableEdit = false,
    hashtagSuggestionList = [],
    onNewHashtag,
    hashtags: hashtagsType
  } = props

  // TODO: Refactor to useRef
  // This is used to trigger the keyboard back on mobile
  const focusViewHook = () => document.querySelector(`#${id} > div`).focus()

  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ] = useHashtagProseState({
    focusViewHook,
    onChange,
    content,
    multiline,
    disableMarks,
    disableEdit,
    hashtagSuggestionList,
    onNewHashtag,
    hashtagsType
  })

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
        insertHashtag()
        e.preventDefault()
        break
      default:
    }
  }

  return (
    <>
      <ProseView
        id={id}
        editorState={editorState}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
      />
      {dispatchSuggestionsChange && !isNaN(suggestionsState.highlightIndex) && (
        <SelectHashtags
          inputValue={suggestionsState.hashtagUnderConstruction.value}
          highlightIndex={suggestionsState.highlightIndex || 0}
          setHighlightIndex={index =>
            dispatchSuggestionsChange({
              type: actionTypes.SET_HIGHLIGHT_INDEX,
              payload: { index }
            })
          }
          setAsSelected={index => {
            dispatchSuggestionsChange({
              type: actionTypes.CLOSE_HASHTAG_OPTIONS
            })
            insertHashtag(index)
          }}
          suggestionList={suggestionsState.suggestionList}
        />
      )}
    </>
  )
}
