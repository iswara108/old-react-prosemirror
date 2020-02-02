import React from 'react'
import ProseView from '../base/ProseView'
import SelectHashtags from './SelectHashtags'
import useHashtagProseState from './hashtagHook'
import * as actionTypes from './hashtagSuggestionsRecuder'

const ProseHashtagView = React.forwardRef((props, parentRef) => {
  const {
    multiline = false,
    parentControlledState,
    onStateChange,
    id,
    initialContent,
    disableMarks = false,
    autoFocus,
    disableEdit = false,
    hashtagSuggestionList = [],
    onNewHashtag,
    hashtags: hashtagsType,
    setEditorView
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
    focusViewHook,
    parentControlledState,
    onStateChange,
    initialContent,
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
        resolveHashtag()
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
        setEditorView={setEditorView}
        ref={contentEditableDom}
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
            resolveHashtag(index)
          }}
          suggestionList={suggestionsState.suggestionList}
        />
      )}
    </>
  )
})

export default ProseHashtagView
