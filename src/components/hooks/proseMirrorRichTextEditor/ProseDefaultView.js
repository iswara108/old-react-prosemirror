import React from 'react'

import ProseView from './ProseView'
import useDefaultProseState from './proseDefaultHook'

export default props => {
  const {
    multiline = true,
    onChange,
    id,
    content,
    includeMarks = true,
    autoFocus,
    disableEdit = false
  } = props

  const [editorState] = useDefaultProseState({
    onChange,
    content,
    multiline,
    includeMarks,
    disableEdit
  })

  return (
    <>
      <ProseView id={id} editorState={editorState} autoFocus={autoFocus} />
    </>
  )
}
