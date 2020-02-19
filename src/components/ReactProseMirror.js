import React from 'react'
import PropTypes from 'prop-types'

import TaggingEditorView from './tagging/view/TaggingEditorView'
import ProseDefaultView from './base/ProseDefaultView'

const ReactProseMirror = React.forwardRef((props, ref) => {
  const { tags, hashtagSuggestions = [], mentionSuggestions = [] } = props

  return tags ? (
    <TaggingEditorView
      {...props}
      hashtagSuggestions={hashtagSuggestions}
      mentionSuggestions={mentionSuggestions}
      ref={ref}
    />
  ) : (
    <ProseDefaultView ref={ref} {...props} />
  )
})

function checkForTagName(
  propValue,
  key,
  componentName,
  location,
  propFullName
) {
  if (!propValue[key].tagName) {
    return new Error(
      `Invalid prop '${propFullName}' supplied to 'ReactProseMirror'. Missing property 'tagName'`
    )
  }
}

ReactProseMirror.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  tags: PropTypes.oneOf([
    //'mutable', // not supported at the moment
    'immutable'
  ]),
  hashtagSuggestions: PropTypes.arrayOf(checkForTagName),
  mentionSuggestions: PropTypes.arrayOf(checkForTagName),
  multiline: PropTypes.bool
}

export default ReactProseMirror
