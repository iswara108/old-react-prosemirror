import React from 'react'
import ProseView from './ProseView'
import useDefaultProseState from './proseDefaultHook'

export default props => {
  const {
    id,
    content,
    onChange,
    multiline = false,
    disableMarks = false,
    autoFocus = false,
    disableEdit = false
  } = props

  const [editorState] = useDefaultProseState({
    onChange,
    content,
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
