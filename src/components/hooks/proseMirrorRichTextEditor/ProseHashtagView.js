import { schema } from 'prosemirror-schema-basic'
import { useProseState } from './proseMirrorHooks'
import ProseView from './ProseView'
import React from 'react'

export default props => {
  const editorState = useProseState(schema)
  return <ProseView editorState={editorState} />
}
