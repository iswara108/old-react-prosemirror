import React from 'react'
import { useProseView } from './proseMirrorHooks'

export default ({ editorState }) => {
  const dom = useProseView(editorState)
  return <div ref={dom} />
}
