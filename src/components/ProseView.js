import React, { useEffect } from 'react'
import 'prosemirror-view/style/prosemirror.css'

import { useProseView } from './proseMirrorHooks'

export default props => {
  const { dom, editorView } = useProseView(props)

  useEffect(() => {
    if (props.setEditorView) props.setEditorView(editorView)
  }, [editorView, props])

  const propsToDiv = { ...props }
  delete propsToDiv.editorState
  delete propsToDiv.setEditorView

  return <div ref={dom} {...propsToDiv} />
}
