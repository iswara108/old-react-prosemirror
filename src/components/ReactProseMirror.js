import React from 'react'
import PropTypes from 'prop-types'

import HashtagView from './suggestedEntities/HashtagView'
import ProseDefaultView from './base/ProseDefaultView'

const ReactProseMirror = React.forwardRef((props, ref) => {
  const { hashtags, hashtagSuggestionList = [] } = props

  return hashtags ? (
    <HashtagView
      {...props}
      hashtagSuggestionList={hashtagSuggestionList}
      ref={ref}
    />
  ) : (
    <ProseDefaultView ref={ref} {...props} />
  )
})

ReactProseMirror.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  hashtags: PropTypes.oneOf(['mutable', 'immutable']),
  hashtagSuggestionList: PropTypes.array,
  multiline: PropTypes.bool
}

export default ReactProseMirror
