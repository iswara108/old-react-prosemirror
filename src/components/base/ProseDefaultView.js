import React from 'react'
import ProseView from './ProseView'
import useDefaultProseState from './defaultProseState'

const ProseDefaultView = React.forwardRef((props, ref) => {
  const {
    id,
    defaultValue,
    value,
    onChange,
    multiline = false,
    disableMarks = false,
    autoFocus = false,
    disableEdit = false,
    setEditorView
  } = props

  const [editorState] = useDefaultProseState({
    defaultValue,
    value,
    onChange,
    multiline,
    disableMarks,
    disableEdit
  })

  return (
    <>
      <ProseView
        id={id}
        editorState={editorState}
        autoFocus={autoFocus}
        setEditorView={setEditorView}
        ref={ref}
      />
    </>
  )
})

export default ProseDefaultView
