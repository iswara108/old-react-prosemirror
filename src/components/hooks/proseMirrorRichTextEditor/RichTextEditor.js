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

const RichTextEditor = ({ autoFocus, addHashtag }) => {
  const [view, setView] = useState(null)
  const [hashtagUnderCursor, setHashtagUnderCursor] = useState(null)
  const [displayHashtags, setDisplayHashtags] = useState(false)
  const editorRef = useRef()

  useEffect(() => {
    setView(
      new EditorView(null, {
        state: EditorState.create({
          schema,
          plugins: [
            keymap({ 'Mod-z': undo, 'Mod-y': redo }),
            history(),
            hashtagPlugin({ setHashtagUnderCursor, addHashtag })
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
  }, [hashtagUnderCursor])

  return (
    <>
      <div ref={editorRef} />
      {displayHashtags && hashtagUnderCursor && (
        <Hashtags currentlyEditing={hashtagUnderCursor.value.slice(1)} />
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
