import React from 'react'
import { useProseView } from './proseMirrorHooks'

export default props => {
  const dom = useProseView(props)

  const propsToDiv = { ...props }
  delete propsToDiv.editorState

  return <div ref={dom} {...propsToDiv} />
}
