import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, Node } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap'
import { undo, redo, history } from 'prosemirror-history'
import deburr from 'lodash/deburr'
import hashtagPlugin from './hashtagPlugin'
import { addHashtag } from '../../../redux/actions'
import SelectHashtags from './SelectHashtags'
import 'prosemirror-view/style/prosemirror.css'
import './richTextEditor.css'

const hashtagSchema = new Schema({
  nodes: {
    hashtag: {
      group: 'inline',
      atom: true,
      content: 'inline*',
      inline: true,
      toDOM: node => ['hashtag', 0],
      parseDOM: [{ tag: 'hashtag' }]
    },
    text: { group: 'inline' },
    paragraph: {
      content: 'inline*',
      toDOM: () => ['p', 0],
      parseDOM: [{ tag: 'p' }]
    },
    doc: { content: 'paragraph' }
  }
})

const RichTextEditor = ({ autoFocus, addHashtag, validHashtags }) => {
  const MOVE_TO_NEXT_HASHTAG = 'MOVE_TO_NEXT_HASHTAG'
  const MOVE_TO_PREV_HASHTAG = 'MOVE_TO_PREV_HASHTAG'
  const RESET_HASHTAG_HIGHLIGHT = 'RESET_HASHTAG_HIGHLIGHT'
  const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
  const OPEN_HASHTAG_OPTIONS = 'OPEN_HASHTAG_OPTIONS'
  const CLOSE_HASHTAG_OPTIONS = 'CLOSE_HASHTAG_OPTIONS'

  const [view, setView] = useState(null)
  const [hashtagUnderConstruction, setHashtagUnderConstruction] = useState(null)
  const hashtagOptionsInit = {
    highlightIndex: 0
  }
  const [hashtagOptions, dispatchHashtagChange] = React.useReducer(
    hashtagOptionsReducer,
    hashtagOptionsInit
  )

  function hashtagOptionsReducer(state, action) {
    switch (action.type) {
      case OPEN_HASHTAG_OPTIONS:
        return { highlightIndex: state.highlightIndex || 0 }
      case CLOSE_HASHTAG_OPTIONS:
        return {}
      case MOVE_TO_NEXT_HASHTAG:
        return { highlightIndex: state.highlightIndex + 1 }
      case MOVE_TO_PREV_HASHTAG:
        return { highlightIndex: state.highlightIndex - 1 }
      case RESET_HASHTAG_HIGHLIGHT:
        return { highlightIndex: 0 }
      case SET_HIGHLIGHT_INDEX:
        return { highlightIndex: action.payload.index }
      default:
        return state
    }
  }

  const setAsSelected = index => {
    dispatchHashtagChange({ type: CLOSE_HASHTAG_OPTIONS })
    if (index === undefined) {
      index = hashtagOptions.highlightIndex
    }
    const tr = view.state.tr
    const newLocal = getSuggestions(
      hashtagUnderConstruction.value.slice(1),
      validHashtags
    )[index]

    view.dispatch(
      tr.replaceRangeWith(
        hashtagUnderConstruction.start + 1,
        hashtagUnderConstruction.end + 1,
        Node.fromJSON(hashtagSchema, {
          type: 'hashtag',
          content: [
            {
              type: 'text',
              text: newLocal
            }
          ]
        })
      )
    )
    view.focus()
  }
  const moveHighlightIndex = (newIndex, add) => {
    if (add === 1) {
      dispatchHashtagChange({ type: MOVE_TO_NEXT_HASHTAG })
    } else if (add === -1) {
      dispatchHashtagChange({ type: MOVE_TO_PREV_HASHTAG })
    }
  }

  const editorRef = useRef()
  const plugin = useRef(
    hashtagPlugin({
      setHashtagUnderConstruction,
      addHashtag,
      moveHighlightIndex
    })
  )
  useEffect(() => {
    if (plugin) {
      plugin.current.setHighlightedAsSelected = setAsSelected
    }
  }, [plugin, setAsSelected, hashtagSchema])

  class HashtagView {
    constructor(node) {
      this.dom = document.createElement('hashtag')
      this.dom.textContent = node.textContent
      window['dom-' + node.textContent] = this.dom
    }
    selectNode() {
      this.dom.classList.add('ProseMirror-selectednode')
    }
  }

  useEffect(() => {
    setView(
      new EditorView(null, {
        state: EditorState.create({
          schema: hashtagSchema,
          plugins: [
            keymap({
              'Mod-z': undo,
              'Mod-y': redo
            }),
            history(),
            plugin.current
          ]
        }),
        nodeViews: {
          hashtag(node, view, getPos) {
            return new HashtagView(node, view, getPos)
          }
        }
      })
    )
  }, [addHashtag])

  useEffect(() => {
    if (view) {
      editorRef.current.appendChild(view.dom)

      if (autoFocus) {
        view.focus()
      }
      window.view = view
    }
  }, [view, autoFocus])

  useEffect(() => {
    if (hashtagUnderConstruction) {
      dispatchHashtagChange({ type: OPEN_HASHTAG_OPTIONS })
    } else {
      dispatchHashtagChange({ type: CLOSE_HASHTAG_OPTIONS })
    }
  }, [hashtagUnderConstruction])

  function getSuggestions(
    value,
    validHashtags = [],
    { showEmpty = false } = {}
  ) {
    const inputValue = deburr(value.trim()).toLowerCase()
    const inputLength = inputValue.length
    let count = 0
    return inputLength === 0 && !showEmpty
      ? []
      : validHashtags.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.slice(0, inputLength).toLowerCase() === inputValue

          if (keep) {
            count += 1
          }

          return keep
        })
  }

  return (
    <>
      <div ref={editorRef}></div>
      {hashtagUnderConstruction && !isNaN(hashtagOptions.highlightIndex) && (
        <SelectHashtags
          inputValue={hashtagUnderConstruction.value.slice(1)}
          highlightedIndex={hashtagOptions.highlightIndex || 0}
          setHighlightIndex={index =>
            dispatchHashtagChange({
              type: SET_HIGHLIGHT_INDEX,
              payload: { index }
            })
          }
          setAsSelected={setAsSelected}
          suggestions={getSuggestions(
            hashtagUnderConstruction.value.slice(1),
            validHashtags
          )}
        />
      )}
    </>
  )
}

const mapStateToProps = state => ({ validHashtags: state.validHashtags })

const mapDispatchToProps = (dispatch, ownProps) => {
  return { addHashtag }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RichTextEditor)
