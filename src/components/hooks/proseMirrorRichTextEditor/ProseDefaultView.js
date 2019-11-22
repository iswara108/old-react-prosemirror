import React from 'react'
import { connect } from 'react-redux'
import ProseView from './ProseView'
import useDefaultProseState from './proseDefaultHook'

const ProseDefaultView = props => {
  const {
    multiline = true,
    onChange,
    id,
    content,
    includeMarks = true,
    autoFocus,
    label,
    disableEdit = false
  } = props

  const [
    editorState,
    suggestionsState,
    dispatchSuggestionsChange,
    insertHashtag
  ] = useDefaultProseState({
    onChange,
    content,
    multiline,
    includeMarks,
    disableEdit
  })


  return (
    <>
      <ProseView
        id={id}
        editorState={editorState}
        autoFocus={autoFocus}
      />
    </>
  )
}

const mapStateToProps = (state, ownProps) => ({
})

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProseDefaultView)
