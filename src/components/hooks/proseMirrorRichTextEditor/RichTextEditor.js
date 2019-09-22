import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { undo, redo, history } from 'prosemirror-history'
import { schema } from 'prosemirror-schema-basic'
import hashtagPlugin from './hashtagPlugin'
import { addHashtag } from '../../../redux/actions'
import Hashtags from './Hashtags'
import 'prosemirror-view/style/prosemirror.css'
import './richTextEditor.css'
import Button from '@material-ui/core/Button'

const RichTextEditor = ({ autoFocus, addHashtag }) => {
  const MOVE_TO_NEXT_HASHTAG = 'MOVE_TO_NEXT_HASHTAG'
  const MOVE_TO_PREV_HASHTAG = 'MOVE_TO_PREV_HASHTAG'
  const RESET_HASHTAG_HIGHLIGHT = 'RESET_HASHTAG_HIGHLIGHT'
  const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
  const SET_SELECTED = 'SET_SELECTED'

  const [view, setView] = useState(null)
  const [hashtagUnderCursor, setHashtagUnderCursor] = useState(null)
  const [displayHashtags, setDisplayHashtags] = useState(false)
  const hashtagOptionsInit = {
    highlightIndex: 0
  }
  const [hashtagOptions, dispatchHashtagChange] = React.useReducer(
    hashtagOptionsReducer,
    hashtagOptionsInit
  )

  function hashtagOptionsReducer(state, action) {
    switch (action.type) {
      case MOVE_TO_NEXT_HASHTAG:
        return { highlightIndex: state.highlightIndex + 1 }
      case MOVE_TO_PREV_HASHTAG:
        return { highlightIndex: state.highlightIndex - 1 }
      case RESET_HASHTAG_HIGHLIGHT:
        return { highlightIndex: 0 }
      case SET_HIGHLIGHT_INDEX:
        return { highlightIndex: action.payload.index }
      case SET_SELECTED:
        return { ...state, selected: action.payload.index }
      default:
        return state
    }
  }
  const editorRef = useRef()
  const setHighlightIndex = (newIndex, add) => {
    if (add === 1) {
      dispatchHashtagChange({ type: MOVE_TO_NEXT_HASHTAG })
    } else if (add === -1) {
      dispatchHashtagChange({ type: MOVE_TO_PREV_HASHTAG })
    }
  }

  useEffect(() => {
    setView(
      new EditorView(null, {
        state: EditorState.create({
          schema,
          plugins: [
            keymap({
              'Mod-z': undo,
              'Mod-y': redo
            }),
            hashtagPlugin({
              setHashtagUnderCursor,
              addHashtag,
              setHighlightIndex
            })
          ]
        })
      })
    )
  }, [addHashtag])

  useEffect(() => {
    if (view) {
      editorRef.current.appendChild(view.dom)
      if (autoFocus) {
        view.focus()
      }
    }
  }, [view, autoFocus])

  useEffect(() => {
    setDisplayHashtags(!!hashtagUnderCursor)
    if (!hashtagUnderCursor) {
      dispatchHashtagChange({ type: RESET_HASHTAG_HIGHLIGHT })
    }
  }, [hashtagUnderCursor])

  return (
    <>
      <div ref={editorRef}></div>
      {displayHashtags && hashtagUnderCursor && hashtagOptions && (
        <Hashtags
          inputValue={hashtagUnderCursor.value.slice(1)}
          highlightedIndex={hashtagOptions.highlightIndex || 0}
          setHighlightIndex={index =>
            dispatchHashtagChange({
              type: SET_HIGHLIGHT_INDEX,
              payload: { index }
            })
          }
          setAsSelected={index =>
            dispatchHashtagChange({ type: SET_SELECTED, payload: { index } })
          }
        />
      )}
    </>
  )
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => {
  return { addHashtag }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RichTextEditor)
