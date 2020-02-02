import React from 'react'
import ProseView from './ProseView'
import useDefaultProseState from './defaultProseState'

export default props => {
  const {
    id,
    defaultValue,
    value,
    onChange,
    multiline = false,
    disableMarks = false,
    autoFocus = false,
    disableEdit = false
  } = props

  const [innerEditorState] = useDefaultProseState({
    value,
    onChange,
    defaultValue,
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
