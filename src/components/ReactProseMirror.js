import React from 'react'
import PropTypes from 'prop-types'

import TaggingEditorView from './tagging/view/TaggingEditorView'
import ProseDefaultView from './base/ProseDefaultView'

const ReactProseMirror = React.forwardRef((props, ref) => {
  const { tags, hashtagSuggestions = [], peopleSuggestionList = [] } = props

  return tags ? (
    <TaggingEditorView
      {...props}
      hashtagSuggestions={hashtagSuggestions}
      peopleSuggestionList={peopleSuggestionList}
      ref={ref}
    />
  ) : (
    <ProseDefaultView ref={ref} {...props} />
  )
})

ReactProseMirror.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  tags: PropTypes.oneOf([
    //'mutable', // not supported at the moment
    'immutable'
  ]),
  hashtagSuggestions: PropTypes.array,
  multiline: PropTypes.bool
}

export default ReactProseMirror
