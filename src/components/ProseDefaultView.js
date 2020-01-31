import React from 'react'
import ProseView from './ProseView'
import useDefaultProseState from './proseDefaultHook'

export default props => {
  const {
    id,
    initialContent,
    onChange,
    multiline = false,
    disableMarks = false,
    autoFocus = false,
    disableEdit = false
  } = props

  const [editorState] = useDefaultProseState({
    onChange,
    initialContent,
    multiline,
    disableMarks,
    disableEdit
  })

  return (
    <>
      <ProseView id={id} editorState={editorState} autoFocus={autoFocus} />
    </>
  )
}
