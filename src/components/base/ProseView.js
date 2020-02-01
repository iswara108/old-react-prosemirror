import React, { useState, useLayoutEffect, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'

import './proseMirror.css'

export default props => {
  const { editorState, autoFocus } = props
  const [editorView, setEditorView] = useState(null)

  const dom = useRef(document.createElement('div'))

  // Initialize editor view on the first time the state exists
  useLayoutEffect(() => {
    if (editorState && !editorView) {
      setEditorView(
        new EditorView(dom.current, {
          state: editorState
        })
      )
    }
  }, [editorState, editorView])

  // Update view whenever the state changes
  useLayoutEffect(() => {
    if (editorView && editorState) {
      if (!editorView.state !== editorState) {
        editorView.updateState(editorState)
      }
    }
  }, [editorState, editorView])

  // if autoFocus applies - focus upon the creation of the view
  useLayoutEffect(() => {
    if (editorView && autoFocus) editorView.focus()
  }, [editorView, autoFocus])

  // remove non HTML props
  const propsToDiv = { ...props }
  delete propsToDiv.editorState
  delete propsToDiv.setEditorView

  return <div ref={dom} {...propsToDiv} />
}
