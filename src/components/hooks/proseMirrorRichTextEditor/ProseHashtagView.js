import React from 'react'
import { connect } from 'react-redux'
import { addHashtag as addHashtagAction } from '../../../redux/actions'
import ProseView from './ProseView'
import SelectHashtags from './SelectHashtags'
import useHashtagProseState, * as actionTypes from './hashtagHook'

const ProseHashtagView = props => {
  const {
    validHashtags,
    multiline = true,
    addHashtagAction,
    onChange,
    id,
    content,
    includeMarks = true,
    autoFocus,
    label,
    disableEdit = false
  } = props

  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ] = useHashtagProseState({
    validHashtags,
    addHashtagAction,
    onChange,
    content,
    multiline,
    includeMarks,
    disableEdit
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
          suggestions={suggestionsState.list}
        />
      )}
    </>
  )
}

const mapStateToProps = (state, ownProps) => ({
  validHashtags: state.validHashtags
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  addHashtagAction: newHashtag => {
    dispatch(addHashtagAction(newHashtag))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProseHashtagView)
