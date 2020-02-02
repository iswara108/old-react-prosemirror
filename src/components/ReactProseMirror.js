import React from 'react'
import PropTypes from 'prop-types'

import ProseHashtagView from './suggestedEntities/ProseHashtagView'
import ProseDefaultView from './base/ProseDefaultView'

const ReactProseMirror = props => {
  const { hashtags, hashtagSuggestionList = [] } = props

  return hashtags ? (
    <ProseHashtagView
      {...props}
      hashtagSuggestionList={hashtagSuggestionList}
    />
  ) : (
    <ProseDefaultView {...props} />
  )
}

ReactProseMirror.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  hashtags: PropTypes.oneOf(['mutable', 'immutable']),
  hashtagSuggestionList: PropTypes.array,
  multiline: PropTypes.bool
}

export default ReactProseMirror
