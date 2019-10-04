import { schema as schemaBasic } from 'prosemirror-schema-basic'
import React, { useReducer, useState, useEffect } from 'react'
import deburr from 'lodash/deburr'
import { connect } from 'react-redux'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { addHashtag } from '../../../redux/actions'
import { useProseState } from './proseMirrorHooks'
import ProseView from './ProseView'
import hashtagPlugin from './hashtagPlugin'
import { findHashtagUnderCursor } from './hashtagUtils'
import SelectHashtags from './SelectHashtags'

const MOVE_TO_NEXT_HASHTAG = 'MOVE_TO_NEXT_HASHTAG'
const MOVE_TO_PREV_HASHTAG = 'MOVE_TO_PREV_HASHTAG'
const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
const OPEN_HASHTAG_OPTIONS = 'OPEN_HASHTAG_OPTIONS'
const CLOSE_HASHTAG_OPTIONS = 'CLOSE_HASHTAG_OPTIONS'

function getSuggestions(value, validHashtags = []) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  return inputLength === 0
    ? []
    : validHashtags.filter(
        suggestion =>
          suggestion.slice(0, inputLength).toLowerCase() === inputValue
      )
}

function useHashtagProseState(schema, validHashtags) {
  function suggestionsStateReducer(state, action) {
    switch (action.type) {
      case OPEN_HASHTAG_OPTIONS:
        return {
          highlightIndex: state.highlightIndex || 0,
          hashtagUnderConstruction,
          list: getSuggestions(
            hashtagUnderConstruction.value.slice(1),
            validHashtags
          )
        }
      case CLOSE_HASHTAG_OPTIONS:
        return {}
      case MOVE_TO_NEXT_HASHTAG:
        return { ...state, highlightIndex: state.highlightIndex + 1 }
      case MOVE_TO_PREV_HASHTAG:
        return {
          ...state,
          highlightIndex:
            state.highlightIndex >= 0
              ? state.highlightIndex - 1
              : state.highlightIndex
        }
      case SET_HIGHLIGHT_INDEX:
        return {
          ...state,
          highlightIndex: action.payload
            ? action.payload.index
            : state.highlightIndex
        }
      default:
        return state
    }
  }

  const rawEditorState = useProseState(schema, [hashtagPlugin])
  const [editorState, setEditorState] = useState()
  const [hashtagUnderConstruction, setHashtagUnderConstruction] = useState()
  const [suggestionsState, dispatchSuggestionsChange] = useReducer(
    suggestionsStateReducer,
    {}
  )
  // 1. Decorate hashtag under construction - Done
  // 2. Open sugestions list while there is such a hashtag under construction. - Done
  //    Allow the list to change highlight status - Done
  // 3. Allow selecting a hashtag and replacing the hashtag under construction with the selected final hashtag - Done
  // 4. Allow not selecting a hashtag, returning the hashtag under construction to a regular text - Done

  // 5. Allow creating a new hashtag by displaying the new hashtag as first option, and allow to select it, adding it to the validHashtags list.

  useEffect(() => {
    if (rawEditorState) {
      if (editorState) {
        setHashtagUnderConstruction(
          findHashtagUnderCursor(rawEditorState.doc, rawEditorState.selection)
        )

        if (JSON.stringify(editorState) !== JSON.stringify(rawEditorState)) {
          setEditorState(rawEditorState)
        }
      } else {
        setEditorState(rawEditorState)
      }
    }
  }, [rawEditorState])

  useEffect(() => {
    if (hashtagUnderConstruction) {
      dispatchSuggestionsChange({ type: OPEN_HASHTAG_OPTIONS })
    } else {
      dispatchSuggestionsChange({ type: CLOSE_HASHTAG_OPTIONS })
    }
  }, [hashtagUnderConstruction])

  const insertHashtag = index => {
    if (isNaN(index)) index = suggestionsState.highlightIndex
    const newHashtag = suggestionsState.list[index]
    const newHashtagNode = schema.node('hashtag', null, schema.text(newHashtag))

    const interimState = EditorState.create({
      doc: schema.nodeFromJSON(editorState.doc.toJSON()),
      selection: editorState.selection,
      plugins: editorState.plugins,
      storedMarks: editorState.storedMarks
    })

    const tr = interimState.tr
    tr.replaceRangeWith(
      hashtagUnderConstruction.start + 1,
      hashtagUnderConstruction.end + 1,
      newHashtagNode
    )
    setEditorState(interimState.apply(tr))
  }

  return [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ]
}

const ProseHashtagView = ({ validHashtags, multiline = true }) => {
  const hashtagSchema = new Schema({
    nodes: schemaBasic.spec.nodes
      .addBefore('text', 'hashtag', {
        group: 'inline',
        atom: true,
        content: 'inline*',
        inline: true,
        toDOM: node => ['hashtag', 0],
        parseDOM: [{ tag: 'hashtag' }]
      })
      .update(
        'doc',
        multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
      ),
    marks: schemaBasic.spec.marks
  })
  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ] = useHashtagProseState(hashtagSchema, validHashtags)

  const handleKeyDown = e => {
    switch (e.key) {
      case 'ArrowDown':
        dispatchSuggestionsChange({ type: MOVE_TO_NEXT_HASHTAG })
        break
      case 'ArrowUp':
        dispatchSuggestionsChange({ type: MOVE_TO_PREV_HASHTAG })
        break
      case 'Enter':
        insertHashtag()
        dispatchSuggestionsChange({ type: CLOSE_HASHTAG_OPTIONS })
    }
  }

  return (
    <>
      <ProseView editorState={editorState} onKeyDown={handleKeyDown} />
      {dispatchSuggestionsChange && !isNaN(suggestionsState.highlightIndex) && (
        <SelectHashtags
          inputValue={suggestionsState.hashtagUnderConstruction.value.slice(1)}
          highlightIndex={suggestionsState.highlightIndex || 0}
          setHighlightIndex={index =>
            dispatchSuggestionsChange({
              type: SET_HIGHLIGHT_INDEX,
              payload: { index }
            })
          }
          setAsSelected={index => {
            insertHashtag(index)
            dispatchSuggestionsChange({ type: CLOSE_HASHTAG_OPTIONS })
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
  addHashtag: newHashtag => dispatch(addHashtag(newHashtag))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProseHashtagView)
