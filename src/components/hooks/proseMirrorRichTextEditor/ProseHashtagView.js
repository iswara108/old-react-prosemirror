import { schema } from 'prosemirror-schema-basic'
import { Plugin } from 'prosemirror-state'
import { useProseState } from './proseMirrorHooks'
import ProseView from './ProseView'
import React from 'react'

export default props => {
  const editorState = useProseState(schema, [
    new Plugin({
      view: () => ({
        update: view => console.log('I am an additinoal plugin')
      })
    })
  ])
  const { validHashtags } = props

  return <ProseView editorState={editorState} />
}
