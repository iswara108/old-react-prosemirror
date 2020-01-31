import React from 'react'
import ProseView from './ProseView'
import useDefaultProseState from './proseDefaultHook'

export default props => {
  const {
    id,
    initialContent,
    editorState: parentControlledState,
    onStateChange,
    multiline = false,
    disableMarks = false,
    autoFocus = false,
    disableEdit = false
  } = props

  const [innerEditorState] = useDefaultProseState({
    parentControlledState,
    onStateChange,
    initialContent,
    multiline,
    disableMarks,
    disableEdit
  })

  return (
    <>
      <ProseView id={id} editorState={innerEditorState} autoFocus={autoFocus} />
    </>
  )
}
