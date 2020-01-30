import { useState, useLayoutEffect, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import './richTextEditor.css'

function useProseView({ editorState, autoFocus }) {
  const dom = useRef(document.createElement('div'))
  const [editorView, setEditorView] = useState(null)

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

  // Update view wheenver the state changes
  useLayoutEffect(() => {
    if (editorView && editorState) {
      if (editorView.state !== editorState) {
        editorView.updateState(editorState)
      }
    }
  }, [editorState, editorView])

  useLayoutEffect(() => {
    if (editorView && autoFocus) editorView.focus()
  }, [editorView, autoFocus])

  return { dom, editorView }
}

export { useProseView }
