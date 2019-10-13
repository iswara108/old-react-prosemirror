import React, { useReducer, useState, useEffect } from 'react'
import deburr from 'lodash/deburr'
import { EditorState, NodeSelection, Plugin } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { useProseState } from './proseMirrorHooks'
import hashtagPlugin from './hashtagPlugin'
import { findHashtagUnderCursor } from './hashtagUtils'

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

function useHashtagProseState({
  validHashtags,
  addHashtagAction,
  onChange,
  initialDoc,
  multiline,
  includeMarks,
  disableEdit
}) {
  function suggestionsStateReducer(state, action) {
    switch (action.type) {
      case OPEN_HASHTAG_OPTIONS:
        const list = getSuggestions(
          hashtagUnderConstruction.value,
          validHashtags
        )
        console.log('opening', state, action, list)
        return {
          hashtagUnderConstruction,
          list,
          highlightIndex: list.length
            ? Math.min(
                list.length - 1,
                state.highlightIndex === -1 ? 0 : state.highlightedIndex
              ) || 0
            : -1
        }
      case CLOSE_HASHTAG_OPTIONS:
        return {}
      case MOVE_TO_NEXT_HASHTAG:
        return {
          ...state,
          highlightIndex:
            state.highlightIndex < state.list.length - 1
              ? state.highlightIndex + 1
              : state.highlightIndex
        }
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

  const schema = hashtagSchema(multiline, includeMarks)

  const plugins = []
  if (disableEdit) {
    plugins.push(
      new Plugin({
        filterTransaction: transaction => !transaction.docChanged
      })
    )
  }
  plugins.push(hashtagPlugin)
  const rawEditorState = useProseState(schema, plugins, initialDoc)
  const [editorState, setEditorState] = useState()
  const [hashtagUnderConstruction, setHashtagUnderConstruction] = useState()
  const [suggestionsState, dispatchSuggestionsChange] = useReducer(
    suggestionsStateReducer,
    {}
  )

  // Whenever the document changed due to user input
  useEffect(() => {
    if (rawEditorState) {
      if (editorState) {
        setHashtagUnderConstruction(
          findHashtagUnderCursor(rawEditorState.doc, rawEditorState.selection)
        )

        if (
          !editorState.doc.eq(rawEditorState.doc) ||
          !editorState.selection.eq(rawEditorState.selection)
        ) {
          setEditorState(rawEditorState)
        }
      } else {
        setEditorState(rawEditorState)
      }
    }
  }, [rawEditorState])

  // Whenever the hashtag under construction changed its state
  useEffect(() => {
    if (hashtagUnderConstruction) {
      console.log('dispatching open')
      console.log(suggestionsState)
      dispatchSuggestionsChange({ type: OPEN_HASHTAG_OPTIONS })
    } else {
      dispatchSuggestionsChange({ type: CLOSE_HASHTAG_OPTIONS })
    }
  }, [hashtagUnderConstruction])

  // Insert the selected hashtag into the WYSIWYG editor
  const insertHashtag = index => {
    if (isNaN(index)) index = suggestionsState.highlightIndex
    const newHashtag =
      index > -1 ? suggestionsState.list[index] : hashtagUnderConstruction.value
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

    tr.insert(
      tr.mapping.map(hashtagUnderConstruction.end + 1),
      schema.text(' ')
    )

    setEditorState(interimState.apply(tr))

    // Add new selection into the global list of hashtags
    if (index === -1) addHashtagAction(newHashtag)
  }

  useEffect(() => {
    if (editorState) {
      console.log(editorState.selection.anchor, editorState.selection.head)
      // If cursor (empty selection) on a resolved hashtag, select the whole hashtag
      const $cursor = editorState.selection.$cursor
      if ($cursor) {
        if ($cursor.parent.type.name === 'hashtag') {
          const hashtagSelection = NodeSelection.create(
            editorState.doc,
            $cursor.before($cursor.depth)
          )
          const tr = editorState.tr
          tr.setSelection(hashtagSelection)

          // Do not proceed with further hooks here.
          // "OnChange" will be called on the next iteration of this function (due to the call to setEditorState)
          return setEditorState(editorState.apply(tr))
        }
      }

      if (onChange) onChange(editorState.doc.toJSON())
    }
  }, [editorState])

  return [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ]
}

function hashtagSchema(multiline, includeMarks) {
  return new Schema({
    nodes: schemaBasic.spec.nodes
      .addBefore('text', 'hashtag', {
        group: 'inline',
        atom: true,
        content: 'inline*',
        inline: true,
        toDOM: node => ['hashtag', 0],
        parseDOM: [{ tag: 'hashtag' }],
        selectable: true,
        draggable: true
      })
      .update(
        'doc',
        multiline ? schemaBasic.spec.nodes.get('doc') : { content: 'block' }
      ),
    marks: includeMarks ? schemaBasic.spec.marks : undefined
  })
}

export {
  MOVE_TO_NEXT_HASHTAG,
  MOVE_TO_PREV_HASHTAG,
  SET_HIGHLIGHT_INDEX,
  OPEN_HASHTAG_OPTIONS,
  CLOSE_HASHTAG_OPTIONS,
  useHashtagProseState as default
}
