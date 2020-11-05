import React from 'react'
import ProseView from '../../base/ProseView'
import SuggestionDropdown from './SuggestionDropdown'
import useTaggingEditorState from '../state/taggingEditorState'
import * as actionTypes from '../state/suggestionsRecuder'
import handleKeyOnSuggestions from '../state/handleKeyOnSuggestions'
import './tagging.css'
import { SuggestionType } from '../state/suggestionsRecuder'

type Props = {
  id: string
  defaultValue: string
  value: string
  onChange: () => void
  multiline: boolean
  disableMarks: boolean
  autoFocus: boolean
  disableEdit: boolean
  setEditorView: () => void
  hashtagSuggestions: SuggestionType[]
  mentionSuggestions: SuggestionType[]
  tags: 'mutable' | 'immutable'
  onNewHashtag: () => void
}

const TaggingEditorView = React.forwardRef<React.RefObject<any>, Props>(
  (props, parentRef) => {
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

    const contentEditableDom = React.createRef<HTMLDivElement>()

    if (parentRef) (parentRef as any).current = contentEditableDom.current // forward optional parent ref to DOM element.

    const focusViewHook = () =>
      (contentEditableDom.current?.querySelector(
        'div[contentEditable]'
      ) as HTMLDivElement)?.focus()

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

    const setHighlightIndex = (index: number) =>
      dispatchSuggestionsChange({
        type: actionTypes.SET_HIGHLIGHT_INDEX,
        payload: { index }
      })

    const setAsSelected = (index: number) => {
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
          onBlur={() =>
            setTimeout(
              () =>
                dispatchSuggestionsChange({
                  type: actionTypes.CLOSE_TAG_SUGGESTIONS
                }),
              200 // allow actions suggestion dropdown before closing (such as mouse click to resolve a suggestion)
            )
          }
        />
        {dispatchSuggestionsChange &&
          !isNaN(suggestionsState.highlightIndex) && (
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
  }
)

export default TaggingEditorView
