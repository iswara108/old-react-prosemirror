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
const RESET_HASHTAG_HIGHLIGHT = 'RESET_HASHTAG_HIGHLIGHT'
const SET_HIGHLIGHT_INDEX = 'SET_HIGHLIGHT_INDEX'
const OPEN_HASHTAG_OPTIONS = 'OPEN_HASHTAG_OPTIONS'
const CLOSE_HASHTAG_OPTIONS = 'CLOSE_HASHTAG_OPTIONS'

function getSuggestions(value, validHashtags = []) {
  console.log('getting suggestions', value, validHashtags)
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
      case RESET_HASHTAG_HIGHLIGHT:
        return { ...state, highlightIndex: 0 }
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

  // 3. Allow selecting a hashtag and replacing the hashtag under construction with the selected final hashtag
  // 4. Allow not selecting a hashtag, returning the hashtag under construction to a regular text
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

  const insertHashtag = () => {
    // const newHashtagNode = schema.node(
    //   'hashtag',
    //   null,
    //   schema.text('test text')
    // )
    // const secondState = EditorState.create({
    //   doc: editorState.doc,
    //   selection: editorState.selection
    //   // plugins: editorState.plugins,
    //   // storedMarks: editorState.storedMarks
    // })

    // debugger
    // secondState.tr.replaceRangeWith(1, 3, newHashtagNode)
    // debugger
    // console.log('new node:', newHashtagNode)
    // const tr = editorState.tr
    // // tr.insertText(' test ', 2, 4)
    // tr.replaceRangeWith(1, 3, newHashtagNode)
    // debugger
    // const aaa = editorState.apply(tr)

    // setEditorState(editorState.apply(tr))
    const parsed = {
      doc: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'OmOm and ' },
              {
                type: 'hashtag',
                content: [{ type: 'text', text: 'computer' }]
              },
              { type: 'text', text: ' Ys;ldfkgjsd;flkgsjdf;lgk jsdfg dfes' }
            ]
          }
        ]
      },
      selection: { type: 'text', anchor: 1, head: 1 }
    }

    setEditorState(
      EditorState.fromJSON({ schema, plugins: editorState.plugins }, parsed)
    )
  }

  useEffect(() => {
    if (editorState && editorState.doc.toString().match(/hashtag/)) {
      // editorState.tr.insert

      const newHashtagNode = schema.node(
        'hashtag',
        null,
        schema.text('test text')
      )
      const secondState = EditorState.create({
        doc: editorState.doc,
        selection: editorState.selection
        // plugins: editorState.plugins,
        // storedMarks: editorState.storedMarks
      })

      const tr = secondState.tr
      // tr.insertText(' test ', 2, 4)
      tr.replaceRangeWith(21, 23, newHashtagNode)
      debugger
    }
  }, [editorState])
  return [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ]
}

const ProseHashtagView = ({ validHashtags, multiline = true }) => {
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

  // const hashtagSchema = new Schema({
  //     nodes: schemaBasic.spec.nodes
  //       .addBefore('text', 'hashtag', {
  //         group: 'inline',
  //         atom: true,
  //         content: 'inline*',
  //         inline: true,
  //         toDOM: node => ['hashtag', 0],
  //         parseDOM: [{ tag: 'hashtag' }]
  //       })
  //       .update(
  //         'doc',
  //         multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
  //       ),
  //     marks: schemaBasic.spec.marks
  //   })
  console.log(hashtagSchema)
  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ] = useHashtagProseState(
    multiline ? schemaBasic : hashtagSchema,
    validHashtags
  )

  return (
    <>
      <ProseView
        editorState={editorState}
        onKeyDown={e => {
          switch (e.key) {
            case 'ArrowDown':
              dispatchSuggestionsChange({ type: MOVE_TO_NEXT_HASHTAG })
              break
            case 'ArrowUp':
              dispatchSuggestionsChange({ type: MOVE_TO_PREV_HASHTAG })
              break
            case 'Enter':
              insertHashtag()
              dispatchSuggestionsChange({ type: SET_HIGHLIGHT_INDEX })
          }
        }}
      />
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
          // setAsSelected={setAsSelected}
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
