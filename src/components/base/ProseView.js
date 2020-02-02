import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef
} from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'

import './proseMirror.css'

const ProseView = forwardRef((props, ref) => {
  const { editorState, autoFocus } = props
  const [editorView, setEditorView] = useState(null)

  const contentEditableDom = useRef(document.createElement('div'))
  if (ref) ref.current = contentEditableDom.current // forward optional parent ref to DOM element.

  // Initialize editor view on the first time the state exists.
  useLayoutEffect(() => {
    if (editorState && !editorView) {
      setEditorView(
        new EditorView(contentEditableDom.current, {
          state: editorState
        })
      )
    }
  }, [editorState, editorView])

  // export editorView to parent once it is initialized.
  useEffect(() => {
    if (props.setEditorView) props.setEditorView(editorView)
  }, [props, editorView, props.setEditorView])

  // Update view whenever the state changes
  useLayoutEffect(() => {
    if (editorView && editorState) {
      if (!editorView.state !== editorState) {
        editorView.updateState(editorState)
      }
    }
  }, [editorState, editorView])

  // if autoFocus applies - focus upon the creation of the view.
  useLayoutEffect(() => {
    if (editorView && autoFocus) editorView.focus()
  }, [editorView, autoFocus])

  // remove non-HTML props.
  const propsToDiv = { ...props }
  delete propsToDiv.editorState
  delete propsToDiv.setEditorView

  return <div ref={contentEditableDom} {...propsToDiv} />
})

export default ProseView
